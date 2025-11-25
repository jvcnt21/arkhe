import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Notifications from "./components/Notifications";
import Tasks from "./components/Tasks";
import Activity from "./components/Activity";
import Sidebar from "./components/Sidebar";
import EquipeDetalhes from "./components/EquipeDetalhes";
import EquipeProjetos from "./components/EquipeProjetos";
import Perfil from "./components/Perfil"; // 🔥 IMPORTADO
import { useAuth } from "./context/AuthContext";

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Carregando aplicação...</div>;
  }

  return (
    <div style={{ display: "flex" }}>
      {currentUser && <Sidebar />}

      <div style={{ marginLeft: currentUser ? "70px" : "0px", flex: 1, padding: "20px" }}>
        <Routes>
          <Route path="/login" element={<Login />} />

          {currentUser ? (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/activity" element={<Activity />} />

              <Route path="/equipe/:nome" element={<EquipeDetalhes />} />
              <Route path="/equipe-projetos" element={<EquipeProjetos />} />

              {/* 🔥 NOVA ROTA ADICIONADA */}
              <Route path="/perfil" element={<Perfil />} />

              <Route path="*" element={<Navigate to="/home" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
