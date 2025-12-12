import { admin } from "../config/firebase.js";

export async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

    if (!token) {
      return res.status(401).json({ error: "Token ausente" });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email };
    next();
  } catch (err) {
    console.error("Erro ao verificar token:", err.message);
    res.status(401).json({ error: "Token inválido" });
  }
}