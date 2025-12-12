
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/*
  Este componente também foi simplificado.
  A sua única responsabilidade é proteger rotas.
  Se não houver um usuário logado, redireciona para a página de login.
  Caso contrário, permite o acesso à rota protegida.
  A verificação de `loading` foi removida porque é agora tratada globalmente em `App.jsx`.
*/
const ProtectedRoute = () => {
  const { currentUser } = useAuth();

  // A lógica é agora direta: há um usuário? Se sim, renderiza o conteúdo protegido (Outlet).
  // Se não, redireciona para a página de login.
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
