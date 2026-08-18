/**
 * Archivo: App.jsx
 * Propósito: Define la lógica y funcionalidad asociada a App.
 */

﻿import React from 'react';
import ContadorPage from './pages/Proyecto3/ContadorPage';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import './App.css';

function App() {
  return <>
      <ContadorPage onVolver={() => {}} />
      <ThemeToggle />
    </>;
}

export default App;

