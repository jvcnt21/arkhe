import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../services/api';
import '../styles/Board.css';

const Board = () => {
  const { group } = useOutletContext();
  const [boardData, setBoardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBoard = async () => {
      if (!group || !group.id) return;
      try {
        setLoading(true);
        const response = await api.get(`/grupos/${group.id}/quadro`);
        const listas = response.data.listas.reduce((acc, lista) => {
          acc[lista.id] = lista;
          return acc;
        }, {});
        setBoardData({ ...response.data, listas });
        setError('');
      } catch (err) {
        console.error("Erro ao buscar o quadro:", err);
        setError('Falha ao carregar o quadro.');
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [group]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const listaOrigem = boardData.listas[source.droppableId];
    const listaDestino = boardData.listas[destination.droppableId];
    const tarefaMovida = listaOrigem.tarefas.find(t => t.id === draggableId);

    const novoEstado = { ...boardData };
    const novasTarefasOrigem = Array.from(listaOrigem.tarefas);
    novasTarefasOrigem.splice(source.index, 1);

    if (listaOrigem.id === listaDestino.id) {
      novasTarefasOrigem.splice(destination.index, 0, tarefaMovida);
      novoEstado.listas[listaOrigem.id].tarefas = novasTarefasOrigem;
    } else {
      const novasTarefasDestino = Array.from(listaDestino.tarefas);
      novasTarefasDestino.splice(destination.index, 0, tarefaMovida);
      novoEstado.listas[listaOrigem.id].tarefas = novasTarefasOrigem;
      novoEstado.listas[listaDestino.id].tarefas = novasTarefasDestino;
    }

    setBoardData(novoEstado);

    try {
      await api.post(`/grupos/${group.id}/tarefas/move`, {
        idTarefa: draggableId,
        listaOrigemId: source.droppableId,
        listaDestinoId: destination.droppableId,
        novaOrdem: destination.index + 1,
      });
    } catch (err) {
      console.error("Erro ao mover tarefa:", err);
      setError('Não foi possível mover a tarefa. Por favor, atualize a página.');
    }
  };

  if (loading) return <div className="board-loading">Carregando quadro...</div>;
  if (error) return <div className="board-error">{error}</div>;
  if (!boardData) return <div className="board-empty">Nenhum quadro encontrado.</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board-container">
        <div className="board-content">
          {boardData.ordemListas.map((listaId) => {
            const lista = boardData.listas[listaId];
            if (!lista) return null;

            return (
              <Droppable key={lista.id} droppableId={lista.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`board-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}>
                    <div className="list-header" style={{borderTopColor: lista.cor}}>
                      <h3>{lista.nome}</h3>
                    </div>
                    <div className="list-cards">
                      {lista.tarefas.map((tarefa, index) => (
                        <Draggable key={tarefa.id} draggableId={tarefa.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`card ${snapshot.isDragging ? 'dragging' : ''}`}>
                              <p>{tarefa.titulo}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
};

export default Board;
