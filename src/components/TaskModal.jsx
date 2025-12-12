import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function TaskModal({ task, usuarioAtual, groupId, onClose, onMove, onDelete }) {
  const { currentUser, userData } = useAuth();
  
  // Estados
  const [arquivos, setArquivos] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [novoArquivoNome, setNovoArquivoNome] = useState('');
  const [novoArquivoUrl, setNovoArquivoUrl] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [addingFile, setAddingFile] = useState(false);
  const [error, setError] = useState('');

  if (!task) return null;

  // Listener real-time para arquivos
  useEffect(() => {
    if (!task.id || !groupId) return;

    const arquivosRef = collection(db, 'grupos', groupId, 'tarefas', task.id, 'arquivos');
    const unsubscribe = onSnapshot(arquivosRef, (snapshot) => {
      const arquivosList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArquivos(arquivosList);
    });

    return () => unsubscribe();
  }, [task.id, groupId]);

  // Listener real-time para comentários
  useEffect(() => {
    if (!task.id || !groupId) return;

    const comentariosRef = collection(db, 'grupos', groupId, 'tarefas', task.id, 'comentarios');
    const q = query(comentariosRef, orderBy('dataPostagem', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comentariosList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComentarios(comentariosList);
    });

    return () => unsubscribe();
  }, [task.id, groupId]);

  // Adicionar link de arquivo
  const handleAddFile = async () => {
    if (!novoArquivoNome.trim() || !novoArquivoUrl.trim()) {
      setError('Nome e URL são obrigatórios');
      return;
    }

    setAddingFile(true);
    setError('');

    try {
      const arquivosRef = collection(db, 'grupos', groupId, 'tarefas', task.id, 'arquivos');
      await addDoc(arquivosRef, {
        nome: novoArquivoNome.trim(),
        url: novoArquivoUrl.trim(),
        adicionadoPor: currentUser.uid,
        adicionadoPorNome: userData?.nome || currentUser.email,
        dataAdicao: serverTimestamp()
      });

      setNovoArquivoNome('');
      setNovoArquivoUrl('');
    } catch (err) {
      console.error('Erro ao adicionar arquivo:', err);
      setError('Erro ao adicionar arquivo');
    } finally {
      setAddingFile(false);
    }
  };

  // Deletar arquivo
  const handleDeleteFile = async (arquivo) => {
    if (!window.confirm(`Deletar ${arquivo.nome}?`)) return;

    try {
      const arquivoRef = doc(db, 'grupos', groupId, 'tarefas', task.id, 'arquivos', arquivo.id);
      await deleteDoc(arquivoRef);
    } catch (err) {
      console.error('Erro ao deletar arquivo:', err);
      setError('Erro ao deletar arquivo');
    }
  };

  // Enviar comentário
  const handleSendComment = async () => {
    if (!novoComentario.trim()) return;

    setSendingComment(true);
    try {
      const comentariosRef = collection(db, 'grupos', groupId, 'tarefas', task.id, 'comentarios');
      await addDoc(comentariosRef, {
        texto: novoComentario.trim(),
        autorId: currentUser.uid,
        autorNome: userData?.nome || currentUser.email,
        dataPostagem: serverTimestamp()
      });

      setNovoComentario('');
    } catch (err) {
      console.error('Erro ao enviar comentário:', err);
      setError('Erro ao enviar comentário');
    } finally {
      setSendingComment(false);
    }
  };

  // Formatar data
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <h2>{task.titulo}</h2>

        <p><strong>Descrição:</strong> {task.descricao || <em>Sem descrição</em>}</p>
        <p><strong>Adicionada por:</strong> {task.author}</p>

        {error && <p style={{ color: '#dc3545', fontSize: '0.9rem', background: '#ffebee', padding: '8px', borderRadius: '4px' }}>{error}</p>}

        {/* Layout de 2 colunas */}
        <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: 0 }}>
          
          {/* COLUNA ESQUERDA - Arquivos e Ações */}
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', paddingRight: '10px' }}>
            
            {/* Seção de Arquivos */}
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '15px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', marginTop: 0 }}>📎 Arquivos (Links)</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  value={novoArquivoNome}
                  onChange={(e) => setNovoArquivoNome(e.target.value)}
                  placeholder="Nome do arquivo"
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '0.9rem'
                  }}
                />
                <input
                  type="url"
                  value={novoArquivoUrl}
                  onChange={(e) => setNovoArquivoUrl(e.target.value)}
                  placeholder="URL (Google Drive, Dropbox, etc)"
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  onClick={handleAddFile}
                  disabled={addingFile}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: addingFile ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: addingFile ? 'wait' : 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  {addingFile ? 'Adicionando...' : '+ Adicionar Link'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {arquivos.length === 0 ? (
                  <p style={{ color: '#999', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    Nenhum arquivo anexado
                  </p>
                ) : (
                  arquivos.map(arquivo => (
                    <div key={arquivo.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '6px',
                      border: '1px solid #e0e0e0'
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <a href={arquivo.url} target="_blank" rel="noopener noreferrer" style={{
                          color: '#007bff',
                          textDecoration: 'none',
                          fontWeight: '500',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          🔗 {arquivo.nome}
                        </a>
                        <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '3px' }}>
                          {arquivo.adicionadoPorNome}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteFile(arquivo)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.1rem',
                          padding: '5px',
                          flexShrink: 0
                        }}
                        title="Deletar arquivo"
                      >
                        🗑️
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '15px' }}>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {task.status === "a-fazer" && (
                  <>
                    <button style={{ background: "#f1c40f", padding: '8px 15px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => onMove(task.id, "fazendo")}>
                      Fazer
                    </button>
                  </>
                )}

                {task.status === "fazendo" && (
                  <>
                    <button style={{ background: "#2ecc71", padding: '8px 15px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: 'white' }} onClick={() => onMove(task.id, "concluido")}>
                      Concluir
                    </button>
                    <button style={{ background: "#bdc3c7", padding: '8px 15px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => onMove(task.id, "a-fazer")}>
                      Voltar
                    </button>
                  </>
                )}

                {task.status === "concluido" && (
                  <button style={{ background: "#bdc3c7", padding: '8px 15px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => onMove(task.id, "fazendo")}>
                    Voltar
                  </button>
                )}

                {usuarioAtual === task.author && (
                  <button
                    style={{ background: "#e74c3c", padding: '8px 15px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: 'white' }}
                    onClick={() => onDelete(task.id)}
                  >
                    Remover Tarefa
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA - Comentários */}
          <div style={{ flex: '1', borderLeft: '1px solid #e0e0e0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', marginTop: 0 }}>💬 Comentários</h3>
            
            <div style={{
              flex: 1,
              overflowY: 'auto',
              marginBottom: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              minHeight: 0
            }}>
              {comentarios.length === 0 ? (
                <p style={{ color: '#999', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  Nenhum comentário ainda
                </p>
              ) : (
                comentarios.map(comentario => (
                  <div key={comentario.id} style={{
                    backgroundColor: '#f0f8ff',
                    padding: '10px',
                    borderRadius: '8px',
                    borderLeft: '3px solid #007bff'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '5px',
                      gap: '10px'
                    }}>
                      <strong style={{ fontSize: '0.85rem', color: '#333' }}>
                        {comentario.autorNome}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#999', flexShrink: 0 }}>
                        {formatDate(comentario.dataPostagem)}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', wordBreak: 'break-word' }}>
                      {comentario.texto}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '10px', flexShrink: 0 }}>
              <textarea
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                placeholder="Escreva um comentário..."
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '0.9rem',
                  minHeight: '60px',
                  resize: 'vertical',
                  marginBottom: '8px'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleSendComment();
                  }
                }}
              />
              <button
                onClick={handleSendComment}
                disabled={sendingComment || !novoComentario.trim()}
                style={{
                  width: '100%',
                  padding: '8px 15px',
                  backgroundColor: sendingComment || !novoComentario.trim() ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: sendingComment || !novoComentario.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {sendingComment ? 'Enviando...' : 'Comentar'}
              </button>
            </div>
          </div>
        </div>

        <button style={{ marginTop: "15px", background: "#7f8c8d", width: "100%", padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', color: 'white', fontSize: '1rem' }} onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}