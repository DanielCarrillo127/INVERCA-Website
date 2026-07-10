// ============================================================
//  COOMSOCIAL · Función serverless de registro (Vercel)
//  Ruta pública: POST /api/entries   (mismo dominio que el front)
//  Vercel ejecuta este archivo como Serverless Function; NO uses app.listen.
// ============================================================
const { MongoClient } = require("mongodb");

const {
  MONGODB_URI,
  DB_NAME = "coomsocial",
  COLLECTION_NAME = "entries",
} = process.env;

// --- Conexión cacheada entre invocaciones (evita agotar conexiones) ---
let cached = global._mongo;
if (!cached) cached = global._mongo = { client: null, promise: null };

async function getCollection() {
  if (!MONGODB_URI) throw new Error("Falta MONGODB_URI en las variables de entorno.");
  if (!cached.promise) {
    cached.promise = new MongoClient(MONGODB_URI).connect().then(async (client) => {
      cached.client = client;
      const col = client.db(DB_NAME).collection(COLLECTION_NAME);
      await col.createIndex({ cedula: 1 }, { unique: true });
      return col;
    });
  }
  const client = await cached.promise;
  return client.db(DB_NAME).collection(COLLECTION_NAME);
}

// ---- Validación del lado del servidor (defensa en profundidad) ----
const REQUIRED = [
  "nombre", "apellidos", "tipoDocumento", "cedula", "telefono", "sexo",
  "departamento", "municipio", "sectorEconomico",
];
const NAME_RE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'.-]{2,}$/;

function validate(body) {
  const errors = {};
  REQUIRED.forEach((k) => {
    if (!body[k] || String(body[k]).trim() === "") errors[k] = "Campo obligatorio.";
  });
  if (body.nombre && !NAME_RE.test(String(body.nombre).trim())) errors.nombre = "Nombre no válido.";
  if (body.apellidos && !NAME_RE.test(String(body.apellidos).trim())) errors.apellidos = "Apellidos no válidos.";
  if (body.cedula && !/^\d{5,12}$/.test(String(body.cedula).trim())) errors.cedula = "Documento no válido.";
  if (body.telefono && !/^\d{7,10}$/.test(String(body.telefono).trim())) errors.telefono = "Teléfono no válido.";
  if (body.fechaNacimiento) {
    const d = new Date(body.fechaNacimiento);
    if (isNaN(d.getTime()) || d > new Date()) errors.fechaNacimiento = "Fecha no válida.";
  }
  return errors;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Método no permitido." });
  }

  try {
    // Vercel ya parsea el body JSON; se contempla el caso de string por si acaso.
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

    const errors = validate(body);
    if (Object.keys(errors).length > 0)
      return res.status(400).json({ message: "Datos inválidos.", errors });

    const doc = {
      nombre: String(body.nombre).trim(),
      apellidos: String(body.apellidos).trim(),
      tipoDocumento: String(body.tipoDocumento).trim(),
      cedula: String(body.cedula).trim(),
      telefono: String(body.telefono).trim(),
      sexo: String(body.sexo).trim(),
      fechaNacimiento: String(body.fechaNacimiento || "").trim(),
      direccion: String(body.direccion || "").trim(),
      departamento: String(body.departamento).trim(),
      municipio: String(body.municipio).trim(),
      sectorEconomico: String(body.sectorEconomico).trim(),
      createdAt: new Date(),
    };

    const collection = await getCollection();
    const result = await collection.insertOne(doc);
    return res.status(201).json({ message: "Registro guardado.", id: result.insertedId });
  } catch (err) {
    if (err && err.code === 11000)
      return res.status(409).json({ message: "Este documento ya se encuentra registrado." });
    console.error("✖ Error al guardar:", err);
    return res.status(500).json({ message: "Error interno al guardar el registro." });
  }
};
