// POST /api/gestor/login  { user, password } -> { token }
const { verifyCredentials, signToken } = require("../_lib/gestor");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Método no permitido." });
  }
  const body =
    typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  if (!verifyCredentials(body.user, body.password))
    return res.status(401).json({ message: "Usuario o contraseña incorrectos." });
  return res.status(200).json({ token: signToken() });
};
