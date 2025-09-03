import React from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { useAuth } from './context/AuthContext'; // Importe o hook

function App() {
  const { currentUser, loading } = useAuth(); // Obtenha o usuário e o estado de carregamento

  if (loading) {
    return <div>Carregando aplicação...</div>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {currentUser ? <Dashboard /> : <Login />}
    </div>
  );
}

export default App;
