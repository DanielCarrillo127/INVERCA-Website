// Lógica del panel /gestor: autenticación por ENV, filtros, paginación y stats.
// Funciones puras que reciben la colección -> reutilizables en serverless y Express.
const crypto = require("crypto");

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 horas

const getSecret = () =>
  process.env.SESSION_SECRET ||
  process.env.GESTOR_PASSWORD ||
  "coomsocial-dev-secret";

// Comparación en tiempo constante (evita fugas por timing).
const safeEqual = (a, b) => {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
};

function verifyCredentials(user, password) {
  const U = process.env.GESTOR_USER;
  const P = process.env.GESTOR_PASSWORD;
  if (!U || !P) return false;
  return safeEqual(user || "", U) && safeEqual(password || "", P);
}

// Token = base64(payload).hmac  — firmado con el secreto del servidor.
function signToken() {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== "string") return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  if (!safeEqual(sig, expected)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch (e) {
    return false;
  }
}

function bearerFromReq(req) {
  const h = req.headers.authorization || req.headers.Authorization || "";
  return h.startsWith("Bearer ") ? h.slice(7) : "";
}

const requireAuth = (req) => verifyToken(bearerFromReq(req));

// Construye el filtro de Mongo desde los query params.
function buildFilter(q = {}) {
  const filter = {};
  const search = (q.search || "").trim();
  if (search) {
    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rx = new RegExp(safe, "i");
    filter.$or = [
      { nombre: rx },
      { apellidos: rx },
      { cedula: rx },
      { telefono: rx },
    ];
  }
  ["departamento", "municipio", "sectorEconomico", "sexo", "tipoDocumento"].forEach(
    (k) => {
      if (q[k] && String(q[k]).trim()) filter[k] = String(q[k]).trim();
    }
  );
  if (q.liderPolitico && String(q.liderPolitico).trim())
    filter.liderPolitico = String(q.liderPolitico).trim();
  return filter;
}

async function fetchEntries(collection, q = {}) {
  const filter = buildFilter(q);
  const page = Math.max(1, parseInt(q.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(q.limit, 10) || 10));
  const total = await collection.countDocuments(filter);
  const rows = await collection
    .find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  return {
    rows,
    total,
    page,
    limit,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
}

// Todos los registros que cumplan el filtro (para exportar). Tope de seguridad.
async function fetchAll(collection, q = {}) {
  return collection
    .find(buildFilter(q))
    .sort({ createdAt: -1 })
    .limit(20000)
    .toArray();
}

// Días hasta el próximo cumpleaños a partir de una fecha ISO (ignora el año).
function daysUntilBirthday(iso, now) {
  // Parseamos los componentes directamente: `new Date("YYYY-MM-DD")` asume UTC
  // y desfasaría el día en zonas horarias negativas (ej. Colombia UTC-5).
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return null;
  const month = Number(m[2]) - 1;
  const day = Number(m[3]);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let next = new Date(now.getFullYear(), month, day);
  if (next < today) next = new Date(now.getFullYear() + 1, month, day);
  return Math.round((next - today) / 86400000);
}

async function computeStats(collection) {
  const total = await collection.countDocuments({});

  const bySectorAgg = await collection
    .aggregate([
      { $group: { _id: "$sectorEconomico", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    .toArray();
  const bySector = bySectorAgg.map((s) => ({
    sector: s._id || "(sin sector)",
    count: s.count,
  }));

  // Próximos cumpleaños: solo quienes tienen fecha registrada.
  const withDob = await collection
    .find(
      { fechaNacimiento: { $nin: ["", null] } },
      { projection: { nombre: 1, apellidos: 1, fechaNacimiento: 1 } }
    )
    .toArray();
  const now = new Date();
  const upcomingBirthdays = withDob
    .map((r) => ({
      nombre: `${r.nombre || ""} ${r.apellidos || ""}`.trim(),
      fechaNacimiento: r.fechaNacimiento,
      days: daysUntilBirthday(r.fechaNacimiento, now),
    }))
    .filter((r) => r.days !== null)
    .sort((a, b) => a.days - b.days)
    .slice(0, 10);

  return { total, bySector, upcomingBirthdays };
}

module.exports = {
  verifyCredentials,
  signToken,
  verifyToken,
  requireAuth,
  buildFilter,
  fetchEntries,
  fetchAll,
  computeStats,
};
