import dotenv from "dotenv";
dotenv.config();


import express from "express";
import cors from "cors";


import usuariosRoutes from "./routes/usuarios.js";
import gruposRoutes from "./routes/grupos.js";
import tarefasRoutes from "./routes/tarefas.js";


const app = express();
app.use(cors());
app.use(express.json());


// Rotas
app.use("/usuarios", usuariosRoutes);
app.use("/grupos", gruposRoutes);
app.use("/tarefas", tarefasRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));