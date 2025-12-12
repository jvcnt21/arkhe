import db from "../config/firestore.js";
import { FieldValue } from "firebase-admin/firestore";

// --- CORE FUNCTIONS ---

/**
 * Busca o quadro completo de um grupo, criando-o se não existir.
 * Este é o principal endpoint para carregar a página do quadro.
 */
export const getQuadroCompleto = async (req, res) => {
  const { idGrupo } = req.params;
  const quadroId = `quadro-${idGrupo}`; // ID determinístico para o quadro do grupo

  const grupoRef = db.collection("grupos").doc(idGrupo);
  const quadroRef = grupoRef.collection("quadros").doc(quadroId);

  try {
    const quadroDoc = await quadroRef.get();

    // Se o quadro não existe, cria o quadro e as listas padrão em uma transação
    if (!quadroDoc.exists) {
      await criarQuadroComListasPadrao(grupoRef, quadroId);
    }

    // Agora que o quadro definitivamente existe, busca todos os seus dados
    const listasSnap = await quadroRef.collection("listas").orderBy("ordem").get();

    const listas = [];
    for (const listaDoc of listasSnap.docs) {
      const tarefasSnap = await listaDoc.ref.collection("tarefas").orderBy("ordem").get();
      const tarefas = tarefasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      listas.push({ id: listaDoc.id, ...listaDoc.data(), tarefas });
    }

    const quadroData = (await quadroRef.get()).data();

    res.json({
      id: quadroRef.id,
      ...quadroData,
      listas,
    });

  } catch (error) {
    console.error("Erro ao buscar ou criar quadro completo:", error);
    res.status(500).json({ message: "Erro interno do servidor.", error: error.message });
  }
};

/**
 * Função auxiliar para criar o quadro e suas listas padrão de forma atômica.
 */
const criarQuadroComListasPadrao = async (grupoRef, quadroId) => {
  const quadroRef = grupoRef.collection("quadros").doc(quadroId);

  return db.runTransaction(async (transaction) => {
    // 1. Criar o documento do quadro
    transaction.set(quadroRef, {
      nome: "Quadro Principal",
      createdAt: FieldValue.serverTimestamp(),
      ordemListas: ["a-fazer", "fazendo", "concluido"], // IDs das listas
    });

    // 2. Criar as listas padrão
    const listasRef = quadroRef.collection("listas");
    transaction.set(listasRef.doc("a-fazer"), {
      nome: "A fazer",
      ordem: 1,
      cor: "red", // Detalhe vermelho
    });
    transaction.set(listasRef.doc("fazendo"), {
      nome: "Fazendo",
      ordem: 2,
      cor: "yellow", // Detalhe amarelo
    });
    transaction.set(listasRef.doc("concluido"), {
      nome: "Concluído",
      ordem: 3,
      cor: "green", // Detalhe verde
    });
  });
};


// --- TASK MANAGEMENT FUNCTIONS ---

/**
 * Cria uma nova tarefa em uma lista específica.
 */
export const createTarefa = async (req, res) => {
  const { idGrupo, idLista } = req.params;
  const { titulo } = req.body;
  const quadroId = `quadro-${idGrupo}`;

  if (!titulo) {
    return res.status(400).json({ message: "O título da tarefa é obrigatório." });
  }

  const listaRef = db.collection("grupos").doc(idGrupo).collection("quadros").doc(quadroId).collection("listas").doc(idLista);

  try {
    const tarefasRef = listaRef.collection("tarefas");

    // Pega a ordem da última tarefa para inserir a nova no final
    const ultimaTarefaSnap = await tarefasRef.orderBy("ordem", "desc").limit(1).get();
    const novaOrdem = ultimaTarefaSnap.empty ? 1 : ultimaTarefaSnap.docs[0].data().ordem + 1;

    const novaTarefaRef = tarefasRef.doc();
    await novaTarefaRef.set({
      titulo,
      descricao: "",
      createdAt: FieldValue.serverTimestamp(),
      ordem: novaOrdem,
    });

    const novaTarefa = await novaTarefaRef.get();

    res.status(201).json({ id: novaTarefa.id, ...novaTarefa.data() });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ message: "Erro interno do servidor.", error: error.message });
  }
};

/**
 * Atualiza uma tarefa (título, descrição, etc.).
 */
