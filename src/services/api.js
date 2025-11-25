import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
