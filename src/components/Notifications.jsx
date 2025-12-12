import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; // Importa a instância api
import CreateNoticeModal from './CreateNoticeModal';
import '../styles/Notifications.css';

// Componente para renderizar cada notificação
const NotificationItem = ({ notificacao, onDelete }) => {
  const { userData } = useAuth();
  const { id, tipo, titulo, descricao, dataPublicacao, professorId, professorNome } = notificacao;

  const dataFormatada = dataPublicacao?.seconds 
    ? new Date(dataPublicacao.seconds * 1000).toLocaleString('pt-BR') 
    : "Agora mesmo";

  const canDelete = userData?.tipoConta === 'professor' && userData?.uid === professorId;

  return (
    <div className={`notification-item ${tipo?.toLowerCase()}`}>
      <div className="notification-item-header">
        <span className="notification-type">{tipo || 'Notificação'}</span>
        {tipo === 'Aviso' && professorNome && 
          <span className="notification-professor">por {professorNome}</span>
        }
        <span className="notification-date">{dataFormatada}</span>
      </div>
      <div className="notification-item-body">
        <h4>{titulo}</h4>
        <p>{descricao}</p>
      </div>
      {canDelete && (
        <div className="notification-item-footer">
          <button onClick={() => onDelete(id)} className="delete-button">
            Excluir
          </button>
        </div>
      )}
    </div>
  );
};

function Notifications() {
  const { id: idGrupo } = useParams();
  const { userData } = useAuth(); // Token não é mais necessário aqui
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [error, setError] = useState(null);

  const fetchNotificacoes = async () => {
    try {
      // Usa a instância do api para fazer a requisição
      const response = await api.get(`/notificacoes/${idGrupo}`);
      setNotificacoes(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Falha ao carregar notificações');
    }
  };

  useEffect(() => {
    if (idGrupo) {
      fetchNotificacoes();
    }
  }, [idGrupo]); // A dependência do token foi removida

  const handleCreateNotice = async (noticeData) => {
    try {
      // Usa a instância do api para criar o aviso
      const response = await api.post(`/notificacoes/${idGrupo}/avisos`, noticeData);
      const { aviso } = response.data;
      setNotificacoes([aviso, ...notificacoes]);
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Falha ao criar aviso';
      setError(errorMessage);
      alert(`Erro: ${errorMessage}`);
    }
  };

  const handleDeleteNotice = async (idNotificacao) => {
    if (!window.confirm("Tem certeza de que deseja excluir este aviso?")) {
      return;
    }
    try {
      // Usa a instância do api para deletar o aviso
      await api.delete(`/notificacoes/${idGrupo}/${idNotificacao}`);
      setNotificacoes(notificacoes.filter(n => n.id !== idNotificacao));
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Falha ao excluir aviso';
      setError(errorMessage);
      alert(`Erro: ${errorMessage}`);
    }
  };

  return (
    <div className="notifications-container">
      <header className="notifications-header">
        <h1>Notificações do Grupo</h1>
        {userData && userData.tipoConta === 'professor' && (
          <button onClick={() => setIsModalOpen(true)} className="create-notice-button">
            Criar Aviso
          </button>
        )}
      </header>

      {error && <p className="error-message">{error}</p>}

      <main className="notifications-main">
        {notificacoes.length === 0 && !error ? (
          <p>Nenhuma notificação por aqui ainda.</p>
        ) : (
          notificacoes.map(notificacao => (
            <NotificationItem 
              key={notificacao.id} 
              notificacao={notificacao} 
              onDelete={handleDeleteNotice}
            />
          ))
        )}
      </main>

      <CreateNoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateNotice={handleCreateNotice}
      />
    </div>
  );
}

export default Notifications;
