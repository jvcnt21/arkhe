
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';
import logo from '../assets/logo-arkhe.png';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nome, setNome] = useState('');
  const [tipoConta, setTipoConta] = useState('aluno');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('As senhas não coincidem.');
    }
    if (password.length < 6) {
      return setError('A senha deve ter pelo menos 6 caracteres.');
    }

    setLoading(true);
    try {
      await register(email, password, nome, tipoConta);
      navigate('/groups');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está cadastrado. Tente fazer login.');
      } else {
        setError('Falha ao criar a conta. Verifique os dados e tente novamente.');
      }
      console.error("Erro no registro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <img src={logo} alt="Arkhe Logo" className="logo" />
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="tipo-conta">Eu sou:</label>
          <select
            id="tipo-conta"
            value={tipoConta}
            onChange={(e) => setTipoConta(e.target.value)}
          >
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor='nome'>Nome Completo</label>
          <input
            type='text'
            id='nome'
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor='password'>Senha (mín. 6 caracteres)</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor='confirm-password'>Confirmar Senha</label>
          <input
            type='password'
            id='confirm-password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button type='submit' className="login-button" disabled={loading}>
          {loading ? 'Criando conta...' : 'Cadastrar'}
        </button>
        <p className="switch-auth">
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
