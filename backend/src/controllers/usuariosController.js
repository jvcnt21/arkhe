import db from "../config/db.js";


export async function getAllUsuarios(req, res) {
try {
const [rows] = await db.query("SELECT * FROM usuario");
res.json(rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao buscar usuários" });
}
}


export async function getUsuarioById(req, res) {
const { id } = req.params;
try {
const [rows] = await db.query("SELECT * FROM usuario WHERE id_usuario = ?", [id]);
if (rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
res.json(rows[0]);
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao buscar usuário" });
}
}


export async function createUsuario(req, res) {
const { nome, email, senha, rm, instituicao, id_grupo } = req.body;
try {
const [result] = await db.query(
`INSERT INTO usuario (nome, email, senha, rm, instituicao, id_grupo) VALUES (?, ?, ?, ?, ?, ?)`,
[nome, email, senha, rm, instituicao, id_grupo]
);
res.status(201).json({ id: result.insertId });
} catch (err) {
console.error(err);
res.status(500).json({ error: "Erro ao criar usuário" });
}
}