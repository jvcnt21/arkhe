
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase.js';
import api from '../services/api'; // Importando a instância da API

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback((email, password) => {
    // O login continua a ser tratado pelo Firebase Auth no cliente
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const logout = useCallback(() => {
    setUserData(null);
    // O logout do Firebase acionará o onAuthStateChanged para limpar o currentUser
    return signOut(auth);
  }, []);

  const register = useCallback(async (email, password, nome, tipoConta) => {
    // 1. Cria o usuário no Firebase Authentication (como antes)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // O onAuthStateChanged será acionado automaticamente aqui.
    // Ele pegará o token e fará o login do usuário na API.
    // Após o login, ele também chamará o endpoint de registro.

    // 2. Chama o endpoint do backend para salvar os dados no Firestore
    // O interceptor do axios irá anexar o token automaticamente
    await api.post('/users/register', {
      nome,
      tipoConta,
    });
    
    // Recarrega os dados do usuário após o registro para garantir que a UI esteja atualizada
    const { data } = await api.get('/users/me');
    setUserData(data);

    return userCredential;
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);
        if (user) {
          // Pega o token do Firebase
          const token = await user.getIdToken();
          console.log('Token obtido:', token ? 'sim' : 'não');
          
          // Usuário está logado no Firebase. Agora, buscamos os dados do nosso backend.
          const { data } = await api.get('/users/me');
          console.log('Dados do usuário:', data);
          setUserData(data);
        } else {
          // Usuário fez logout ou a sessão expirou.
          setUserData(null);
        }
      } catch (error) {
        console.error("Erro completo:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
        
        // Se houver erro (ex: token inválido), desloga o usuário
        setUserData(null);
        // Não limpe o currentUser aqui se for apenas erro de backend
        // setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });
  
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
