// ============================================================
//  COOMSOCIAL · API de registro de usuarios
//  Recibe el formulario y guarda cada envío en MongoDB.
//  Ejecutar:  npm run server   (o)   node server/index.js
// ============================================================
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const gestor = require("../api/_lib/gestor");

const {
  MONGODB_URI,
  DB_NAME = "coomsocial",
  COLLECTION_NAME = "entries",
  API_PORT = 4000,
  CORS_ORIGIN = "*",
} = process.env;

if (!MONGODB_URI) {
  console.error("✖ Falta MONGODB_URI en el archivo .env");
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

const client = new MongoClient(MONGODB_URI);
let collection;

async function connectDB() {
  await client.connect();
  collection = client.db(DB_NAME).collection(COLLECTION_NAME);
  await collection.createIndex({ cedula: 1 }, { unique: true });
  console.log(`✔ Conectado a MongoDB · ${DB_NAME}.${COLLECTION_NAME}`);
}

// ---- Validación del lado del servidor (defensa en profundidad) ----
const REQUIRED = [
  "nombre",
  "apellidos",
  "tipoDocumento",
  "cedula",
  "telefono",
  "sexo",
  "departamento",
  "municipio",
  "sectorEconomico",
];

const NAME_RE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'.-]{2,}$/;

function validate(body) {
  const errors = {};
  REQUIRED.forEach((k) => {
    if (!body[k] || String(body[k]).trim() === "")
      errors[k] = "Campo obligatorio.";
  });
  if (body.nombre && !NAME_RE.test(String(body.nombre).trim()))
    errors.nombre = "Nombre no válido.";
  if (body.apellidos && !NAME_RE.test(String(body.apellidos).trim()))
    errors.apellidos = "Apellidos no válidos.";
  if (body.cedula && !/^\d{5,12}$/.test(String(body.cedula).trim()))
    errors.cedula = "Documento no válido.";
  if (body.telefono && !/^\d{7,10}$/.test(String(body.telefono).trim()))
    errors.telefono = "Teléfono no válido.";
  if (body.fechaNacimiento) {
    const d = new Date(body.fechaNacimiento);
    if (isNaN(d.getTime()) || d > new Date())
      errors.fechaNacimiento = "Fecha no válida.";
  }
  if (body.liderPolitico && !/^\d{5,12}$/.test(String(body.liderPolitico).trim()))
    errors.liderPolitico = "Cédula de líder no válida.";
  return errors;
}

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/api/entries", async (req, res) => {
  try {
    const errors = validate(req.body || {});
    if (Object.keys(errors).length > 0)
      return res
        .status(400)
        .json({ message: "Datos inválidos.", errors });

    const doc = {
      nombre: String(req.body.nombre).trim(),
      apellidos: String(req.body.apellidos).trim(),
      tipoDocumento: String(req.body.tipoDocumento).trim(),
      cedula: String(req.body.cedula).trim(),
      telefono: String(req.body.telefono).trim(),
      sexo: String(req.body.sexo).trim(),
      fechaNacimiento: String(req.body.fechaNacimiento || "").trim(),
      direccion: String(req.body.direccion || "").trim(),
      departamento: String(req.body.departamento).trim(),
      municipio: String(req.body.municipio).trim(),
      sectorEconomico: String(req.body.sectorEconomico).trim(),
      liderPolitico: String(req.body.liderPolitico || "").trim(),
      createdAt: new Date(),
    };

    const result = await collection.insertOne(doc);
    return res
      .status(201)
      .json({ message: "Registro guardado.", id: result.insertedId });
  } catch (err) {
    if (err && err.code === 11000)
      return res
        .status(409)
        .json({ message: "Este documento ya se encuentra registrado." });
    console.error("✖ Error al guardar:", err);
    return res
      .status(500)
      .json({ message: "Error interno al guardar el registro." });
  }
});

// ---------------- Panel /gestor (mismas funciones que en serverless) ----------------
app.post("/api/gestor/login", (req, res) => {
  const body = req.body || {};
  if (!gestor.verifyCredentials(body.user, body.password))
    return res.status(401).json({ message: "Usuario o contraseña incorrectos." });
  return res.json({ token: gestor.signToken() });
});

app.get("/api/gestor/entries", async (req, res) => {
  if (!gestor.requireAuth(req)) return res.status(401).json({ message: "No autorizado." });
  try {
    if (req.query.all === "1") {
      const rows = await gestor.fetchAll(collection, req.query);
      return res.json({ rows });
    }
    return res.json(await gestor.fetchEntries(collection, req.query));
  } catch (err) {
    console.error("✖ /gestor/entries:", err);
    return res.status(500).json({ message: "Error al consultar los registros." });
  }
});

app.get("/api/gestor/stats", async (req, res) => {
  if (!gestor.requireAuth(req)) return res.status(401).json({ message: "No autorizado." });
  try {
    return res.json(await gestor.computeStats(collection));
  } catch (err) {
    console.error("✖ /gestor/stats:", err);
    return res.status(500).json({ message: "Error al calcular estadísticas." });
  }
});

connectDB()
  .then(() => {
    app.listen(API_PORT, () =>
      console.log(`✔ API escuchando en http://localhost:${API_PORT}`)
    );
  })
  .catch((err) => {
    console.error("✖ No se pudo conectar a MongoDB:", err.message);
    process.exit(1);
  });
