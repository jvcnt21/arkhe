
import { admin, db } from "../config/firebase.js";

// --- FUNÇÃO AUXILIAR ---
// Retorna a referência para a sub-coleção de comentários de uma tarefa específica
const getComentariosCollection = (idProjeto, idQuadro, idLista, idTarefa) => {
  return db
    .collection("projetos")
    .doc(idProjeto)
    .collection("quadros")
    .doc(idQuadro)
    .collection("listas")
    .doc(idLista)
    .collection("tarefas")
    .doc(idTarefa)
    .collection("comentarios");
};

// ----------------------
// CRIAR um novo comentário em uma tarefa
// ----------------------
export const createComentario = async (req, res) => {
  try {
    const { idProjeto, idQuadro, idLista, idTarefa } = req.params;
    const { texto } = req.body;
    const idUsuario = req.user.uid; // ID do usuário logado (vem do authMiddleware)

    if (!texto) {
      return res.status(400).json({ error: "O texto do comentário é obrigatório." });
    }

    const comentariosCollection = getComentariosCollection(
      idProjeto,
      idQuadro,
      idLista,
      idTarefa
    );

    const novoComentario = {
      texto,
      idUsuario,
      dataCriacao: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await comentariosCollection.add(novoComentario);

    res.status(201).json({
      message: "Comentário criado com sucesso",
      id: docRef.id,
      ...novoComentario,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar comentário", details: err.message });
  }
};

// ----------------------
// LISTAR todos os comentários de uma tarefa
// ----------------------
export const listComentarios = async (req, res) => {
  try {
    const { idProjeto, idQuadro, idLista, idTarefa } = req.params;
    const comentariosCollection = getComentariosCollection(
      idProjeto,
      idQuadro,
      idLista,
      idTarefa
    );

    // Ordena do mais antigo para o mais novo
    const snap = await comentariosCollection.orderBy("dataCriacao", "asc").get();
    const comentarios = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(comentarios);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar comentários", details: err.message });
  }
};


// ----------------------
// ATUALIZAR um comentário (apenas pelo autor)
// ----------------------
export const updateComentario = async (req, res) => {
  try {
    const { idProjeto, idQuadro, idLista, idTarefa, idComentario } = req.params;
    const { texto } = req.body;
    const idUsuario = req.user.uid;

    if (!texto) {
      return res.status(400).json({ error: "O texto não pode ser vazio." });
    }

    const comentarioRef = getComentariosCollection(
      idProjeto,
      idQuadro,
      idLista,
      idTarefa
    ).doc(idComentario);
      
    const doc = await comentarioRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Comentário não encontrado." });
    }

    // Verifica se o usuário que está atualizando é o autor do comentário
    if (doc.data().idUsuario !== idUsuario) {
      return res.status(403).json({ error: "Acesso negado. Você não é o autor deste comentário." });
    }

    await comentarioRef.update({ texto });

    res.status(200).json({ message: "Comentário atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar comentário", details: err.message });
  }
};

// ----------------------
// DELETAR um comentário (apenas pelo autor)
// ----------------------
export const deleteComentario = async (req, res) => {
  try {
    const { idProjeto, idQuadro, idLista, idTarefa, idComentario } = req.params;
    const idUsuario = req.user.uid;

    const comentarioRef = getComentariosCollection(
      idProjeto,
      idQuadro,
      idLista,
      idTarefa
    ).doc(idComentario);
      
    const doc = await comentarioRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Comentário não encontrado." });
    }

    // Verifica se o usuário que está deletando é o autor do comentário
    if (doc.data().idUsuario !== idUsuario) {
      return res.status(403).json({ error: "Acesso negado. Você não é o autor deste comentário." });
    }

    await comentarioRef.delete();

    res.status(200).json({ message: "Comentário deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar comentário", details: err.message });
  }
};
