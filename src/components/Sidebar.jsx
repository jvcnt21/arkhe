import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/sidebar.css";

export default function Sidebar() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const userRef = useRef(null);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  const handleToggle = (e) => {
    e.stopPropagation();
    const rect = userRef.current.getBoundingClientRect();
    setPos({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX + rect.width / 2,
    });
    setOpen((prev) => !prev);
  };

  const handleLogout = async (e) => {
    e.stopPropagation();
    setOpen(false);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popupRef.current?.contains(e.target) ||
        userRef.current?.contains(e.target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src="/src/assets/logo-arkhe.png" alt="Logo" />
        </div>

        <nav className="sidebar-menu">
          <div
            className="menu-item"
            onClick={() => navigate("/home")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-house"></i>
            <span>Início</span>
          </div>
          <div
            className="menu-item"
            onClick={() => navigate("/tasks")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-list-check"></i>
            <span>Quadro de Tarefas</span>
          </div>
          <div
            className="menu-item"
            onClick={() => navigate("/notifications")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-bell"></i>
            <span>Notificações</span>
          </div>
          <div
            className="menu-item"
            onClick={() => navigate("/activity")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-chart-line"></i>
            <span>Atividades</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div
            className="user-icon"
            ref={userRef}
            onClick={() => navigate("/perfil")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-user"></i>
          </div>
        </div>
      </div>

      {open &&
        createPortal(
          <div
            ref={popupRef}
            style={{
              position: "absolute",
              top: pos.top - 8,
              left: pos.left,
              transform: "translate(-50%, -100%)",
              zIndex: 99999,
            }}
          >
            <div
              className="logout-popup"
              style={{
                background: "#fff",
                color: "#132469",
                padding: "8px 14px",
                borderRadius: 10,
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                whiteSpace: "nowrap",
              }}
            >
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "#132469",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
