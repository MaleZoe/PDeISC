/**
 * App.jsx
 * Componente principal de enrutamiento. Define las rutas de la aplicación.
 */

import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { InicioPage } from './pages/InicioPage';
import { DetalleTareaPage } from './pages/DetalleTareaPage';
import { CrearTareaPage } from './pages/CrearTareaPage';
import { EditarTareaPage } from './pages/EditarTareaPage';
import { NoEncontradoPage } from './pages/NoEncontradoPage';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-body">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<InicioPage />} />
          <Route path="/tarea/:id" element={<DetalleTareaPage />} />
          <Route path="/editar/:id" element={<EditarTareaPage />} />
          <Route path="/crear" element={<CrearTareaPage />} />
          <Route path="*" element={<NoEncontradoPage />} />
        </Routes>
      </main>
      <footer className="py-4 text-center text-body-secondary mt-auto border-top">
        <small>© {new Date().getFullYear()} Lista de Tareas SPA - React Router</small>
      </footer>
    </div>
  );
}

export default App;
