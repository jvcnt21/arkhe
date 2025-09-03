import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importe o hook

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Obtenha a função de login do seu contexto

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      // Redirecionar o usuário para outra página (e.g., dashboard)
      // Ex: history.push('/dashboard'); (se estiver usando react-router-dom)
      console.log('Login efetuado com sucesso!');
    } catch (err) {
      setError('Falha no login: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default Login;
