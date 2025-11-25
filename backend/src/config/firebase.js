import admin from "firebase-admin";
import dotenv from "dotenv";


dotenv.config();


// Garante que a variável exista antes de usar replace
const privateKey = process.env.FIREBASE_PRIVATE_KEY
? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
: undefined;


if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
console.warn("Atenção: variáveis de ambiente do Firebase não estão completas. Verifique .env");
}


admin.initializeApp({
credential: admin.credential.cert({
projectId: process.env.FIREBASE_PROJECT_ID,
clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
privateKey,
}),
});


export { admin };