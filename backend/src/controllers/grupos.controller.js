
import { db, admin } from "../config/firebase.js";

// FUNÇÃO DE NORMALIZAÇÃO SUPER-ROBUSTA (A CORREÇÃO DEFINITIVA)
// Esta função foi desenhada para lidar com a estrutura de dados corrompida que eu criei.
const getPossiblyNestedString = (data, primaryKey, fallbackKey) => {
  let value = data[primaryKey];
  // Cenário 1: O dado está aninhado (e.g., nome: { nome: 'valor' })
  if (typeof value === 'object' && value !== null && typeof value[primaryKey] === 'string') {
    return value[primaryKey];
  }
  // Cenário 2: O dado é uma string, como deveria ser.
  if (typeof value === 'string') {
    return value;
  }
  
  // Cenário 3: Tentamos a mesma lógica para um nome de campo antigo (fallback)
  let fallbackValue = data[fallbackKey];
  if (fallbackValue) {
    if (typeof fallbackValue === 'object' && fallbackValue !== null && typeof fallbackValue[fallbackKey] === 'string') {
      return fallbackValue[fallbackKey];
    }
    if (typeof fallbackValue === 'string') {
      return fallbackValue;
    }
  }

  // Se tudo falhar, retorna null.
  return null;
};

const normalizeGroupData = (data) => {
  if (!data) return null;

  // Usa a nova função super-robusta para extrair os dados.
  const nome = getPossiblyNestedString(data, 'nome', 'groupName') || "Grupo sem nome";
  const nomeDoProjeto = getPossiblyNestedString(data, 'nomeDoProjeto', 'projectName') || "Projeto sem nome";
  const tema = getPossiblyNestedString(data, 'tema', 'tema') || "";

  return {
    nome: nome,
    nomeDoProjeto: nomeDoProjeto,
    tema: tema,
    professorId: data.professorId || null,
    criadorNome: data.criadorNome || "",
    membros: data.membros || [],
    dataCriacao: data.dataCriacao,
  };
};

export async function createGroup(req, res) {
  try {
    const { nome, nomeDoProjeto, tema } = req.body;
    const uid = req.user.uid;
    const userDoc = await db.collection("usuarios").doc(uid).get();
    if (!userDoc.exists) return res.status(404).json({ error: "Usuário não encontrado." });
    
    const userData = userDoc.data();
    if (userData.tipoConta !== 'professor') return res.status(403).json({ error: "Apenas professores podem criar grupos." });
    if (!nome || !nomeDoProjeto) return res.status(400).json({ error: "O nome do grupo e o nome do projeto são obrigatórios." });

    const newGroupPayload = {
      nome,
      nomeDoProjeto,
      tema: tema || '',
      dataCriacao: admin.firestore.FieldValue.serverTimestamp(),
      professorId: uid,
      criadorNome: userData.nome,
      membros: [uid],
    };

    const ref = await db.collection("grupos").add(newGroupPayload);
    res.status(201).json({ id: ref.id, ...newGroupPayload });
  } catch (err) {
    console.error("Erro detalhado ao criar grupo:", err);
    res.status(500).json({ error: "Erro ao criar grupo" });
  }
}

export async function listGroups(req, res) {
  try {
    const uid = req.user.uid;
    console.log("UID do usuário:", uid);

    const allGroupsSnap = await db.collection("grupos").get();
    console.log("Snapshot de todos os grupos:", allGroupsSnap.size);

    const userGroups = [];
    const groupIds = new Set();

    allGroupsSnap.forEach(doc => {
      const groupData = doc.data();
      console.log(`Verificando grupo ${doc.id}:`, groupData);

      const isProfessor = groupData.professorId === uid || (groupData.professorId && groupData.professorId.professorId === uid);
      console.log(`O usuário é professor do grupo ${doc.id}?`, isProfessor);

      const membersList = Array.isArray(groupData.membros) ? groupData.membros : (groupData.membros && Array.isArray(groupData.membros.membros)) ? groupData.membros.membros : [];
      const isMember = membersList.includes(uid);
      console.log(`O usuário é membro do grupo ${doc.id}?`, isMember);

      if ((isProfessor || isMember) && !groupIds.has(doc.id)) {
        console.log(`O usuário tem acesso ao grupo ${doc.id}. Normalizando...`);
        const normalizedGroup = normalizeGroupData(groupData);
        console.log(`Grupo normalizado ${doc.id}:`, normalizedGroup);

        if (normalizedGroup) {
          userGroups.push({ id: doc.id, ...normalizedGroup });
          groupIds.add(doc.id);
        }
      }
    });

    console.log("Grupos do usuário a serem enviados:", userGroups);
    res.json(userGroups);
  } catch (err) {
    console.error("Erro detalhado ao listar grupos:", err);
    res.status(500).json({ error: "Erro ao listar grupos" });
  }
}

