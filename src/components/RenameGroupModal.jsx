import React, { useState, useEffect } from 'react';
import '../styles/RenameGroupModal.css';

function RenameGroupModal({ isOpen, onClose, onRename, group }) {
  const [nome, setNome] = useState('');
  const [nomeDoProjeto, setNomeDoProjeto] = useState('');
  const [tema, setTema] = useState('');

  useEffect(() => {
    if (group) {
      setNome(group.nome || '');
      setNomeDoProjeto(group.nomeDoProjeto || '');
      setTema(group.tema || '');
    } else {
      setNome('');
      setNomeDoProjeto('');
      setTema('');
    }
  }, [group]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim() || !nomeDoProjeto.trim() || !tema.trim()) {
      alert('O nome do grupo, do projeto e o tema não podem estar vazios.');
      return;
    }
    onRename({ ...group, nome, nomeDoProjeto, tema });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Renomear Grupo</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="groupName">Nome do Grupo</label>
            <input
              type="text"
              id="groupName"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="projectName">Nome do Projeto</label>
            <input
              type="text"
              id="projectName"
              value={nomeDoProjeto}
              onChange={(e) => setNomeDoProjeto(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tema">Tema do Grupo</label>
            <input
              type="text"
              id="tema"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-confirm-rename">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RenameGroupModal;
