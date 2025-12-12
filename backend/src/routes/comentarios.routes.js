import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  listComentarios,
  createComentario,
  updateComentario,
  deleteComentario,
} from "../controllers/comentarios.controller.js";

const router = Router();

// A URL base já é /api/comentarios, e as rotas precisam da hierarquia completa

// Listar todos os comentários de uma tarefa
router.get("/:idProjeto/:idQuadro/:idLista/:idTarefa", authMiddleware, listComentarios);

// Criar um novo comentário em uma tarefa
router.post("/:idProjeto/:idQuadro/:idLista/:idTarefa", authMiddleware, createComentario);

// Atualizar um comentário específico
router.put("/:idProjeto/:idQuadro/:idLista/:idTarefa/:idComentario", authMiddleware, updateComentario);

// Deletar um comentário específico
router.delete("/:idProjeto/:idQuadro/:idLista/:idTarefa/:idComentario", authMiddleware, deleteComentario);

export default router;
