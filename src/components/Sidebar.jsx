import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/sidebar-extra.css";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <img src="/assets/logo-arkhe.png" alt="Logo" className="sidebar-logo" />
        <span className="sidebar-title">Arkhe</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/notifications" className="sidebar-link">
          <i className="fi fi-rr-bell"></i>
          Notificações
        </NavLink>

        <NavLink to="/tasks" className="sidebar-link">
          <i className="fi fi-rr-list-check"></i>
          Tarefas
        </NavLink>

        <NavLink to="/activity" className="sidebar-link">
          <i className="fi fi-rr-time-past"></i>
          Atividades
        </NavLink>

        <NavLink to="/profile" className="sidebar-link">
          <i className="fi fi-rr-user"></i>
          Perfil
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-close-btn" onClick={onClose}>
          Fechar Menu
        </button>
      </div>
    </aside>
  );
}
