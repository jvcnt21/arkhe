import { admin, db } from "../config/firebase.js";

// GET todos os projetos (renomeado de getProjetos)
export const listProjetos = async (req, res) => {
  try {
    // Futura melhoria: filtrar por req.params.idGrupo
    const snap = await db.collection("projetos").get();
    const lista = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET projeto por ID (renomeado de getProjetoById e corrigido para usar idProjeto)
export const getProjeto = async (req, res) => {
  try {
    const { idProjeto } = req.params; // Corrigido para usar idProjeto
    const doc = await db.collection("projetos").doc(idProjeto).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST criar projeto
export const createProjeto = async (req, res) => {
  try {
    const data = req.body;

    const novoDoc = await db.collection("projetos").add({
      ...data,
      dataCriacao: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      message: "Projeto criado com sucesso",
      id: novoDoc.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT atualizar projeto
export const updateProjeto = async (req, res) => {
  try {
    const { idProjeto } = req.params; // Consistência com a rota
    await db.collection("projetos").doc(idProjeto).update(req.body);

    res.json({ message: "Projeto atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE apagar projeto
export const deleteProjeto = async (req, res) => {
  try {
    const { idProjeto } = req.params; // Consistência com a rota
    await db.collection("projetos").doc(idProjeto).delete();
    res.json({ message: "Projeto deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET quadro específico dentro do projeto
export const getQuadroById = async (req, res) => {
  try {
    const { idProjeto, idQuadro } = req.params;

    const doc = await db
      .collection("projetos")
      .doc(idProjeto)
      .collection("quadros")
      .doc(idQuadro)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Quadro não encontrado" });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
