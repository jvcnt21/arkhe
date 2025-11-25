import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const tccInfo = {
    projeto: "Sistema de Gestão de TCC",
    orientador: "Prof. Carlos Silva",
    feedbackGeral: "Bom progresso até agora, continue revisando a documentação.",
    feedbackPessoal: "Fábio, atenção à estrutura do capítulo 2."
  };

  const proximosPrazos = [
    { nome: "Wireframe inicial", dias: "2 dias" },
    { nome: "Capítulo 2", dias: "5 dias" }
  ];

  return (
    <div className="home-container">
      <h1>Olá, {currentUser?.displayName || "Aluno"} 👋</h1>

      {/* Card principal com informações do TCC */}
      <div className="tcc-info-card">
        <h2><i className="fa-solid fa-book"></i> Projeto: {tccInfo.projeto}</h2>
        <p><strong>Orientador:</strong> {tccInfo.orientador}</p>
        <p><strong>Feedback geral:</strong> {tccInfo.feedbackGeral}</p>
        <p><strong>Feedback pessoal:</strong> {tccInfo.feedbackPessoal}</p>
      </div>

      {/* Cards principais */}
      <div className="quick-cards">

        <div className="quick-card">
          <i className="fa-solid fa-list-check quick-icon"></i>
          <h3>Tarefas pendentes</h3>
          <p>3 tarefas a fazer</p>
          <button onClick={() => navigate("/tasks")}>Ver Tarefas</button>
        </div>

        <div className="quick-card">
          <i className="fa-solid fa-bell quick-icon"></i>
          <h3>Últimas notificações</h3>
          <p>2 não lidas</p>
          <button onClick={() => navigate("/notifications")}>Ver Notificações</button>
        </div>

        <div className="quick-card">
          <i className="fa-solid fa-clock rotate-icon quick-icon"></i>
          <h3>Atividades recentes</h3>
          <p>2 adicionadas</p>
          <button onClick={() => navigate("/activity")}>Ver Atividades</button>
        </div>

      </div>

      {/* Próximos prazos */}
      <div className="prazo-card">
        <h2><i className="fa-solid fa-hourglass-half"></i> Próximos prazos</h2>

        {proximosPrazos.map((p, i) => (
          <div className="prazo-item" key={i}>
            <strong>{p.nome}</strong>
            <span>{p.dias}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
