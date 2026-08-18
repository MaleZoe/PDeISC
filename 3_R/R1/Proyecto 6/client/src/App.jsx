/**
 * Archivo: App.jsx
 * Propósito: Define la lógica y funcionalidad asociada a App.
 */

﻿import React from 'react';
import TicTacToePage from './pages/Proyecto6/TicTacToePage';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import './App.css';

function App() {
  return <>
      <TicTacToePage onVolver={() => {}} />
      <ThemeToggle />
    </>;
}

export default App;

