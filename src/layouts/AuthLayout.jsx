
import React from 'react';
import { Outlet } from 'react-router-dom';

/*
  Este componente de layout é para as páginas de autenticação (Login, Registo).
  A sua única responsabilidade é renderizar o componente da rota filha.
  Ele NÃO deve ter uma barra lateral ou outros elementos de navegação da app principal.
*/
const AuthLayout = () => {
  return (
    <div className="auth-container">
      <main>
        {/* O Outlet é essencial para o React Router renderizar a rota correspondente (ex: Login) */}
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
