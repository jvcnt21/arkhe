import React, { useState, useEffect } from "react";
import "../styles/login.css";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo-arkhe.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 👉 useEffect para aplicar a classe no body
  useEffect(() => {
    document.body.classList.add("login-page");

    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);

      // 🔥 REDIRECIONA PARA HOME EM VEZ DE /notifications
      navigate("/home", { replace: true });

    } catch (error) {
      alert("Erro ao fazer login. Verifique suas credenciais.");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Logo" className="logo" />

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />

          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
