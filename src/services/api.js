import axios from "axios";
import { auth } from "../firebase.js";

// Use baseURL RELATIVA para passar pelo proxy do Vite
const api = axios.create({
  baseURL: '/api'  // ← MUDE PARA ISSO
});

// O interceptor adiciona o token de autenticação a cada requisição
api.interceptors.request.use(async (config) => {
  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken(true);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error("Erro ao obter o token de autenticação:", error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;