/**
 * Archivo: App.jsx
 * Propósito: Define la lógica y funcionalidad asociada a App.
 */

﻿import React from 'react';
import FormularioSimplePage from './pages/Proyecto5/FormularioSimplePage';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import './App.css';

function App() {
  return <>
      <FormularioSimplePage onVolver={() => {}} />
      <ThemeToggle />
    </>;
}

export default App;

