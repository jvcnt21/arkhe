
import { admin, db } from "../config/firebase.js";

// Função auxiliar para obter a referência da coleção de notificações
const getNotificacoesCollection = (idGrupo) => {
  return db.collection("grupos").doc(idGrupo).collection("notificacoes");
};

// ----------------------
// LISTAR todas as notificações de um grupo
// ----------------------
export const listNotificacoes = async (req, res) => {
  try {
    const { idGrupo } = req.params;
    const notificacoesCollection = getNotificacoesCollection(idGrupo);
    // Ordena da mais nova para a mais antiga
    const snap = await notificacoesCollection.orderBy("dataPublicacao", "desc").get();
    const notificacoes = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(notificacoes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar notificações", details: err.message });
  }
};

// ----------------------
// CRIAR um novo Aviso (com dados do professor)
// ----------------------
export const createAviso = async (req, res) => {
  try {
    const { idGrupo } = req.params;
    const { titulo, descricao } = req.body;
    const { uid } = req.user; // ID do usuário (professor) do token

    if (!titulo || !descricao) {
      return res.status(400).json({ error: "Título e descrição são obrigatórios" });
    }

    // Busca os dados do professor para registrar o nome
    const userDoc = await db.collection('usuarios').doc(uid).get();
    if (!userDoc.exists) {
        return res.status(404).json({ error: "Professor não encontrado" });
    }
    const professorNome = userDoc.data().nome;

    const notificacoesCollection = getNotificacoesCollection(idGrupo);

    const novoAviso = {
      titulo,
      descricao,
      tipo: "Aviso",
      lida: false,
      dataPublicacao: admin.firestore.FieldValue.serverTimestamp(),
      professorId: uid, // ID do professor que criou
      professorNome: professorNome, // Nome do professor
    };

    const docRef = await notificacoesCollection.add(novoAviso);

    // Retorna o aviso recém-criado para a UI
    const avisoCriado = await docRef.get();
    res.status(201).json({
        message: "Aviso criado com sucesso",
        aviso: { id: docRef.id, ...avisoCriado.data() },
    });

  } catch (err) {
    console.error("Erro ao criar aviso:", err); // Log do erro no servidor
    res.status(500).json({ error: "Erro ao criar aviso", details: err.message });
  }
};


// ----------------------
// OBTER uma notificação específica
// ----------------------
export const getNotificacao = async (req, res) => {
  try {
    const { idGrupo, idNotificacao } = req.params;
    const notificacoesCollection = getNotificacoesCollection(idGrupo);
    const doc = await notificacoesCollection.doc(idNotificacao).get();

    if (!doc.exists)
      return res.status(404).json({ error: "Notificação não encontrada" });

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar notificação", details: err.message });
  }
};

// ----------------------
// CRIAR uma nova notificação (função genérica)
// ----------------------
export const createNotificacao = async (req, res) => {
  try {
    const { idGrupo } = req.params;
    const data = req.body;

    if (!data.titulo || !data.texto) {
      return res.status(400).json({ error: "Título e texto são obrigatórios" });
    }
    
    const notificacoesCollection = getNotificacoesCollection(idGrupo);
    
    const novaNotificacao = {
      titulo: data.titulo,
      texto: data.texto,
      lida: false,
      dataPublicacao: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await notificacoesCollection.add(novaNotificacao);
    
    res.status(201).json({ 
        message: "Notificação criada com sucesso", 
        id: docRef.id 
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar notificação", details: err.message });
  }
};

// ----------------------
// ATUALIZAR uma notificação (ex: marcar como lida)
// ----------------------
export const updateNotificacao = async (req, res) => {
  try {
    const { idGrupo, idNotificacao } = req.params;
    const dados = req.body;

    const notificacoesCollection = getNotificacoesCollection(idGrupo);
    const docRef = notificacoesCollection.doc(idNotificacao);
    
    await docRef.update(dados);

    res.status(200).json({
      message: "Notificação atualizada com sucesso"
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar notificação", details: err.message });
  }
};

// ----------------------
// DELETAR uma notificação
// ----------------------
export const deleteNotificacao = async (req, res) => {
  try {
    const { idGrupo, idNotificacao } = req.params;
    const notificacoesCollection = getNotificacoesCollection(idGrupo);
    await notificacoesCollection.doc(idNotificacao).delete();

    res.status(200).json({ message: "Notificação deletada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar notificação", details: err.message });
  }
};

export const listUltimasNotificacoes = async (req, res) => {
  try {
    const { idGrupo } = req.params;
    const notificacoesCollection = getNotificacoesCollection(idGrupo);

    const snap = await notificacoesCollection
      .orderBy("dataPublicacao", "desc")
      .limit(3)
      .get();

    const notificacoes = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(notificacoes);
  } catch (err) {
    res.status(500).json({ 
      error: "Erro ao listar últimas notificações", 
      details: err.message 
    });
  }
};
