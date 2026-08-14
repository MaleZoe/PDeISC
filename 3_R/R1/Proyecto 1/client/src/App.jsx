import React from 'react';
import HolaMundo from './pages/Proyecto1/HolaMundo';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import './App.css';

function App() {
  return <>
      <HolaMundo onVolver={() => {}} />
      <ThemeToggle />
    </>;
}

export default App;

