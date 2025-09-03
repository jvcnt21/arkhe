import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged // Observa o estado de autenticação
} from 'firebase/auth';
import { auth } from '../firebase'; // Importa a instância de auth que criamos

// 1. Crie o Contexto
const AuthContext = createContext();

// 2. Crie um Hook customizado para usar o Contexto facilmente
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Crie o Provedor de Autenticação
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Estado do usuário logado
  const [loading, setLoading] = useState(true); // Indica se o estado inicial de auth já foi carregado

  // Funções de Autenticação
  const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  // Observador do estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Define o usuário atual (null se deslogado)
      setLoading(false); // O carregamento inicial foi concluído
    });

    // Limpeza: desinscreve o observador quando o componente é desmontado
    return unsubscribe;
  }, []);

  // Valores que serão providos para os componentes filhos
  const value = {
    currentUser,
    register,
    login,
    logout,
    loading // Para saber quando o estado inicial de auth já carregou
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Renderiza os filhos somente quando o estado de autenticação inicial estiver carregado */}
      {!loading && children}
    </AuthContext.Provider>
  );
}
