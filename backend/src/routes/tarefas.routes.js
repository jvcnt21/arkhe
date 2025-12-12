import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  listTarefas,
  getTarefa,
  createTarefa,
  updateTarefa,
  deleteTarefa,
} from "../controllers/tarefas.controller.js";

const router = Router();

// A URL base virá do app.js, e o controller precisa dos IDs do projeto, quadro e lista

// Listar todas as tarefas de uma lista
router.get("/:idProjeto/:idQuadro/:idLista", authMiddleware, listTarefas);

// Criar uma nova tarefa em uma lista
router.post("/:idProjeto/:idQuadro/:idLista", authMiddleware, createTarefa);

// Obter uma tarefa específica
router.get("/:idProjeto/:idQuadro/:idLista/:idTarefa", authMiddleware, getTarefa);

// Atualizar uma tarefa
router.put("/:idProjeto/:idQuadro/:idLista/:idTarefa", authMiddleware, updateTarefa);

// Deletar uma tarefa
router.delete("/:idProjeto/:idQuadro/:idLista/:idTarefa", authMiddleware, deleteTarefa);

export default router;
