import React from 'react';
import ReactDOM from 'react-dom/client'; // Use ReactDOM.createRoot para React 18+
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Importe seu provedor

// Para React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Envolve toda a sua aplicação */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Para React 17 ou anterior:
/*
ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
*/
