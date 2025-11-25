import express from "express";
import { auth } from "../middlewares/auth.js";
import { getAllUsuarios, getUsuarioById, createUsuario } from "../controllers/usuariosController.js";


const router = express.Router();


router.get("/", auth, getAllUsuarios);
router.get("/:id", auth, getUsuarioById);
router.post("/", auth, createUsuario);


export default router;