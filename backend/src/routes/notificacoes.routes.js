import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  listNotificacoes,
  getNotificacao,
  createAviso, // Importa a nova função
  createNotificacao,
  updateNotificacao,
  deleteNotificacao,
} from "../controllers/notificacoes.controller.js";
import { listUltimasNotificacoes } from "../controllers/notificacoes.controller.js";


const router = Router();

// Rota para criar um novo AVISO em um grupo
router.post("/:idGrupo/avisos", authMiddleware, createAviso);

// --- Rotas Genéricas de Notificação ---

// Listar notificações de um grupo
router.get("/:idGrupo", authMiddleware, listNotificacoes);

// Criar uma nova notificação genérica em um grupo
router.post("/:idGrupo", authMiddleware, createNotificacao);

// Obter uma notificação específica
router.get("/:idGrupo/:idNotificacao", authMiddleware, getNotificacao);

// Atualizar uma notificação (ex: marcar como lida)
router.put("/:idGrupo/:idNotificacao", authMiddleware, updateNotificacao);

// Deletar uma notificação
router.delete("/:idGrupo/:idNotificacao", authMiddleware, deleteNotificacao);

router.get("/:idGrupo/ultimas/3", authMiddleware, listUltimasNotificacoes);

export default router;
