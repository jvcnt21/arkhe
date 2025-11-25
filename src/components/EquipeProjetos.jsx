import React from "react";
import "../styles/equipeProjetos.css";
import { useNavigate } from "react-router-dom";

function EquipeProjetos() {
  const navigate = useNavigate();

  function voltar() {
    navigate("/notifications");
  }

  const equipe = [
    {
      nome: "Lucas Pereira",
      cargo: "Líder do Projeto",
      status: "online",
      projeto: "Dashboard Principal",
      acesso: "Agora mesmo",
      atividades: ["Revisão do backlog", "Ajuste de prioridades"]
    },
    {
      nome: "Mariana Silva",
      cargo: "UX Designer",
      status: "offline",
      projeto: "Protótipo Mobile",
      acesso: "Há 5 horas",
      atividades: ["Wireframe da página inicial"]
    },
    {
      nome: "João Carvalho",
      cargo: "Front-end",
      status: "online",
      projeto: "Componente de Notificações",
      acesso: "Há 20 minutos",
      atividades: ["Refatoração do menu lateral"]
    },
    {
      nome: "Ana Souza",
      cargo: "Back-end",
      status: "ausente",
      projeto: "API de Usuários",
      acesso: "Há 1 hora",
      atividades: ["Criação de endpoint /users"]
    }
  ];

  return (
    <div className="equipeProjetos-wrapper">

      {/* 🔙 BOTÃO VOLTAR */}
      <button className="btn-voltar" onClick={voltar}>
        ← Voltar
      </button>

      <h2 className="page-title">Status da Equipe</h2>

      <div className="cards-container">
        {equipe.map((m, i) => (
          <div key={i} className="membro-card">
            
            <div className="avatar">{m.nome.charAt(0)}</div>

            <div className="info">
              <h3>{m.nome}</h3>
              <p className="cargo">{m.cargo}</p>

              <p>
                <strong>Projeto atual:</strong> {m.projeto}
              </p>

              <p>
                <strong>Último acesso:</strong> {m.acesso}
              </p>

              <p className="status">
                <span className={`status-dot ${m.status}`}></span>
                {m.status === "online" && "Online"}
                {m.status === "offline" && "Offline"}
                {m.status === "ausente" && "Ausente"}
              </p>

              <div className="atividades">
                <strong>Atividades recentes:</strong>
                <ul>
                  {m.atividades.map((a, index) => (
                    <li key={index}>{a}</li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default EquipeProjetos;
