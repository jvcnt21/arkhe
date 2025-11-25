import React, { useState, useEffect } from "react";
import "../styles/perfil.css";
import { useAuth } from "../context/AuthContext";

function Perfil() {
  const { currentUser, logout } = useAuth();

  const [nome, setNome] = useState(currentUser?.nome || "");
  const [duvidas, setDuvidas] = useState("");

  useEffect(() => {
    setNome(currentUser?.nome || "");
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Nome atualizado localmente (persistência não implementada).");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  const getInitial = (n) => {
    if (!n) return "?";
    return n.charAt(0).toUpperCase();
  };

  return (
    <div className="perfil-container">
      <h1 className="perfil-title">Meu Perfil</h1>

      <div className="perfil-card">

        {/* ====== TOPO (AVATAR + NOME + LOGOUT) ====== */}
        <div className="perfil-top">
          <div className="perfil-avatar">{getInitial(nome)}</div>

          {/* Nome no lugar da faixa rosa */}
          <div className="perfil-nome-exibido">{nome || "Seu nome"}</div>

          {/* Logout no canto direito */}
          <button className="logout-top-right" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <p className="perfil-email">{currentUser?.email}</p>

        {/* FORMULÁRIO */}
        <form className="perfil-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Nome completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome e sobrenome"
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input type="email" value={currentUser?.email || ""} disabled />
          </div>

          <div className="form-group">
            <label>RA</label>
            <input type="text" value={currentUser?.ra || "000000"} disabled />
          </div>

          <div className="form-group">
            <label>Orientador</label>
            <input type="text" value={currentUser?.orientador || "Não definido"} disabled />
          </div>

          <div className="form-group">
            <label>Dúvidas para o orientador</label>
            <textarea
              rows="5"
              value={duvidas}
              onChange={(e) => setDuvidas(e.target.value)}
              placeholder="Escreva aqui suas dúvidas..."
            ></textarea>
          </div>

          <button type="submit" className="btn-salvar">
            Salvar Alterações
          </button>
        </form>

      </div>
    </div>
  );
}

export default Perfil;