export const updateTarefa = async (req, res) => {
    const { idGrupo, idLista, idTarefa } = req.params;
    const quadroId = `quadro-${idGrupo}`;
    const data = req.body;

    // Remove 'id' do corpo para não ser salvo no documento
    delete data.id;

    try {
        const tarefaRef = db.collection("grupos").doc(idGrupo).collection("quadros").doc(quadroId).collection("listas").doc(idLista).collection("tarefas").doc(idTarefa);

        await tarefaRef.update({
            ...data,
            updatedAt: FieldValue.serverTimestamp(),
        });
        
        res.json({ message: "Tarefa atualizada com sucesso" });
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        res.status(500).json({ message: "Erro interno do servidor.", error: error.message });
    }
};

/**
 * Deleta uma tarefa.
 */
export const deleteTarefa = async (req, res) => {
    const { idGrupo, idLista, idTarefa } = req.params;
    const quadroId = `quadro-${idGrupo}`;

    try {
        const tarefaRef = db.collection("grupos").doc(idGrupo).collection("quadros").doc(quadroId).collection("listas").doc(idLista).collection("tarefas").doc(idTarefa);
        
        await tarefaRef.delete();
        
        // OPCIONAL: Adicionar lógica para reordenar as outras tarefas da lista
        
        res.json({ message: "Tarefa deletada com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
        res.status(500).json({ message: "Erro interno do servidor.", error: error.message });
    }
};


/**
 * Move uma tarefa entre listas ou dentro da mesma lista.
 */
export const moveTarefa = async (req, res) => {
    const { idGrupo } = req.params;
    const { idTarefa, listaOrigemId, listaDestinoId, novaOrdem } = req.body;
    const quadroId = `quadro-${idGrupo}`;
    
    if (!idTarefa || !listaOrigemId || !listaDestinoId || novaOrdem == null) {
        return res.status(400).json({ message: "Parâmetros inválidos para mover tarefa." });
    }

    const quadroRef = db.collection("grupos").doc(idGrupo).collection("quadros").doc(quadroId);
    const tarefaOrigemRef = quadroRef.collection("listas").doc(listaOrigemId).collection("tarefas").doc(idTarefa);
    
    try {
        await db.runTransaction(async transaction => {
            const tarefaDoc = await transaction.get(tarefaOrigemRef);
            if (!tarefaDoc.exists) {
                throw new Error("Tarefa não encontrada!");
            }
            const tarefaData = tarefaDoc.data();

            // Lógica para reordenar tarefas na lista de ORIGEM
            const tarefasOrigemQuery = quadroRef.collection("listas").doc(listaOrigemId).collection("tarefas").where("ordem", ">", tarefaData.ordem);
            const tarefasOrigemSnap = await transaction.get(tarefasOrigemQuery);
            tarefasOrigemSnap.docs.forEach(doc => {
                transaction.update(doc.ref, { ordem: doc.data().ordem - 1 });
            });

            if (listaOrigemId === listaDestinoId) {
                // Movendo DENTRO da mesma lista
                const tarefasDestinoQuery = quadroRef.collection("listas").doc(listaDestinoId).collection("tarefas").where("ordem", ">=", novaOrdem);
                const tarefasDestinoSnap = await transaction.get(tarefasDestinoQuery);
                tarefasDestinoSnap.docs.forEach(doc => {
                    transaction.update(doc.ref, { ordem: doc.data().ordem + 1 });
                });
                transaction.update(tarefaOrigemRef, { ordem: novaOrdem });

            } else {
                // Movendo PARA outra lista
                const tarefaDestinoRef = quadroRef.collection("listas").doc(listaDestinoId).collection("tarefas").doc(idTarefa);
                
                // Reordena a lista de DESTINO
                const tarefasDestinoQuery = quadroRef.collection("listas").doc(listaDestinoId).collection("tarefas").where("ordem", ">=", novaOrdem);
                const tarefasDestinoSnap = await transaction.get(tarefasDestinoQuery);
                tarefasDestinoSnap.docs.forEach(doc => {
                    transaction.update(doc.ref, { ordem: doc.data().ordem + 1 });
                });
                
                // Move a tarefa
                transaction.delete(tarefaOrigemRef);
                transaction.set(tarefaDestinoRef, { ...tarefaData, ordem: novaOrdem });
            }
        });

        res.json({ message: "Tarefa movida com sucesso." });

    } catch (error) {
        console.error("Erro ao mover tarefa:", error);
        res.status(500).json({ message: "Falha ao mover tarefa.", error: error.message });
    }
};
