// Conexión a MongoDB compartida y cacheada entre invocaciones serverless.
// Archivo bajo _lib -> Vercel NO lo expone como endpoint.
const { MongoClient } = require("mongodb");

const {
  MONGODB_URI,
  DB_NAME = "coomsocial",
  COLLECTION_NAME = "entries",
} = process.env;

let cached = global._mongo;
if (!cached) cached = global._mongo = { client: null, promise: null };

async function getCollection() {
  if (!MONGODB_URI)
    throw new Error("Falta MONGODB_URI en las variables de entorno.");
  if (!cached.promise) {
    cached.promise = new MongoClient(MONGODB_URI)
      .connect()
      .then(async (client) => {
        cached.client = client;
        await client
          .db(DB_NAME)
          .collection(COLLECTION_NAME)
          .createIndex({ cedula: 1 }, { unique: true })
          .catch(() => {});
        return client;
      })
      .catch((err) => {
        cached.promise = null; // no cachear una promesa rechazada
        throw err;
      });
  }
  const client = await cached.promise;
  return client.db(DB_NAME).collection(COLLECTION_NAME);
}

module.exports = { getCollection };
