// Importa os módulos necessários
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCyinukt7MjXMKB-PHtSFt5CU88Onhd8mI",
  authDomain: "arkhe-6f247.firebaseapp.com",
  projectId: "arkhe-6f247",
  storageBucket: "arkhe-6f247.firebasestorage.app",
  messagingSenderId: "941813835266",
  appId: "1:941813835266:web:5d24a652dfbb29d496291b",
  measurementId: "G-5XVEBW9DZR"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
