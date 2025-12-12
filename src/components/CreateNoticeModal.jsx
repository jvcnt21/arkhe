import React, { useState } from 'react';
import '../styles/CreateNoticeModal.css';

function CreateNoticeModal({ isOpen, onClose, onCreateNotice }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert('Por favor, preencha o título e a descrição.');
      return;
    }
    // CORREÇÃO: Passa os dados com os nomes de campo corretos (titulo e descricao)
    onCreateNotice({ titulo: title, descricao: description });
    setTitle('');
    setDescription('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Criar Novo Aviso</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
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
}

export default CreateNoticeModal;
