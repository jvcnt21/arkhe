import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Componentes de Rota
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Páginas
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Groups from './components/Groups';
import Tasks from './components/Tasks';
import Notifications from './components/Notifications';
import Perfil from './components/Perfil';
import GroupPage from './components/GroupPage';
import EquipeDetalhes from './components/EquipeDetalhes';
import QuadroDeTarefas from './components/quadrodetarefads'; // Importação adicionada

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="app-loading">A carregar aplicação...</div>;
  }

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      {/* Rotas Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Rotas de navegação principais */}
          <Route path="/home" element={<Home />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/perfil" element={<Perfil />} />

          {/* Rota para um Grupo Específico */}
          <Route path="/group/:id" element={<GroupPage />}>
            <Route index element={<EquipeDetalhes />} />
          </Route>
          
           {/* Rota de notificações isolada */}
          <Route path="/group/:id/notifications" element={<Notifications />} />

          {/* Rota para o Quadro de Tarefas de um grupo */}
          <Route path="/group/:id/board" element={<QuadroDeTarefas />} />

        </Route>
      </Route>
      
      {/* Redirecionamento geral para a página de login se nenhuma rota corresponder */}
      <Route 
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
