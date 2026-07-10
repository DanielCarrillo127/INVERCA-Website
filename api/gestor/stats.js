// GET /api/gestor/stats -> { total, bySector[], upcomingBirthdays[] }
const { requireAuth, computeStats } = require("../_lib/gestor");
const { getCollection } = require("../_lib/mongo");

module.exports = async function handler(req, res) {
  if (!requireAuth(req)) return res.status(401).json({ message: "No autorizado." });
  try {
    const col = await getCollection();
    return res.status(200).json(await computeStats(col));
  } catch (err) {
    console.error("✖ /gestor/stats:", err);
    return res.status(500).json({ message: "Error al calcular estadísticas." });
  }
};
