
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/*
  Este componente agora tem uma única responsabilidade:
  Se o usuário estiver logado, redireciona-o para a página principal (/groups).
  Caso contrário, permite o acesso à rota pública (ex: /login).
  A verificação de `loading` foi removida porque é agora tratada globalmente em `App.jsx`.
*/
const PublicRoute = () => {
  const { currentUser } = useAuth();

  // Adicionamos uma verificação explícita para saber se o usuário está logado
  if (currentUser) {
    // Se o usuário já estiver logado, ele é redirecionado para a página de grupos.
    // Isso evita que um usuário logado veja a página de login novamente.
    return <Navigate to="/groups" replace />;
  }

  // Se não houver um usuário logado, o componente renderiza as rotas filhas (Outlet),
  // que no caso são as páginas de Login e Registro.
  return <Outlet />;
};

export default PublicRoute;
