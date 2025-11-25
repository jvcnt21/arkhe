import express from "express";
import { auth } from "../middlewares/auth.js";
import db from "../config/db.js";


const router = express.Router();


router.get("/", auth, async (req, res) => {
try {
const [rows] = await db.query("SELECT * FROM grupo");
res.json(rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao buscar grupos" });
}
});


export default router;