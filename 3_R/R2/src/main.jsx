/**
 * main.jsx
 * Punto de entrada de la aplicación React. Inicializa el Contexto y el Router.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { TareasProvider } from './context/TareasContext';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TareasProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TareasProvider>
  </React.StrictMode>,
);
