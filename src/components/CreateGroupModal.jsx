import React, { useState } from 'react';
import '../styles/CreateGroupModal.css';

const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }) => {
  const [nome, setNome] = useState('');
  const [nomeDoProjeto, setNomeDoProjeto] = useState('');
  const [tema, setTema] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nome.trim() && nomeDoProjeto.trim() && tema.trim()) {
      onCreateGroup({ nome, nomeDoProjeto, tema });
      setNome('');
      setNomeDoProjeto('');
      setTema('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Criar Novo Grupo</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome do Grupo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nome do Projeto"
            value={nomeDoProjeto}
            onChange={(e) => setNomeDoProjeto(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Tema do Grupo"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            required
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="create-button">
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
