/**
 * Archivo: App.jsx
 * Propósito: Define la lógica y funcionalidad asociada a App.
 */

﻿import React from 'react';
import TarjetaPresentacionPage from './pages/Proyecto2/TarjetaPresentacionPage';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import './App.css';

function App() {
  return <>
      <TarjetaPresentacionPage onVolver={() => {}} />
      <ThemeToggle />
    </>;
}

export default App;

