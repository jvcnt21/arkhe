import React from "react";
import "./activity.css";
import Card from "../../components/ui/Card";
import Tag from "../../components/ui/Tag";

export default function Activity() {
  const activityList = [
    {
      id: 1,
      title: "Relatório enviado",
      desc: "Você enviou o relatório referente ao mês de novembro.",
      date: "08/11/2025",
      status: "success",
    },
    {
      id: 2,
      title: "Reunião realizada",
      desc: "Reunião com o orientador concluída com sucesso.",
      date: "02/11/2025",
      status: "info",
    },
    {
      id: 3,
      title: "Atividade atrasada",
      desc: "Entrega da atividade mensal não realizada no prazo.",
      date: "28/10/2025",
      status: "danger",
    },
  ];

  const statusText = {
    success: "Concluída",
    info: "Informativo",
    danger: "Atrasada",
  };

  return (
    <div className="activity-page">
      <header className="activity-header">
        <h2 className="activity-title">Atividades</h2>
        <p className="activity-sub">Histórico de ações realizadas</p>
      </header>

      <div className="activity-timeline">
        {activityList.map((item, idx) => (
          <div key={item.id} className="timeline-row">
            <div className="timeline-dot" data-type={item.status}></div>
            <div className="timeline-line" data-last={idx === activityList.length - 1}></div>

            <Card className="activity-card">
              <div className="activity-card-top">
                <h3 className="activity-card-title">{item.title}</h3>
                <Tag type={item.status}>{statusText[item.status]}</Tag>
              </div>
              <p className="activity-card-desc">{item.desc}</p>
              <span className="activity-card-date">{item.date}</span>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
