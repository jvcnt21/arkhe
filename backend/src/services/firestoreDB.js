// backend/src/services/firestoreDB.js
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../config/firebaseServiceAccountKey.json" assert { type: "json" };

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export default db;
