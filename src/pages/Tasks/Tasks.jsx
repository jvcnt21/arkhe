import React, { useState } from "react";
import "./tasks.css";
import Card from "../../components/ui/Card";
import Tag from "../../components/ui/Tag";

export default function Tasks() {
  const [tasks] = useState([
    {
      id: 1,
      title: "Enviar relatório mensal",
      desc: "Submeter o relatório referente ao mês de novembro.",
      date: "25/11/2025",
      status: "pending",
    },
    {
      id: 2,
      title: "Feedback da atividade",
      desc: "Responder ao feedback recebido da atividade enviada.",
      date: "18/11/2025",
      status: "in-progress",
    },
    {
      id: 3,
      title: "Corrigir documentação",
      desc: "Revisar e ajustar formatação da documentação.",
      date: "10/11/2025",
      status: "completed",
    },
  ]);

  const getStatusTag = (status) => {
    switch (status) {
      case "pending":
        return <Tag type="warn">Pendente</Tag>;
      case "in-progress":
        return <Tag type="info">Em andamento</Tag>;
      case "completed":
        return <Tag type="success">Concluída</Tag>;
      default:
        return null;
    }
  };

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <h2 className="tasks-title">Tarefas</h2>
        <p className="tasks-sub">Gerencie suas tarefas e acompanhe o progresso</p>
      </header>

      <div className="tasks-list">
        {tasks.map((task) => (
          <Card key={task.id} className="task-card">
            <div className="task-left">
              <h3 className="task-title">{task.title}</h3>
              <p className="task-desc">{task.desc}</p>
              <span className="task-date">Prazo: {task.date}</span>
            </div>
            <div className="task-right">
              {getStatusTag(task.status)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
