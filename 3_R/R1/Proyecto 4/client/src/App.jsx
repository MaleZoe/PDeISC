/**
 * Archivo: App.jsx
 * Propósito: Define la lógica y funcionalidad asociada a App.
 */

﻿import React from 'react';
import ListaTareasPage from './pages/Proyecto4/ListaTareasPage';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import './App.css';

function App() {
  return <>
      <ListaTareasPage onVolver={() => {}} />
      <ThemeToggle />
    </>;
}

export default App;