export async function getGroup(req, res) {
  try {
    const { id } = req.params;
    const doc = await db.collection("grupos").doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: "Grupo não encontrado" });
    
    res.json({ id: doc.id, ...normalizeGroupData(doc.data()) });
  } catch (err) {
    console.error("Erro detalhado ao buscar grupo:", err);
    res.status(500).json({ error: "Erro ao buscar grupo" });
  }
}

export async function updateGroup(req, res) {
  try {
    const { id } = req.params;
    const { nome, nomeDoProjeto, tema } = req.body;
    const uid = req.user.uid;
    const groupRef = db.collection('grupos').doc(id);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists) return res.status(404).json({ error: "Grupo não encontrado." });
    if (groupDoc.data().professorId !== uid) return res.status(403).json({ error: "Você não tem permissão para atualizar este grupo." });

    const dataToUpdate = {};
    if (nome !== undefined) dataToUpdate.nome = nome;
    if (nomeDoProjeto !== undefined) dataToUpdate.nomeDoProjeto = nomeDoProjeto;
    if (tema !== undefined) dataToUpdate.tema = tema;

    if (Object.keys(dataToUpdate).length === 0) return res.status(400).json({ error: "Nenhum dado para atualizar foi fornecido." });

    await groupRef.update(dataToUpdate);

    const updatedDoc = await groupRef.get();
    res.status(200).json({ id: updatedDoc.id, ...normalizeGroupData(updatedDoc.data()) });
  } catch (error) {
    console.error("Erro ao atualizar grupo:", error);
    res.status(500).json({ error: "Erro interno ao atualizar o grupo." });
  }
}

export async function addMemberToGroup(req, res, next) {
  try {
    const { groupId } = req.params;
    const { email } = req.body;
    const requesterId = req.user.uid;

    if (!email) return res.status(400).json({ error: "O e-mail do membro é obrigatório." });

    const groupRef = db.collection("grupos").doc(groupId);
    const groupDoc = await groupRef.get();
    if (!groupDoc.exists) return res.status(404).json({ error: "Grupo não encontrado." });

    const groupData = groupDoc.data();
    if (groupData.professorId !== requesterId) return res.status(403).json({ error: "Apenas o professor do grupo pode adicionar membros." });

    const usersRef = db.collection("usuarios");
    const userQuery = await usersRef.where("email", "==", email).limit(1).get();
    if (userQuery.empty) return res.status(404).json({ error: `Usuário com o e-mail '${email}' não encontrado.` });

    const userToAddId = userQuery.docs[0].id;
    if (groupData.membros && groupData.membros.includes(userToAddId)) {
        return res.status(400).json({ error: "Este usuário já é membro do grupo." });
    }

    await groupRef.update({ membros: admin.firestore.FieldValue.arrayUnion(userToAddId) });
    
    const newMemberData = { id: userQuery.docs[0].id, ...userQuery.docs[0].data() };
    res.status(200).json({ message: "Membro adicionado com sucesso!", newMember: newMemberData });
  } catch (error) {
    console.error("Erro ao adicionar membro ao grupo:", error);
    next(error);
  }
}

export async function deleteGroup(req, res) {
  try {
    const { id } = req.params;
    const uid = req.user.uid;
    const groupRef = db.collection('grupos').doc(id);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists) return res.status(404).json({ error: "Grupo não encontrado." });
    if (groupDoc.data().professorId !== uid) return res.status(403).json({ error: "Você não tem permissão para excluir este grupo." });
    
    await groupRef.delete();
    res.status(200).json({ message: "Grupo excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir grupo:", error);
    res.status(500).json({ error: "Erro interno ao excluir o grupo." });
  }
}

export async function removeMemberFromGroup(req, res) {
  try {
    const { id, memberId } = req.params;
    const uid = req.user.uid;
    const groupRef = db.collection('grupos').doc(id);
    const groupDoc = await groupRef.get();
    if (!groupDoc.exists) return res.status(404).json({ error: "Grupo não encontrado." });

    const groupData = groupDoc.data();
    if (memberId === groupData.professorId) return res.status(403).json({ error: "O professor não pode ser removido do grupo. O grupo deve ser excluído." });
    if (memberId === uid) {
      await groupRef.update({ membros: admin.firestore.FieldValue.arrayRemove(memberId) });
      return res.status(200).json({ message: "Você saiu do grupo com sucesso!" });
    }
    if (groupData.professorId !== uid) return res.status(403).json({ error: "Apenas o professor pode remover outros membros." });

    await groupRef.update({ membros: admin.firestore.FieldValue.arrayRemove(memberId) });
    res.status(200).json({ message: "Membro removido com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover membro do grupo:", error);
    res.status(500).json({ error: "Erro interno ao remover membro do grupo." });
  }
}
