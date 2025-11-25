import React from "react";

export default function TaskModal({ task, usuarioAtual, onClose, onMove, onDelete }) {
  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{task.titulo}</h2>

        <p><strong>Descrição:</strong> {task.descricao}</p>
        <p><strong>Adicionada por:</strong> {task.author}</p>

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          {task.status === "todo" && (
            <>
              <button style={{ background: "#f1c40f" }} onClick={() => onMove(task.id, "process")}>
                Fazer
              </button>
              <button style={{ background: "#bdc3c7" }} onClick={onClose}>Voltar</button>
            </>
          )}

          {task.status === "process" && (
            <>
              <button style={{ background: "#2ecc71" }} onClick={() => onMove(task.id, "done")}>
                Concluir
              </button>
              <button style={{ background: "#bdc3c7" }} onClick={() => onMove(task.id, "todo")}>
                Voltar
              </button>
            </>
          )}

          {task.status === "done" && (
            <button style={{ background: "#bdc3c7" }} onClick={() => onMove(task.id, "process")}>
              Voltar
            </button>
          )}
        </div>

        {usuarioAtual === task.author && (
          <button
            style={{ marginTop: "20px", background: "#e74c3c", width: "100%" }}
            onClick={() => onDelete(task.id)}
          >
            Remover Tarefa
          </button>
        )}

        <button style={{ marginTop: "10px", background: "#7f8c8d", width: "100%" }} onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}
