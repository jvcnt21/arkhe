import { admin, db } from "../config/firebase.js";
import { NotFoundError } from "../utils/errors.js";

const BUCKET_NAME = 'arkhe-6f247.appspot.com';

export const registerUser = async (req, res, next) => {
  console.log("--- INICIANDO registerUser ---");
  try {
    const { nome, instituicao, tipoConta } = req.body;
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token não fornecido." });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    
    const newUser = {
      nome: nome || "",
      email: email,
      instituicao: instituicao || "Não informado",
      tipoConta: tipoConta || "aluno",
      createdAt: new Date().toISOString(),
      photoURL: null,
    };

    await db.collection("usuarios").doc(uid).set(newUser);

    console.log(`SUCESSO: Usuário escrito no Firestore para o UID ${uid}`);
    res.status(201).json({ uid, ...newUser });

  } catch (error) {
    console.error("Erro detalhado em registerUser:", error);
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  console.log("--- INICIANDO getMe ---");
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection("usuarios").doc(uid).get();

    if (!userDoc.exists) {
      throw new NotFoundError("Usuário não encontrado no Firestore.");
    }

    res.status(200).json(userDoc.data());

  } catch (error) {
    console.error(`Erro em getMe para o UID: ${req.user.uid}`, error);
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  console.log("--- INICIANDO getUserById ---");
  try {
    const { id } = req.params;
    const userDoc = await db.collection("usuarios").doc(id).get();

    if (!userDoc.exists) {
      throw new NotFoundError("Usuário não encontrado.");
    }

    const { nome, email, photoURL, instituicao, tipoConta } = userDoc.data();
    res.status(200).json({ nome, email, photoURL, instituicao, tipoConta });

  } catch (error) {
    console.error(`Erro em getUserById para o ID: ${req.params.id}`, error);
    next(error);
  }
};

export const generateSignedUrl = async (req, res, next) => {
  console.log("--- INICIANDO generateSignedUrl ---");
  try {
    const { fileName, contentType } = req.body;
    const uid = req.user.uid;
    
    if (!fileName || !contentType) {
      return res.status(400).json({ error: "fileName e contentType são obrigatórios." });
    }

    const bucket = admin.storage().bucket(BUCKET_NAME);
    const filePath = `profile-pictures/${uid}/${Date.now()}-${fileName}`;
    const file = bucket.file(filePath);

    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // Expira em 15 minutos
      contentType: contentType,
    });

    res.status(200).json({ signedUrl, filePath });

  } catch (error) {
    console.error("Erro ao gerar URL assinada:", error);
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  console.log("--- INICIANDO updateUserProfile ---");
  try {
    const { nome, photoURL } = req.body;
    const uid = req.user.uid;

    const dataToUpdate = {};
    if (nome) dataToUpdate.nome = nome;
    if (photoURL) dataToUpdate.photoURL = photoURL;

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ error: "Nenhum dado para atualizar foi fornecido (nome ou photoURL)." });
    }
    
    const userRef = db.collection("usuarios").doc(uid);
    await userRef.update(dataToUpdate);

    // Após a atualização, busca o documento atualizado
    const updatedUserDoc = await userRef.get();

    // Retorna todos os dados do usuário atualizado
    res.status(200).json(updatedUserDoc.data());

  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", error);
    next(error);
  }
};