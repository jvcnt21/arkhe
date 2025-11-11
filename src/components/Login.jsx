import React, { useState } from "react";
import "../styles/login-screen.css";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/Button";
import Input from "./ui/Input";

export default function Login() {
  const { login, loginWithMicrosoft } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      console.error("Erro ao fazer login", err);
    }
    setLoading(false);
  };

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    try {
      await loginWithMicrosoft();
    } catch (err) {
      console.error("Erro ao entrar com Microsoft", err);
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        
        <div className="login-logo-box">
          <img src="/assets/logo-arkhe.png" alt="logo" className="login-logo" />
          <h2 className="login-title">Arkhe</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="login-divider">
          <span></span>
          <p>Ou</p>
          <span></span>
        </div>

        <Button variant="microsoft" onClick={handleMicrosoftLogin} disabled={loading}>
          <img src="/assets/microsoft-icon.png" alt="ms" className="ms-icon" />
          Entrar com Microsoft
        </Button>
      </div>
    </div>
  );
}
