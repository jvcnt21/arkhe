import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/layout-extra.css";

export default function Layout({ children, pageTitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`app-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="layout-main">
        <Header onMenuClick={() => setSidebarOpen(true)} pageTitle={pageTitle} />
        
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
}
