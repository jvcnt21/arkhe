import React from 'react';
import '../styles/AddMemberModal.css';

function AddMemberModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  email, 
  setEmail, 
  error, 
  success 
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2>Adicionar Novo Membro</h2>
        <form onSubmit={onSubmit} className="add-member-form">
          <p>Insira o e-mail do usuário que você deseja adicionar ao grupo.</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail do novo integrante"
            className="add-member-input"
            required
          />
          <button type="submit" className="add-member-button">Adicionar</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
}

export default AddMemberModal;
