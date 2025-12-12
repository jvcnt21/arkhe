import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
    listProjetos,
    getProjeto,
    createProjeto,
    updateProjeto,
    deleteProjeto
} from "../controllers/projetos.controller.js";

const router = Router();

// Listar todos os projetos de um grupo
router.get("/:idGrupo", authMiddleware, listProjetos);

// Obter projeto específico
router.get("/:idGrupo/:idProjeto", authMiddleware, getProjeto);

// Criar projeto dentro de um grupo
router.post("/:idGrupo", authMiddleware, createProjeto);

// Atualizar projeto
router.put("/:idGrupo/:idProjeto", authMiddleware, updateProjeto);

// Deletar projeto
router.delete("/:idGrupo/:idProjeto", authMiddleware, deleteProjeto);

export default router;
