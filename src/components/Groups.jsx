import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CreateGroupModal from './CreateGroupModal';
import logo from '../assets/logo-arkhe.png';
import '../styles/Groups.css';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser, userData, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔍 useEffect executado");
    console.log("authLoading:", authLoading);
    console.log("currentUser:", currentUser);
    console.log("userData:", userData);

    // Aguarda carregar
    if (authLoading) {
      console.log("⏳ Aguardando autenticação...");
      return;
    }

    // Se não tem usuário logado
    if (!currentUser || !userData) {
      console.log("❌ Usuário não logado");
      setGroups([]);
      setLoading(false);
      return;
    }

    // Busca os grupos
    const fetchGroups = async () => {
      try {
        console.log("📡 Buscando grupos...");
        setLoading(true);
        const response = await api.get('/grupos');
        console.log("✅ Grupos recebidos:", response.data);
        setGroups(response.data || []); 
      } catch (error) {
        console.error("❌ Erro ao buscar grupos:", error);
        console.error("Resposta do erro:", error.response?.data);
        setGroups([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [currentUser, userData, authLoading]); // ← Corrigido: inclui userData

  const handleCreateGroup = async (groupData) => {
    if (userData?.tipoConta !== 'professor') {
      alert("Apenas professores podem criar grupos.");
      return;
    }

    try {
      const response = await api.post('/grupos', {
        nome: groupData.nome,
        nomeDoProjeto: groupData.nomeDoProjeto,
        tema: groupData.tema
      });
      setGroups(prevGroups => [...prevGroups, response.data]);
      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar grupo:", error.response?.data || error.message);
      alert(`Ocorreu um erro ao criar o grupo. Verifique o console para mais detalhes.`);
    }
  };

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };  

  if (authLoading || loading) {
    return <div className="loading-container">Carregando...</div>;
  }

  return (
    <div className="groups-container-center">
      <img src={logo} alt="Logo Arkhe" className="project-logo" />

      <div className="group-list-frame">
        <div className="group-list">
          {groups.length === 0 ? (
            <div className="no-groups-message">
              Nenhum grupo encontrado. {userData?.tipoConta === 'professor' ? 'Crie seu primeiro grupo!' : 'Aguarde um professor adicionar você a um grupo.'}
            </div>
          ) : (
            groups.map(group => (
              <div key={group.id} className="group-list-item" onClick={() => handleGroupClick(group.id)}>
                <div className="group-icon">
                  {group.nome ? group.nome.charAt(0).toUpperCase() : '!'}
                </div>
                <span className="group-name">
                  {group.nome || 'Grupo inválido'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {userData?.tipoConta === 'professor' && (
        <button onClick={() => setModalOpen(true)} className="create-group-button-center">
          Criar Grupo
        </button>
      )}

    <button onClick={handleLogout} className="logout-floating-button">
      Logout
    </button>

      {isModalOpen && (
        <CreateGroupModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onCreateGroup={handleCreateGroup}
        />
      )}
    </div>
  );
}

export default Groups;