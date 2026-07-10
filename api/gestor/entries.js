// GET /api/gestor/entries?page&limit&search&departamento&municipio&sectorEconomico&sexo&liderPolitico
//   -> { rows, total, page, limit, pages }
// GET /api/gestor/entries?all=1 (+ mismos filtros) -> { rows }  (para exportar)
const { requireAuth, fetchEntries, fetchAll } = require("../_lib/gestor");
const { getCollection } = require("../_lib/mongo");

module.exports = async function handler(req, res) {
  if (!requireAuth(req)) return res.status(401).json({ message: "No autorizado." });
  try {
    const col = await getCollection();
    if (req.query && req.query.all === "1") {
      const rows = await fetchAll(col, req.query);
      return res.status(200).json({ rows });
    }
    const data = await fetchEntries(col, req.query || {});
    return res.status(200).json(data);
  } catch (err) {
    console.error("✖ /gestor/entries:", err);
    return res.status(500).json({ message: "Error al consultar los registros." });
  }
};
