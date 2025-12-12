
import { admin, db } from "../config/firebase.js";

// Função auxiliar para obter a referência da coleção de listas
const getListasCollection = (idProjeto, idQuadro) => {
  return db
    .collection("projetos")
    .doc(idProjeto)
    .collection("quadros")
    .doc(idQuadro)
    .collection("listas");
};

// ----------------------
// LISTAR todas as listas de um quadro
// ----------------------
export const listListas = async (req, res) => {
  try {
    const { idProjeto, idQuadro } = req.params;
    const listasCollection = getListasCollection(idProjeto, idQuadro);
    // Ordena pela data de criação para manter a ordem
    const snap = await listasCollection.orderBy("dataCriacao", "asc").get();
    const listas = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(listas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar listas", details: err.message });
  }
};

// ----------------------
// OBTER uma lista específica
// ----------------------
export const getLista = async (req, res) => {
  try {
    const { idProjeto, idQuadro, idLista } = req.params;
    const listasCollection = getListasCollection(idProjeto, idQuadro);
    const doc = await listasCollection.doc(idLista).get();

    if (!doc.exists)
      return res.status(404).json({ error: "Lista não encontrada" });

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar lista", details: err.message });
  }
};

// ----------------------
// CRIAR uma nova lista
// ----------------------
export const createLista = async (req, res) => {
  try {
    const { idProjeto, idQuadro } = req.params;
    const data = req.body;

    if (!data.nome) {
      return res.status(400).json({ error: "O nome da lista é obrigatório" });
    }
    
    const listasCollection = getListasCollection(idProjeto, idQuadro);
    
    const novaLista = {
      nome: data.nome,
      dataCriacao: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await listasCollection.add(novaLista);
    
    res.status(201).json({ 
        message: "Lista criada com sucesso", 
        id: docRef.id 
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar lista", details: err.message });
  }
};

// ----------------------
// ATUALIZAR uma lista
// ----------------------
export const updateLista = async (req, res) => {
  try {
    const { idProjeto, idQuadro, idLista } = req.params;
    const dados = req.body;

    const listasCollection = getListasCollection(idProjeto, idQuadro);
    const docRef = listasCollection.doc(idLista);
    
    await docRef.update(dados);

    res.status(200).json({
      message: "Lista atualizada com sucesso"
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar lista", details: err.message });
  }
};

// ----------------------
// DELETAR uma lista
// ----------------------
export const deleteLista = async (req, res) => {
  try {
    const { idProjeto, idQuadro, idLista } = req.params;
    const listasCollection = getListasCollection(idProjeto, idQuadro);
    await listasCollection.doc(idLista).delete();

    res.status(200).json({ message: "Lista deletada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar lista", details: err.message });
  }
};
