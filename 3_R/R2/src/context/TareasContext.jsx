/**
 * TareasContext.jsx
 * Contexto global para manejar el estado de las tareas y el tema (claro/oscuro).
 */

import { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { tareasIniciales } from '../data/tareasIniciales';

export const TareasContext = createContext();

export const TareasProvider = ({ children }) => {
  const [tareas, setTareas] = useState(tareasIniciales);
  
  // Tema oscuro/claro
  const [tema, setTema] = useState(() => {
    return localStorage.getItem('tema') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', tema);
    localStorage.setItem('tema', tema);
  }, [tema]);

  const toggleTema = () => {
    setTema((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const agregarTarea = (nuevaTarea) => {
    const tarea = {
      id: uuidv4(),
      titulo: nuevaTarea.titulo.trim(),
      descripcion: nuevaTarea.descripcion.trim(),
      fechaCreacion: new Date().toISOString(),
      completada: nuevaTarea.completada
    };
    setTareas([tarea, ...tareas]);
    return tarea.id;
  };

  const cambiarEstadoTarea = (id, nuevoEstado) => {
    setTareas(tareas.map(tarea => 
      tarea.id === id ? { ...tarea, completada: nuevoEstado } : tarea
    ));
  };

  const editarTarea = (id, tareaActualizada) => {
    setTareas(tareas.map(tarea => 
      tarea.id === id ? { 
        ...tarea, 
        titulo: tareaActualizada.titulo.trim(),
        descripcion: tareaActualizada.descripcion.trim(),
        completada: tareaActualizada.completada
      } : tarea
    ));
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter(tarea => tarea.id !== id));
  };

  return (
    <TareasContext.Provider value={{ tareas, agregarTarea, editarTarea, eliminarTarea, cambiarEstadoTarea, tema, toggleTema }}>
      {children}
    </TareasContext.Provider>
  );
};
