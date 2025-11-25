import db from "../config/db.js";


export async function getAllTarefas(req, res) {
try {
const [rows] = await db.query("SELECT * FROM tarefa");
res.json(rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao buscar tarefas" });
}
}


export async function createTarefa(req, res) {
const { nome, status, data_inicio, data_conclusao, id_comentario, id_arquivo } = req.body;
try {
const [result] = await db.query(
`INSERT INTO tarefa (nome, status, data_inicio, data_conclusao, id_comentario, id_arquivo) VALUES (?, ?, ?, ?, ?, ?)`,
[nome, status, data_inicio, data_conclusao, id_comentario, id_arquivo]
);
res.status(201).json({ id: result.insertId });
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao criar tarefa" });
}
}

