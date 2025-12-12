import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, doc, addDoc, serverTimestamp, getDocs, query, updateDoc, deleteDoc } from 'firebase/firestore';

import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import TaskModal from './TaskModal';
import '../styles/quadrodetarefas.css';

/* ---------------------- COMPONENTES ---------------------- */

function TaskCard({ task }) {
  if (!task) return null;
  return (
    <div className={`task-card ${task.status}-card`}>
      <h3>{task.nome}</h3>
      <p>{task.descricao}</p>
    </div>
  );
}

// Componente Droppable para as colunas
function DroppableColumn({ id, children, isOver, onDrop }) {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && onDrop) {
      onDrop(taskId, id);
    }
  };

  return (
    <div
      id={id}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isOver ? '#e8f4fd' : '#f0f0f0',
        borderRadius: '8px',
        padding: '1rem',
        minHeight: '400px',
        border: isOver ? '2px solid #007bff' : '2px solid transparent',
        transition: 'all 0.2s'
      }}
    >
      {children}
    </div>
  );
}

/* ---------------------- COMPONENTE PRINCIPAL ---------------------- */

function QuadroDeTarefas() {
  const { id: groupId } = useParams();
  const { currentUser, userData, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState({
    "a-fazer": [],
    "fazendo": [],
    "concluido": [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTask, setActiveTask] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Modal de criar tarefa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [modalError, setModalError] = useState('');

  // Modal de detalhes da tarefa
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  /* ---------------------- BUSCAR TAREFAS ---------------------- */

  const fetchTasks = useCallback(async () => {
    try {
      const tasksRef = collection(db, 'grupos', groupId, 'tarefas');
      const q = query(tasksRef);
      const snap = await getDocs(q);

      const data = { "a-fazer": [], "fazendo": [], "concluido": [] };

      snap.forEach(docSnap => {
        const task = { id: docSnap.id, ...docSnap.data() };
        if (data[task.status]) data[task.status].push(task);
      });

      setTasks(data);
      setError('');

    } catch (err) {
      setError('Erro ao carregar tarefas.');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId && currentUser && !authLoading) {
      fetchTasks();
    }
  }, [groupId, currentUser, authLoading, fetchTasks]);

  /* ---------------------- CRIAR TAREFA ---------------------- */

  const handleAddTask = async () => {
    if (!nome.trim()) {
      setModalError("O nome é obrigatório.");
      return;
    }

    if (!currentUser) {
      setModalError("Usuário não autenticado.");
      return;
    }

    try {
      await addDoc(collection(db, "grupos", groupId, "tarefas"), {
        nome,
        descricao,
        status: "a-fazer",
        dataCriacao: serverTimestamp(),
        usuarioPostou: currentUser.uid,
        usuarioNome: userData?.nome || currentUser.displayName || currentUser.email
      });

      setNome('');
      setDescricao('');
      setIsModalOpen(false);
      fetchTasks();

    } catch (err) {
      setModalError("Erro ao criar tarefa.");
      console.error("Erro ao criar tarefa:", err);
    }
  };

  /* ---------------------- MODAL DE DETALHES ---------------------- */

  const handleTaskClick = (task) => {
    if (!isDragging) {
      setSelectedTask(task);
      setIsTaskModalOpen(true);
    }
  };

  const handleMoveFromModal = async (taskId, newStatus) => {
    await handleDrop(taskId, newStatus);
    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta tarefa?')) return;
    
    try {
      await deleteDoc(doc(db, 'grupos', groupId, 'tarefas', taskId));
      fetchTasks();
      setIsTaskModalOpen(false);
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err);
      setError('Erro ao deletar tarefa.');
    }
  };

  /* ---------------------- DRAG AND DROP ---------------------- */

  const handleDragStart = (e, taskId) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
    
    const task = Object.values(tasks).flat().find(t => t.id === taskId);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDraggedOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = async (taskId, targetColumnId) => {
    // Encontrar coluna de origem
    let sourceColumn = null;
    for (const [column, columnTasks] of Object.entries(tasks)) {
      if (columnTasks.some(task => task.id === taskId)) {
        sourceColumn = column;
        break;
      }
    }

    if (!sourceColumn) return;

    // Se for a mesma coluna, não faz nada
    if (sourceColumn === targetColumnId) {
      setDraggedOverColumn(null);
      setDraggedTaskId(null);
      setActiveTask(null);
      setIsDragging(false);
      return;
    }

    const taskIndex = tasks[sourceColumn].findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;

    const taskToMove = tasks[sourceColumn][taskIndex];

    try {
      // Atualizar no Firebase
      await updateDoc(doc(db, 'grupos', groupId, 'tarefas', taskToMove.id), {
        status: targetColumnId
      });

      // Atualizar estado local
      setTasks(prev => {
        const newTasks = { ...prev };
        
        newTasks[sourceColumn] = newTasks[sourceColumn].filter(
          task => task.id !== taskToMove.id
        );
        
        newTasks[targetColumnId] = [...newTasks[targetColumnId], {
          ...taskToMove,
          status: targetColumnId
        }];
        
        return newTasks;
      });
      
    } catch (err) {
      console.error("Erro ao mover tarefa:", err);
      setError("Erro ao mover tarefa. Tente novamente.");
    } finally {
      setDraggedOverColumn(null);
      setDraggedTaskId(null);
      setActiveTask(null);
      setIsDragging(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDndKitDragStart = (event) => {
    const { active } = event;
    const taskId = active.id;
    setIsDragging(true);
    
    const task = Object.values(tasks).flat().find(t => t.id === taskId);
    if (task) {
      setActiveTask(task);
      setDraggedTaskId(taskId);
    }
  };

  const handleDndKitDragEnd = (event) => {
    setActiveTask(null);
    setDraggedTaskId(null);
    setIsDragging(false);
  };

  /* ---------------------- JSX ---------------------- */

  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Carregando...
      </div>
    );
  }

  const columns = [
    { id: "a-fazer", title: "A FAZER" },
    { id: "fazendo", title: "FAZENDO" },
    { id: "concluido", title: "CONCLUÍDO" }
  ];

  return (
    <div className="task-board-container">
      <header className="task-board-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem'
      }}>
        <h1 style={{ margin: 0, color: '#333' }}>Quadro de Tarefas</h1>

        {currentUser && (
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '0.8rem 1.5rem',
              backgroundColor: '#1a365d',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'all 0.3s',
              boxShadow: '0 2px 5px rgba(26, 54, 93, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2d4a8a';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(26, 54, 93, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#1a365d';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 5px rgba(26, 54, 93, 0.3)';
            }}
          >
            + Nova Tarefa
          </button>
        )}
      </header>

      {loading && <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando tarefas...</p>}
      {error && <p className="error-message" style={{ color: '#dc3545', textAlign: 'center' }}>{error}</p>}

      {!loading && !error && (
        <DndContext
          sensors={sensors}
          onDragStart={handleDndKitDragStart}
          onDragEnd={handleDndKitDragEnd}
        >
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            minHeight: '500px'
          }}>
            {columns.map(column => (
              <DroppableColumn
                key={column.id}
                id={column.id}
                isOver={draggedOverColumn === column.id}
                onDrop={(taskId) => handleDrop(taskId, column.id)}
              >
                <div className={`column-header ${column.id}-header`}>
                  <h2>{column.title}</h2>
                </div>
                
                <div 
                  onDragOver={(e) => handleDragOver(e, column.id)}
                  onDragLeave={handleDragLeave}
                  style={{ 
                    flex: 1,
                    minHeight: '300px',
                    padding: '0.5rem'
                  }}
                >
                  <SortableContext 
                    items={tasks[column.id].map(task => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div>
                      {tasks[column.id].map(task => (
                        <div
                          key={task.id}
                          style={{ position: 'relative', marginBottom: '1rem' }}
                        >
                          <div 
                            className={`task-card ${task.status}-card`}
                            onClick={() => handleTaskClick(task)}
                            style={{ cursor: 'pointer' }}
                          >
                            {/* Handle de arraste */}
                            <div
                              draggable
                              onDragStart={(e) => {
                                e.stopPropagation();
                                handleDragStart(e, task.id);
                              }}
                              onDragEnd={handleDragEnd}
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                cursor: 'grab',
                                fontSize: '1.5rem',
                                color: '#999',
                                padding: '5px',
                                lineHeight: 1,
                                userSelect: 'none'
                              }}
                              title="Arraste para mover"
                            >
                              ⋮⋮
                            </div>
                            
                            <h3 style={{ paddingRight: '40px' }}>{task.nome}</h3>
                            <p>{task.descricao}</p>
                            <small style={{ color: '#666', fontSize: '0.8rem' }}>
                              Clique para ver detalhes
                            </small>
                          </div>
                        </div>
                      ))}
                      
                      {tasks[column.id].length === 0 && (
                        <div 
                          style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#666',
                            fontStyle: 'italic',
                            border: '2px dashed #ccc',
                            borderRadius: '8px',
                            padding: '2rem',
                            textAlign: 'center',
                            minHeight: '100px'
                          }}
                        >
                          {draggedOverColumn === column.id ? (
                            <span style={{ color: '#007bff', fontWeight: 'bold' }}>
                              Solte aqui!
                            </span>
                          ) : (
                            'Arraste tarefas para cá'
                          )}
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </div>
              </DroppableColumn>
            ))}
          </div>

          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>
        </DndContext>
      )}

      {/* MODAL DE CRIAR TAREFA */}
      {isModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}>
            <h2 style={{ marginTop: 0, color: '#333' }}>Criar Tarefa</h2>
            
            <input
              type="text"
              value={nome}
              placeholder="Nome da tarefa"
              onChange={(e) => setNome(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                marginBottom: '1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />

            <textarea
              value={descricao}
              placeholder="Descrição da tarefa"
              onChange={(e) => setDescricao(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                marginBottom: '1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                minHeight: '100px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />

            {modalError && (
              <p style={{ color: '#dc3545', margin: '-0.5rem 0 1rem 0' }}>
                {modalError}
              </p>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '0.8rem 1.5rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddTask}
                style={{
                  padding: '0.8rem 1.5rem',
                  backgroundColor: '#1a365d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Criar Tarefa
              </button>
            </div>
          </div>
        </div>
      )}

{/* MODAL DE DETALHES DA TAREFA */}
{isTaskModalOpen && selectedTask && (
  <TaskModal
    task={{
      id: selectedTask.id,
      titulo: selectedTask.nome,
      descricao: selectedTask.descricao,
      status: selectedTask.status,
      author: selectedTask.usuarioNome || 'Desconhecido'
    }}
    groupId={groupId}  // ← ADICIONE ESTA LINHA
    usuarioAtual={userData?.nome}
    onClose={() => setIsTaskModalOpen(false)}
    onMove={handleMoveFromModal}
    onDelete={handleDeleteTask}
  />
)}
    </div>
  );
}

export default QuadroDeTarefas;