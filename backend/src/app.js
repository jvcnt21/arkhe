
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { NotFoundError } from "./utils/errors.js";

// Importação de Rotas
import usersRoutes from "./routes/users.routes.js";
import testRoutes from "./routes/test.routes.js";
import gruposRoutes from "./routes/grupos.routes.js";
import notificacoesRoutes from "./routes/notificacoes.routes.js"; // Rota de notificações importada

const app = express();

// Middlewares
app.use(cors()); // Permitir todas as origens
app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("===========================================");
  console.log(`📨 REQUISIÇÃO RECEBIDA: ${req.method} ${req.originalUrl}`);
  console.log("Headers:", req.headers);
  console.log("===========================================");
  next();
});

// --- Definição das Rotas da API ---

const apiRouter = express.Router();

// Rotas de negócio aninhadas sob o apiRouter
apiRouter.use("/users", usersRoutes);
apiRouter.use("/grupos", gruposRoutes);
apiRouter.use("/notificacoes", notificacoesRoutes); // Rota de notificações adicionada
apiRouter.use("/test", testRoutes);

// Monta o roteador principal no prefixo /api
app.use("/api", apiRouter);


// --- Tratamento de Erros ---

// Rota não encontrada
app.use((req, res, next) => {
  return next(new NotFoundError("Essa rota não foi encontrada em nosso servidor."));
});

// Tratamento de erros centralizado
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Ocorreu um erro interno no servidor.";

  console.error(err); // Log do erro para depuração

  res.status(status).json({ error: message });
});

export default app;
