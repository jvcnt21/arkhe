
import { admin, db } from "../config/firebase.js";

// Função auxiliar para obter a referência da coleção de tarefas
const getTarefasCollection = (idProjeto, idQuadro, idLista) => {
  return db
    .collection("projetos")
    .doc(idProjeto)
    .collection("quadros")
    .doc(idQuadro)
    .collection("listas")
    .doc(idLista)
    .collection("tarefas");
};

// ----------------------
// LISTAR todas as tarefas de uma lista
// ----------------------
export const listTarefas = async (req, res) => {
  try {
    const { idProjeto, idQuadro, idLista } = req.params;
    const tarefasCollection = getTarefasCollection(idProjeto, idQuadro, idLista);
    const snap = await tarefasCollection.orderBy("dataCriacao", "asc").get(); // Ordena por data de criação
    const tarefas = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(tarefas);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar tarefas", details: err.message });
  }
};

// ----------------------
// OBTER uma tarefa específica
// ----------------------
export const getTarefa = async (req, res) => {
  try {
    const { idProjeto, idQuadro, idLista, idTarefa } = req.params;
    const tarefasCollection = getTarefasCollection(idProjeto, idQuadro, idLista);
    const doc = await tarefasCollection.doc(idTarefa).get();

    if (!doc.exists)
      return res.status(404).json({ error: "Tarefa não encontrada" });

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar tarefa", details: err.message });
  }
};

// ----------------------
// CRIAR uma nova tarefa
// ----------------------
export const createTarefa = async (req, res) => {
  try {
    const { idProjeto, idQuadro, idLista } = req.params;
    const data = req.body;

    if (!data.nome) {
      return res.status(400).json({ error: "O nome da tarefa é obrigatório" });
    }
    
    const tarefasCollection = getTarefasCollection(idProjeto, idQuadro, idLista);
    
    const novaTarefa = {
      nome: data.nome,
      status: data.status || "pendente",
      dataCriacao: admin.firestore.FieldValue.serverTimestamp(),
      dataInicio: data.dataInicio || null,
      dataConclusao: data.dataConclusao || null,
    };

    const docRef = await tarefasCollection.add(novaTarefa);
    
    res.status(201).json({ 
        message: "Tarefa criada com sucesso", 
        id: docRef.id 
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar tarefa", details: err.message });
  }
};

// ----------------------
// ATUALIZAR uma tarefa
// ----------------------
export const updateTarefa = async (req, res) => {
  try {
    const { idProjeto, idQuadro, idLista, idTarefa } = req.params;
    const dados = req.body;

    const tarefasCollection = getTarefasCollection(idProjeto, idQuadro, idLista);
    const docRef = tarefasCollection.doc(idTarefa);
    
    await docRef.update(dados);

    res.status(200).json({
      message: "Tarefa atualizada com sucesso"
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar tarefa", details: err.message });
  }
};

// ----------------------
// DELETAR uma tarefa
// ----------------------
export const deleteTarefa = async (req, res) => {
  try {
    const { idProjeto, idQuadro, idLista, idTarefa } = req.params;
    const tarefasCollection = getTarefasCollection(idProjeto, idQuadro, idLista);
    await tarefasCollection.doc(idTarefa).delete();

    res.status(200).json({ message: "Tarefa deletada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar tarefa", details: err.message });
  }
};
