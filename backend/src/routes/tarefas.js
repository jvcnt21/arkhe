import express from "express";
import { auth } from "../middlewares/auth.js";
import { getAllTarefas, createTarefa } from "../controllers/tarefasController.js";


const router = express.Router();


router.get("/", auth, getAllTarefas);
router.post("/", auth, createTarefa);


export default router;