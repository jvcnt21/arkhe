
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../App.css';

function MainLayout() {
  const location = useLocation();
  const isGroupsPage = location.pathname === '/groups';

  return (
    <div className={`app-container ${isGroupsPage ? 'no-sidebar' : ''}`}>
      {!isGroupsPage && <Sidebar />}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
