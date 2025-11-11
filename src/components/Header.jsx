import React from "react";
import "../styles/header-extra.css";
import { useAuth } from "../context/AuthContext";

export default function Header({ onMenuClick, pageTitle }) {
  const { currentUser } = useAuth();

  return (
    <header className="app-header">
      {/* Botão Mobile - abre o menu */}
      <button className="header-menu-btn" onClick={onMenuClick}>
        <i className="fi fi-rr-menu-burger"></i>
      </button>

      {/* Título da página */}
      <h1 className="header-title">{pageTitle || ""}</h1>

      {/* Perfil do usuário */}
      <div className="header-user">
        <img
          src={currentUser?.photoURL || "/assets/user-placeholder.png"}
          alt="User"
          className="header-avatar"
        />
      </div>
    </header>
  );
}
