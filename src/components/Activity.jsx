import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/activity.css";
import "@fortawesome/fontawesome-free/css/all.min.css";



function Activity() {
  const [atividades, setAtividades] = useState([
    {
      id: 1,
      titulo: "Revisar documentação do projeto",
      descricao: "Leia e revise a documentação inicial do TCC",
      orientacao: "Verifique se todas as seções estão coerentes",
      orientador: "Prof. João Silva",
      entregue: false,
      arquivos: [],
      horario: "Hoje - 10:32",
    },
    {
      id: 2,
      titulo: "Design da Interface",
      descricao: "Crie o layout inicial da interface do sistema",
      orientacao: "Siga o padrão de cores do guia do projeto",
      orientador: "Prof. Maria Souza",
      entregue: true,
      arquivos: [{ name: "wireframe.pdf" }],
      horario: "Ontem - 15:20",
    },
  ]);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get("tab");  
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState(tab === "entregue" ? "entregue" : "naoEntregue");

  const handleArquivo = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file || null);
  };

  const handleEntregar = (id) => {
    setAtividades(prev =>
      prev.map(a => a.id === id ? { ...a, entregue: true, arquivos: uploadedFile ? [...a.arquivos, uploadedFile] : a.arquivos } : a)
    );
    setTarefaSelecionada(null);
    setUploadedFile(null);
  };

  // Filtrar atividades por aba
  const atividadesFiltradas = atividades.filter(a =>
    abaAtiva === "naoEntregue" ? !a.entregue : a.entregue
  );

  return (
    <div className="activity-page">
      <div className="activity-header">
        <h2>Atividades do TCC</h2>
        <div className="activity-tabs">
          <span
            className={`tab ${abaAtiva === "naoEntregue" ? "ativa" : ""}`}
            onClick={() => setAbaAtiva("naoEntregue")}
          >
            Não Entregue
          </span>
          <span
            className={`tab ${abaAtiva === "entregue" ? "ativa" : ""}`}
            onClick={() => setAbaAtiva("entregue")}
          >
            Entregue
          </span>
        </div>
      </div>

      {atividadesFiltradas.map(a => (
        <div
          key={a.id}
          className={`activity-card ${a.entregue ? "entregue" : ""}`}
          onClick={() => setTarefaSelecionada(a)}
        >
          <h3>{a.titulo}</h3>
          <small>{a.orientador}</small>
          {a.entregue && <span className="tag done">Entregue</span>}
        </div>
      ))}

      {/* Modal */}
      {tarefaSelecionada && (
        <div className="modal-overlay" onClick={() => setTarefaSelecionada(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>{tarefaSelecionada.titulo}</h3>
            <small>{tarefaSelecionada.orientador}</small>

            <p><strong>Descrição:</strong> {tarefaSelecionada.descricao}</p>
            <p><strong>Orientação do professor:</strong> {tarefaSelecionada.orientacao}</p>

            <label>
              Anexar arquivo:
              <input type="file" onChange={handleArquivo} />
            </label>
            <p>{uploadedFile ? uploadedFile.name : "Nenhum arquivo escolhido"}</p>

            {!tarefaSelecionada.entregue && (
              <button
                className="entregar-btn"
                onClick={() => handleEntregar(tarefaSelecionada.id)}
              >
                Entregar
              </button>
            )}

            <button className="cancelar-btn" onClick={() => setTarefaSelecionada(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Activity;
