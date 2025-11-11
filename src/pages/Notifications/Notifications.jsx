import React from "react";
import "./notifications.css";
import Card from "../../components/ui/Card";
import Tag from "../../components/ui/Tag";

export default function Notifications() {
  return (
    <div className="notifications-page">
      <header className="notif-header">
        <h2 className="notif-title">Notificações</h2>
        <p className="notif-sub">Aqui estão as últimas atualizações importantes para você</p>
      </header>

      <div className="notif-list">
        <Card className="notif-card">
          <div className="notif-card-left">
            <h3 className="notif-card-title">Prazo de envio próximo</h3>
            <p className="notif-card-text">
              O prazo para envio das atividades mensais está se aproximando. Não se esqueça de enviar até <b>25/11/2025</b>.
            </p>
          </div>
          <Tag type="warn">Importante</Tag>
        </Card>

        <Card className="notif-card">
          <div className="notif-card-left">
            <h3 className="notif-card-title">Reunião agendada</h3>
            <p className="notif-card-text">
              Uma reunião foi agendada para o dia <b>18/11 às 14:00</b> com o orientador do projeto.
            </p>
          </div>
          <Tag type="info">Novo</Tag>
        </Card>

        <Card className="notif-card">
          <div className="notif-card-left">
            <h3 className="notif-card-title">Atividade corrigida</h3>
            <p className="notif-card-text">
              Sua atividade enviada no dia <b>08/11</b> foi corrigida e está disponível para revisão.
            </p>
          </div>
          <Tag type="success">Concluído</Tag>
        </Card>
      </div>
    </div>
  );
}
