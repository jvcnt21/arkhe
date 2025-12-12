import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useParams, Outlet, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import RenameGroupModal from './RenameGroupModal';
import '../styles/GroupPage.css'; 

function GroupPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ultimasNotificacoes, setUltimasNotificacoes] = useState([]);

  const { userData, currentUser } = useAuth();
  
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isRenameModalOpen, setRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchGroupAndMembers = async () => {
    try {
      setLoading(true);
      const groupResponse = await api.get(`/grupos/${id}`);
      const groupData = groupResponse.data;
      setGroup(groupData);

      if (groupData && groupData.membros) {
        const memberPromises = groupData.membros.map(memberId =>
          api.get(`/users/${memberId}`)
        );
        const memberResponses = await Promise.all(memberPromises);
        setMembers(memberResponses.map((res, index) => ({ ...res.data, id: groupData.membros[index] })));
      }
      setError('');
    } catch (err) {
      setError('Erro ao carregar os dados do grupo. O grupo pode não existir ou você não tem permissão para vê-lo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      localStorage.setItem('lastVisitedGroup', id);
      fetchGroupAndMembers();
    }
  }, [id]);

  const handleRenameGroup = async (updatedGroup) => {
    try {
      await api.put(`/grupos/${id}`, updatedGroup);
      fetchGroupAndMembers();
      setRenameModalOpen(false);
    } catch (error) {
      console.error("Erro ao renomear o grupo", error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await api.delete(`/grupos/${id}`);
      navigate('/groups');
    } catch (error) {
      console.error("Erro ao excluir o grupo", error);
    }
  };
  

  
  const isProfessor = currentUser && group && currentUser.uid === group.professorId;


  if (loading) return <p className="loading-message">Carregando grupo...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!group) return <p>Grupo não encontrado.</p>;

  return (
    <div className="group-page-container">
      <header className="group-page-header">
        <h1>{group.nome}</h1>
        {isProfessor && (
  <div className="group-actions">
    {/* Ícone de editar */}
    <button
      onClick={() => setRenameModalOpen(true)}
      className="icon-button"
      title="Renomear grupo"
    >
      <FiEdit size={22} />
    </button>

    {/* Ícone de excluir */}
    <button
      onClick={() => setDeleteModalOpen(true)}
      className="delete-icon-button"
      title="Excluir grupo"
    >
      <FiTrash2 size={22} />
    </button>
  </div>
        )}
      </header>

      <main className="group-page-main">
         <Outlet context={{ group, members, isProfessor, fetchGroupAndMembers }} />
      </main>

      <RenameGroupModal
        isOpen={isRenameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        onRename={handleRenameGroup}
        group={group}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteGroup}
        title="Excluir Grupo"
        message={`Você tem certeza que deseja excluir o grupo "${group.nome}"? Esta ação é irreversível.`}
      />
    </div>
  );
}

export default GroupPage;
