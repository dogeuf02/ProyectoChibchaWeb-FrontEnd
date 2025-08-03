import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import "./i18n";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AlertProvider>         {/* 👈 Aquí lo ponemos arriba */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </AlertProvider>
    </BrowserRouter>
  </StrictMode>
);
