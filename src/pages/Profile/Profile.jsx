import React from "react";
import "./profile.css";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h2 className="profile-title">Meu Perfil</h2>
        <p className="profile-sub">Gerencie suas informações pessoais</p>
      </header>

      <Card className="profile-card">
        <div className="profile-top">
          <img
            src={currentUser?.photoURL || "/assets/user-placeholder.png"}
            alt="Avatar"
            className="profile-avatar"
          />
          <Button variant="ghost" className="edit-btn">Alterar foto</Button>
        </div>

        <div className="profile-info">
          <div className="info-row">
            <span className="info-label">Nome</span>
            <span className="info-value">{currentUser?.displayName || "Usuário"}</span>
          </div>

          <div className="info-row">
            <span className="info-label">E-mail</span>
            <span className="info-value">{currentUser?.email}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Cargo</span>
            <span className="info-value">Aluno(a)</span>
          </div>
        </div>
      </Card>

      <div className="profile-actions">
        <Button variant="primary" className="action-btn">Editar Informações</Button>
      </div>
    </div>
  );
}
