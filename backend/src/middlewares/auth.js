import { admin } from "../config/firebase.js";


export async function auth(req, res, next) {
try {
const authHeader = req.headers.authorization || "";
const token = authHeader.split(" ")[1];


if (!token) return res.status(401).json({ error: "Token ausente" });


const decoded = await admin.auth().verifyIdToken(token);
req.user = decoded; // contém uid, email, etc.
next();
} catch (err) {
console.error("auth middleware error:", err);
res.status(401).json({ error: "Token inválido" });
}
}