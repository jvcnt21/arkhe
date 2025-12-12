import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  getQuadroCompleto,
  createTarefa,
  updateTarefa,
  deleteTarefa,
  moveTarefa
} from "../controllers/quadro.controller.js";

const router = Router();

// Rota principal para obter o quadro completo de um grupo (cria se não existir)
router.get("/:idGrupo/quadro", authMiddleware, getQuadroCompleto);

// --- Rotas para Tarefas ---

// Criar uma nova tarefa em uma lista específica de um quadro
router.post("/:idGrupo/listas/:idLista/tarefas", authMiddleware, createTarefa);

// Atualizar uma tarefa específica
router.put("/:idGrupo/listas/:idLista/tarefas/:idTarefa", authMiddleware, updateTarefa);

// Deletar uma tarefa específica
router.delete("/:idGrupo/listas/:idLista/tarefas/:idTarefa", authMiddleware, deleteTarefa);

// Mover uma tarefa (entre listas ou na mesma lista)
router.post("/:idGrupo/tarefas/move", authMiddleware, moveTarefa);


export default router;
