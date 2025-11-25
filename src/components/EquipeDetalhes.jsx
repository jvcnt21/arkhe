import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/equipeDetalhes.css";

function EquipeDetalhes() {
  const { state } = useLocation();
  const membro = state;
  const navigate = useNavigate();

  function voltar() {
    navigate("/notifications");
  }

  const entregas = [
    "Documento de requisitos",
    "Protótipo inicial",
    "Correção de bugs",
    "Atualização do dashboard"
  ];

  return (
    <div className="equipe-wrapper">

      {/* 🔙 BOTÃO VOLTAR */}
      <button className="btn-voltar" onClick={voltar}>
        ← Voltar
      </button>

      <h2 className="equipe-title">Detalhes da Equipe</h2>

      <div className="equipe-card">

        {/* CABEÇALHO DO MEMBRO */}
        <div className="equipe-header">
          <div className="equipe-logo">
            {membro.nome.charAt(0)}
          </div>

          <div className="equipe-info">
            <h2>{membro.nome}</h2>
            <p>{membro.cargo}</p>
            <p><strong>Último acesso:</strong> Há 3 dias</p>
          </div>
        </div>

        {/* ENTREGAS */}
        <div className="equipe-extra">
          <h3>Entregas realizadas</h3>

          <ul className="membros-lista">
            {entregas.map((e, i) => (
              <li key={i} className="membro-item">
                <div className="membro-foto">{i + 1}</div>

                <div className="membro-info">
                  <span className="nome">{e}</span>
                  <span className="cargo">Entrega concluída</span>
                </div>

                <span className="membro-status status-online">OK</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default EquipeDetalhes;
