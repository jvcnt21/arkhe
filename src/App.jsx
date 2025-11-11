import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Notifications from "./pages/Notifications/Notifications";
import Tasks from "./pages/Tasks/Tasks";
import Activity from "./pages/Activity/Activity";
import Profile from "./pages/Profile/Profile";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  return (
    <>
      {!currentUser ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <Layout pageTitle="">
          <Routes>
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/notifications" />} />
          </Routes>
        </Layout>
      )}
    </>
  );
}
