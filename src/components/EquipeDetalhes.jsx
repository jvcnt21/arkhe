import React, { useState, useEffect } from 'react';
import { FiEdit } from "react-icons/fi";
import { useOutletContext, useNavigate } from 'react-router-dom'; // useNavigate importado
import { useAuth } from '../context/AuthContext';
import AddMemberModal from './AddMemberModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import RenameGroupModal from './RenameGroupModal'; 
import api from '../services/api';
import '../styles/equipeDetalhes.css'; 

function EquipeDetalhes() {
  const { group, members, isProfessor, fetchGroupAndMembers } = useOutletContext();
  const navigate = useNavigate(); // Hook para navegação
  const { userData } = useAuth();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(group ? group.description || '' : '');
  const [ultimasNotificacoes, setUltimasNotificacoes] = useState([]);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isRenameModalOpen, setRenameModalOpen] = useState(false);
  
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addMemberError, setAddMemberError] = useState('');
  const [addMemberSuccess, setAddMemberSuccess] = useState('');
  
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  if (!group) {
    return <div>Carregando detalhes...</div>;
  }

  useEffect(() => {
    async function fetchNotificacoes() {
      try {
        const groupId = group.id || group._id;
        if (!groupId) return;
  
        const response = await api.get(`/notificacoes/${groupId}/ultimas/3`);
        setUltimasNotificacoes(response.data);
      } catch (error) {
        console.error("Erro ao carregar últimas notificações", error);
      }
    }
  
    fetchNotificacoes();
  }, [group]);  
  

  // Função para navegar para a página de notificações
  const handleNotificationsClick = () => {
    const groupId = group.id || group._id;
    navigate(`/group/${groupId}/notifications`);

  };

  const handleDescriptionUpdate = async () => {
    try {
      await api.put(`/grupos/${group.id}`, { descricao: description });
      fetchGroupAndMembers();
      setIsEditingDescription(false);
    } catch (err) {
      console.error('Erro ao atualizar a descrição:', err);
    }
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    setAddMemberError('');
    setAddMemberSuccess('');
    if (!newMemberEmail) {
      setAddMemberError('Por favor, insira um e-mail.');
      return;
    }
    try {
      await api.post(`/grupos/${group.id}/members`, { email: newMemberEmail });
      fetchGroupAndMembers();
      setAddMemberSuccess('Membro adicionado com sucesso!');
      setTimeout(() => {
        setAddModalOpen(false);
        setNewMemberEmail('');
        setAddMemberSuccess('');
      }, 1500);
    } catch (err) {
      setAddMemberError(err.response?.data?.error || 'Erro ao adicionar membro.');
    }
  };

  const openConfirmModal = (member) => {
    setMemberToRemove(member);
    setConfirmModalOpen(true);
    setOpenMenuId(null);
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    try {
      await api.delete(`/grupos/${group.id}/members/${memberToRemove.id}`);
      fetchGroupAndMembers();
      setConfirmModalOpen(false);
      setMemberToRemove(null);
    } catch (err) {
      console.error('Erro ao remover membro:', err);
    }
  };

  const handleRenameGroup = async (newName) => {
    try {
        await api.put(`/grupos/${group.id}`, { nome: newName });
        fetchGroupAndMembers();
        setRenameModalOpen(false);
    } catch (error) {
        console.error("Erro ao renomear o grupo", error);
    }
  };

  const getColorForInitial = (initial) => {
    const colors = ['#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6', '#4fc3f7', '#4dd0e1', '#4db6ac', '#81c784', '#aed581', '#ff8a65', '#d4e157', '#ffd54f', '#ffb74d'];
    return colors[initial.charCodeAt(0) % colors.length] || colors[0];
  };

  return (
    <div className="group-details-container">
      <div className="project-info-box">
        <h2>{group.nomeDoProjeto || 'Projeto sem nome'}</h2>
        <p className="group-theme">Tema: {group.tema || 'Não definido'}</p>

        <div className="description-section">
          <h3>Descrição</h3>
          {isEditingDescription ? (
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="description-textarea"
                rows="4"
              />
              <button onClick={handleDescriptionUpdate} className="save-description-button">Salvar</button>
              <button onClick={() => setIsEditingDescription(false)} className="cancel-description-button">Cancelar</button>
            </div>
          ) : (
            <p>{description || 'Nenhuma descrição adicionada.'}</p>
          )}
        </div>

        {/* Novos quadrados de widget abaixo da descrição */}
        <div className="group-widgets-container">
        <div className="widget-box notifications-widget" onClick={handleNotificationsClick}>
  <h4 className="widget-title">Notificações</h4>

  <div className="widget-content">
    {ultimasNotificacoes.length === 0 ? (
      <p>Nenhuma notificação recente.</p>
    ) : (
      <ul className="notificacoes-preview">
        {ultimasNotificacoes.map((notif) => (
          <li key={notif.id}>
            <strong>{notif.titulo}</strong>
            <p>{notif.descricao?.substring(0, 40) || notif.texto?.substring(0, 40)}...</p>
          </li>
        ))}
      </ul>
    )}
    <p className="ver-todas">Clique para ver todas →</p>
  </div>
</div>


          
          <div className="widget-box progress-widget">
            <h4 className="widget-title">Progresso do Grupo</h4>
            <div className="widget-content">
              <p>Em desenvolvimento.</p>
            </div>
          </div>
        </div>

        {isProfessor && (
          <div className="professor-actions-details">
            <button 
            onClick={() => setIsEditingDescription(!isEditingDescription)} 
            className="action-button edit-description-button">
            <FiEdit size={18} style={{ marginRight: 6 }} />
            {isEditingDescription ? 'Cancelar' : 'Editar'}
          </button>
          </div>
        )}
      </div>

      <div className="members-section-details">
        <div className="members-header">
          <h3>Integrantes</h3>
          {isProfessor && (
            <button onClick={() => setAddModalOpen(true)} className="add-member-button">Adicionar Membro</button>
          )}
        </div>
        <ul className="members-list">
          {members.map((member) => {
            const initial = member.nome ? member.nome.charAt(0).toUpperCase() : '?';
            const isCurrentUser = member.id === userData.uid;
            return (
              <li key={member.id} className="member-item">
                <div className="member-info">
                  <div className="member-initial-icon" style={{ backgroundColor: getColorForInitial(initial) }}>{initial}</div>
                  <div className="member-details">
                    <span className="member-name">{member.nome}{isCurrentUser && ' (Você)'}</span>
                    <span className="member-email">{member.email}</span>
                  </div>
                </div>
                {isProfessor && !isCurrentUser && (
                  <div className="member-actions">
                    <button onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)} className="member-menu-button">⋮</button>
                    {openMenuId === member.id && (
                      <div className="member-menu">
                        <button onClick={() => openConfirmModal(member)} className="remove-member-button">Remover</button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Modais */}
      <AddMemberModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onSubmit={handleAddMemberSubmit} email={newMemberEmail} setEmail={setNewMemberEmail} error={addMemberError} success={addMemberSuccess}/>
      <ConfirmDeleteModal isOpen={isConfirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={handleRemoveMember} title="Remover Membro" message={`Você tem certeza que deseja remover este membro do grupo?`}/>
      <RenameGroupModal isOpen={isRenameModalOpen} onClose={() => setRenameModalOpen(false)} onRename={handleRenameGroup} currentName={group.nome}/>
    </div>
  );
}

export default EquipeDetalhes;