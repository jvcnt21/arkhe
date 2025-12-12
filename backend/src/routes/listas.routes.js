import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  listListas,
  getLista,
  createLista,
  updateLista,
  deleteLista,
} from "../controllers/listas.controller.js";

const router = Router();

// Listar todas as listas de um quadro
router.get("/:idProjeto/:idQuadro", authMiddleware, listListas);

// Criar uma nova lista em um quadro
router.post("/:idProjeto/:idQuadro", authMiddleware, createLista);

// Obter uma lista específica
router.get("/:idProjeto/:idQuadro/:idLista", authMiddleware, getLista);

// Atualizar uma lista
router.put("/:idProjeto/:idQuadro/:idLista", authMiddleware, updateLista);

// Deletar uma lista
router.delete("/:idProjeto/:idQuadro/:idLista", authMiddleware, deleteLista);

export default router;
