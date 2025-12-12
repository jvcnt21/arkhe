import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/sidebar.css";
import "../styles/quadrodetarefas.css";
import logoFull from "../assets/logo-arkhe.png";
import logoIcon from "../assets/logo-icon.png"; // ou .jpg se for JPG

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const lastVisitedGroup = localStorage.getItem('lastVisitedGroup');

  const handleLogout = async (e) => {
    e.stopPropagation();
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  const handleHomeClick = () => {
    if (lastVisitedGroup) {
      navigate(`/group/${lastVisitedGroup}`);
    } else {
      navigate('/groups');
    }
  };

  const handleNotificationClick = () => {
    if (lastVisitedGroup) {
      navigate(`/group/${lastVisitedGroup}/notifications`);
    }
  };

  const handleTaskBoardClick = () => {
    if (lastVisitedGroup) {
      navigate(`/group/${lastVisitedGroup}/board`);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logoIcon} alt="Arkhe" className="logo-icon" />
        <img src={logoFull} alt="Arkhe" className="logo-full" />
      </div>

      <nav className="sidebar-menu">
        <div className="menu-item" onClick={handleHomeClick} style={{ cursor: "pointer" }}>
          <i className="fa-solid fa-house"></i>
          <span>Início</span>
        </div>

        <div className="menu-item" onClick={() => navigate("/groups")} style={{ cursor: "pointer" }}>
          <i className="fa-solid fa-users"></i>
          <span>Grupos</span>
        </div>

        <div 
          className={`menu-item ${!lastVisitedGroup ? 'disabled' : ''}`}
          onClick={handleNotificationClick} 
          style={{ cursor: lastVisitedGroup ? "pointer" : "not-allowed" }}
        >
          <i className="fa-solid fa-bell"></i>
          <span>Notificações</span>
        </div>

        <div 
          className={`menu-item ${!lastVisitedGroup ? 'disabled' : ''}`}
          onClick={handleTaskBoardClick} 
          style={{ cursor: lastVisitedGroup ? "pointer" : "not-allowed" }}
        >
          <i className="fa-solid fa-list-check"></i>
          <span>Quadro de Tarefas</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-icon" onClick={() => navigate("/perfil")} style={{ cursor: "pointer" }}>
          <i className="fa-solid fa-user"></i>
        </div>
      </div>
    </div>
  );
}