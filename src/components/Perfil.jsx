
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/perfil.css';

export default function Perfil() {
  const { userData, logout, setUserData } = useAuth(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ nome: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (userData) {
      setFormData({
        nome: userData.nome || '',
        email: userData.email || '',
      });
    }
  }, [userData]);

  const getAvatarLetter = () => {
    return userData?.nome ? userData.nome.charAt(0).toUpperCase() : '?';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (formData.nome === userData.nome) {
      setIsLoading(false);
      setError("Nenhuma alteração para salvar.");
      return;
    }

    try {
      const response = await api.patch('/users/profile', { nome: formData.nome });
      
      // Substitui o estado do usuário pelos dados atualizados da resposta
      setUserData(response.data);

      setSuccess("Nome atualizado com sucesso!");

    } catch (err) {
      console.error("Erro ao atualizar o perfil:", err);
      setError("Falha ao atualizar o nome. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Falha ao fazer logout:', error);
    }
  };

  return (
    <div className="perfil-page-wrapper"> 
      <div className="perfil-container">
        <header className="perfil-header">
          <div className="user-info">
            <div className="user-avatar">{getAvatarLetter()}</div>
            <span className="user-name">{userData?.nome}</span>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </header>

        <form onSubmit={handleSaveChanges} className="perfil-form">
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          
          <div className="input-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled // O email não é editável
            />
          </div>
          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}
