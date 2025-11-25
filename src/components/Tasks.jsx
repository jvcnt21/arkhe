import React, { useState } from "react";
import "../styles/tasks.css";
import TaskModal from "./TaskModal";

export default function Tasks() {
  const usuarioAtual = "Usuário 1"; // Usuário logado

  const [tasks, setTasks] = useState({
    aFazer: [
      { id: 1, titulo: "Revisar documentação do projeto", prioridade: "Alta", descricao: "", author: "Usuário 1", status: "todo" },
      { id: 2, titulo: "Implementar autenticação", prioridade: "Crítica", descricao: "", author: "Usuário 1", status: "todo" },
      { id: 3, titulo: "Criar wireframes", prioridade: "Média", descricao: "", author: "Usuário 2", status: "todo" },
    ],
    emProgresso: [],
    concluido: [],
  });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [novaTarefa, setNovaTarefa] = useState({ titulo: "", prioridade: "Média", descricao: "" });

  function abrirModalTarefa(tarefa) {
    setTarefaSelecionada(tarefa);
    setMostrarModal(true);
  }

  function fecharModal() {
    setMostrarModal(false);
    setTarefaSelecionada(null);
    setNovaTarefa({ titulo: "", prioridade: "Média", descricao: "" });
  }

  function salvarTarefa(coluna) {
    if (!novaTarefa.titulo.trim()) return;

    const id = Date.now();
    setTasks(prev => ({
      ...prev,
      [coluna]: [
        ...prev[coluna],
        { ...novaTarefa, id, author: usuarioAtual, status: coluna === "aFazer" ? "todo" : coluna === "emProgresso" ? "process" : "done" }
      ]
    }));

    fecharModal();
  }

  function removerTarefa(id) {
    setTasks(prev => {
      const novo = { ...prev };
      ["aFazer", "emProgresso", "concluido"].forEach(col => {
        novo[col] = novo[col].filter(t => t.id !== id);
      });
      return novo;
    });
    fecharModal();
  }

  function onMove(id, novoStatus) {
    setTasks(prevTasks => {
      const updated = { ...prevTasks };
      const allColumns = ["aFazer", "emProgresso", "concluido"];
      let tarefaMovida = null;

      allColumns.forEach(col => {
        updated[col] = updated[col].filter(t => {
          if (t.id === id) {
            tarefaMovida = t;
            return false;
          }
          return true;
        });
      });

      if (!tarefaMovida) return prevTasks;

      tarefaMovida.status = novoStatus;

      if (novoStatus === "todo") updated.aFazer.push(tarefaMovida);
      if (novoStatus === "process") updated.emProgresso.push(tarefaMovida);
      if (novoStatus === "done") updated.concluido.push(tarefaMovida);

      return updated;
    });

    fecharModal();
  }

  return (
    <div className="tasks-wrapper">
      <h2 className="titulo-geral">Quadro de Tarefas</h2>

      <div className="task-board">
        {/* A Fazer */}
        <div className="task-column">
          <div className="col-header"><span className="dot red"></span> A Fazer</div>
          <div className="cards-area">
            {tasks.aFazer.map(t => (
              <div key={t.id} className="task-card" onClick={() => abrirModalTarefa(t)}>
                <p>{t.titulo}</p>
                <span className={`tag ${t.prioridade.toLowerCase()}`}>{t.prioridade}</span>
              </div>
            ))}
          </div>
          <button className="add-btn" onClick={() => setMostrarModal(true)}>+ Adicionar tarefa</button>
        </div>

        {/* Em Progresso */}
        <div className="task-column">
          <div className="col-header"><span className="dot yellow"></span> Em Progresso</div>
          <div className="cards-area">
            {tasks.emProgresso.map(t => (
              <div key={t.id} className="task-card" onClick={() => abrirModalTarefa(t)}>
                <p>{t.titulo}</p>
                <span className={`tag ${t.prioridade.toLowerCase()}`}>{t.prioridade}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Concluído */}
        <div className="task-column">
          <div className="col-header"><span className="dot green"></span> Concluído</div>
          <div className="cards-area">
            {tasks.concluido.map(t => (
              <div key={t.id} className="task-card" onClick={() => abrirModalTarefa(t)}>
                <p>{t.titulo}</p>
                <span className={`tag ${t.prioridade.toLowerCase()}`}>{t.prioridade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {mostrarModal && tarefaSelecionada && (
        <TaskModal
          task={tarefaSelecionada}
          usuarioAtual={usuarioAtual}
          onClose={fecharModal}
          onMove={onMove}
          onDelete={removerTarefa}
        />
      )}

      {/* Modal nova tarefa */}
      {mostrarModal && !tarefaSelecionada && (
        <div className="modal-fundo" onClick={fecharModal}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>Nova Tarefa</h3>
            <label>Título:</label>
            <input type="text" value={novaTarefa.titulo} onChange={e => setNovaTarefa({...novaTarefa, titulo: e.target.value})} />
            <label>Descrição:</label>
            <input type="text" value={novaTarefa.descricao} onChange={e => setNovaTarefa({...novaTarefa, descricao: e.target.value})} />
            <label>Prioridade:</label>
            <select value={novaTarefa.prioridade} onChange={e => setNovaTarefa({...novaTarefa, prioridade: e.target.value})}>
              <option>Mínima</option>
              <option>Baixa</option>
              <option>Média</option>
              <option>Alta</option>
              <option>Crítica</option>
            </select>
            <div className="modal-actions">
              <button className="cancelar" onClick={fecharModal}>Cancelar</button>
              <button className="salvar" onClick={() => salvarTarefa("aFazer")}>Adicionar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
