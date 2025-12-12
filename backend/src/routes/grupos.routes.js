import { Router } from "express";
import {
  listGroups,
  createGroup,
  getGroup,
  addMemberToGroup,
  updateGroup,
  deleteGroup,
  removeMemberFromGroup,
} from "../controllers/grupos.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import quadrosRoutes from "./quadros.routes.js";

const router = Router();

// APLICA O MIDDLEWARE DE AUTENTICAÇÃO SELETIVAMENTE
// As rotas principais para listar (GET) e criar (POST) grupos usarão o middleware.
router.route("/").get(authMiddleware, listGroups).post(authMiddleware, createGroup);

// As rotas que acessam um grupo específico também usarão o middleware.
router
  .route("/:id")
  .get(authMiddleware, getGroup)
  .put(authMiddleware, updateGroup)
  .delete(authMiddleware, deleteGroup);

// Rotas para gerenciamento de membros, protegidas pelo middleware.
router.post("/:groupId/members", authMiddleware, addMemberToGroup);
router.delete("/:id/members/:memberId", authMiddleware, removeMemberFromGroup);

// Aninha as rotas de quadros, que também devem ser protegidas.
// O middleware será aplicado dentro de quadros.routes.js ou aqui, se necessário.
router.use("/:id/quadro", authMiddleware, quadrosRoutes);

export default router;
