import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { 
  registerUser, 
  getMe, 
  generateSignedUrl, 
  updateUserProfile, 
  getUserById
} from "../controllers/users.controller.js";

const router = Router();

// Rota para salvar dados adicionais de um novo usuário no Firestore.
router.post("/register", registerUser);

// Rota para o usuário logado obter seus próprios dados do Firestore.
router.get("/me", authMiddleware, getMe);

// Rota para buscar os dados públicos de um usuário pelo ID.
// Corrigido de "/users/:id" para "/:id" para evitar duplicação de caminho.
router.get("/:id", authMiddleware, getUserById);

// Rota para gerar uma URL assinada para upload de imagem de perfil.
router.post("/generate-signed-url", authMiddleware, generateSignedUrl);

// Rota para atualizar o perfil do usuário (ex: photoURL).
router.patch("/profile", authMiddleware, updateUserProfile);

export default router;
