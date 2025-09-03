import React from 'react';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { currentUser, logout, loading } = useAuth(); // Obtenha o usuário atual e a função de logout

  if (loading) {
    return <p>Carregando usuário...</p>;
  }

  if (!currentUser) {
    // Se não houver usuário logado, você pode redirecionar para a página de login
    // Ou exibir uma mensagem para o usuário logar
    return (
      <div>
        <h2>Você não está logado.</h2>
        <p>Por favor, faça login para acessar esta página.</p>
        {/* Adicione um link para a página de login aqui */}
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      // Redirecionar para a página inicial ou de login após o logout
      console.log('Logout efetuado com sucesso!');
    } catch (error) {
      console.error('Erro ao deslogar:', error.message);
    }
  };

  return (
    <div>
      <h2>Bem-vindo, {currentUser.email}!</h2>
      <p>Este é o seu painel de controle.</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}

export default Dashboard;
