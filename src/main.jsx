import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from "react-router-dom"; // ✅ IMPORTANTE

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Envolve tudo */}
      <AuthProvider> {/* ✅ Continua envolvendo a aplicação */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
