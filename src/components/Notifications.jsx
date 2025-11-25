import React, { useState } from "react";
import "../styles/notifications.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const navigate = useNavigate();

  const [prazoModal, setPrazoModal] = useState({ open: false, data: null });

  function irParaTasks() {
    navigate("/tasks");
  }

  const notificacoes = [
    {
      tipo: "Nova tarefa atribuída",
      descricao: "Diagrama de caso de uso",
      tempo: "Há 5 minutos",
      cor: "blue",
      icon: "fa-solid fa-bell",
      taskId: 101
    },
    {
      tipo: "Tarefa concluída",
      descricao: "Estudo de cenário",
      tempo: "Há 1 hora",
      cor: "green",
      icon: "fa-solid fa-check",
      taskId: 102
    },
    {
      tipo: "Prazo próximo",
      descricao: "Wireframe em 2 dias",
      tempo: "Há 3 horas",
      cor: "yellow",
      icon: "fa-solid fa-clock",
      taskId: 103,
      tarefa: "Wireframe - Página Inicial",
      remaining: "2 dias e 4 horas"
    },
  ];

  const equipe = [
    {
      nome: "Lucas Pereira",
      cargo: "Líder do Projeto",
      acesso: "Há 3 dias",
      atividades: ["Documento de requisitos", "Revisão geral"],
    },
    {
      nome: "Mariana Silva",
      cargo: "UX Designer",
      acesso: "Há 5 horas",
      atividades: ["Protótipo inicial"],
    },
    {
      nome: "João Carvalho",
      cargo: "Desenvolvedor Front-end",
      acesso: "Há 1 hora",
      atividades: ["Correção de bugs", "Refatoração"],
    },
    {
      nome: "Ana Souza",
      cargo: "Desenvolvedora Back-end",
      acesso: "Há 10 horas",
      atividades: ["Atualização de API"],
    },
  ];

  function abrirPerfil(membro) {
    navigate("/equipe/" + encodeURIComponent(membro.nome), { state: membro });
  }

  function abrirEquipeProjetos() {
    navigate("/equipe-projetos");
  }

  function handleNotifClick(n) {
    if (n.tipo === "Nova tarefa atribuída") {
      navigate("/activity", { state: { fromNotification: true, taskId: n.taskId } });
      return;
    }

    if (n.tipo === "Tarefa concluída") {
      navigate("/activity?tab=entregue");
      return;
    }
    

    if (n.tipo === "Prazo próximo") {
      setPrazoModal({ open: true, data: n });
      return;
    }
  }

  function fazerAgora(task) {
    setPrazoModal({ open: false, data: null });
    navigate("/activity", { state: { openTaskId: task.taskId } });
  }

  function fecharModal() {
    setPrazoModal({ open: false, data: null });
  }

  return (
    <div className="dashboard-container">
      <div className="top-header">
        <h2>Notificações</h2>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card" onClick={irParaTasks} style={{ cursor: "pointer" }}>
          <i className="icon fa-solid fa-list-check azul"></i>
          <p>Tarefas a fazer</p>
          <h3>3</h3>
        </div>

        <div className="stat-card" onClick={abrirEquipeProjetos} style={{ cursor: "pointer" }}>
          <i className="icon fa-solid fa-users roxo"></i>
          <p>Membros na equipe</p>
          <h3>{equipe.length}</h3>
        </div>
      </div>

      <div className="main-content">
        {/* NOTIFICAÇÕES */}
        <div className="notificacoes">
          <h3 className="section-title azul">
            <i className="fa-solid fa-bell"></i> Notificações Recentes
          </h3>

          <div className="notif-scroll">
            {notificacoes.map((n, i) => {
              const clickable =
                n.tipo === "Nova tarefa atribuída" ||
                n.tipo === "Tarefa concluída" ||
                n.tipo === "Prazo próximo";

              return (
                <div
                  key={i}
                  className={`notif-card ${n.cor}`}
                  onClick={() => clickable && handleNotifClick(n)}
                  style={{ cursor: clickable ? "pointer" : "default" }}
                >
                  <i className={n.icon} style={{ marginTop: 4 }}></i>
                  <div>
                    <strong>{n.tipo}</strong>
                    <p>{n.descricao}</p>
                    <span>{n.tempo}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* EQUIPE */}
        <div className="equipe">
          <h3 className="section-title roxo">
            <i className="fa-solid fa-user-group"></i> Equipe
          </h3>

          {equipe.map((m, i) => (
            <div
              key={i}
              className="membro"
              onClick={() => abrirPerfil(m)}
              style={{ cursor: "pointer" }}
            >
              <div className="membro-foto-inicial">{m.nome.charAt(0)}</div>

              <div>
                <p><strong>{m.nome}</strong></p>
                <span>{m.cargo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="atividade" style={{ cursor: "default" }}>
        <h3 className="section-title amarelo">
          <i className="fa-solid fa-clock"></i> Atividade Recente
        </h3>
        <p>Usuário 2 adicionou um arquivo ao quadro</p>
        <span>Há 10 minutos</span>
      </div>

      {/* MODAL PRAZO PRÓXIMO */}
      {prazoModal.open && prazoModal.data && (
      <div className="modal-fundo" onClick={fecharModal}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          
          <h3>Atenção — prazo próximo</h3>

          <p><strong>Atividade:</strong> {prazoModal.data.tarefa}</p>
          <p><strong>Falta:</strong> {prazoModal.data.remaining}</p>

          <div className="modal-btns">
            <button
              className="modal-btn fazer"
              onClick={() => fazerAgora(prazoModal.data)}
            >
              Fazer tarefa
            </button>

            <button
              className="modal-btn tarde"
              onClick={fecharModal}
            >
              Fazer mais tarde
            </button>
          </div>

        </div>
      </div>
    )}

    </div>
  );
}

export default Notifications;
