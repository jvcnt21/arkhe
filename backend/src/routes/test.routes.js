import { Router } from "express";
import { db } from "../config/firebase.js";

const router = Router();

router.get("/", (req, res) => {
  console.log("Rota de teste acessada com sucesso!");
  res.status(200).json({ message: "Backend is running!" });
});

router.get("/test-firestore", async (req, res) => {
  try {
    const doc = await db.collection("teste").doc("ping").get();
    return res.json({ ok: true, data: doc.data() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
