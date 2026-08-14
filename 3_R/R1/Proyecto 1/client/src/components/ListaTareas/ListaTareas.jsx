import React, { useState, useEffect } from 'react';
import Tarea from './Tarea';
import styles from './ListaTareas.module.css';

const ListaTareas = () => {
  // Inicializamos el estado con soporte opcional de localStorage si está disponible.
  const [tareas, setTareas] = useState(() => {
    const saved = localStorage.getItem('r1_tareas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [nuevoTexto, setNuevoTexto] = useState('');
  const [errorTexto, setErrorTexto] = useState('');

  // Efecto para persistir en localStorage de forma transparente (stretch goal)
  useEffect(() => {
    localStorage.setItem('r1_tareas', JSON.stringify(tareas));
  }, [tareas]);

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    // Validación de entrada vacía o sólo espacios en blanco
    if (!nuevoTexto.trim()) {
      setErrorTexto('Por favor, ingresa una tarea válida que no esté vacía.');
      return;
    }

    // Agregar la tarea inmutablemente
    const nuevaTarea = {
      id: crypto.randomUUID(), // Generar ID único estable
      texto: nuevoTexto.trim(),
      completada: false
    };

    setTareas(prev => [nuevaTarea, ...prev]); // Colocamos la más nueva arriba
    setNuevoTexto(''); // Limpiamos el input controlado
    setErrorTexto(''); // Limpiamos errores previos
  };

  const alternarCompletada = (id) => {
    // Actualización inmutable usando map
    setTareas(prev => prev.map(tarea => 
      tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
    ));
  };

  const eliminarTarea = (id) => {
    // Eliminación inmutable usando filter
    setTareas(prev => prev.filter(tarea => tarea.id !== id));
  };

  return (
    <div className={`card ${styles.listaTareasContenedor} shadow-sm border-0`}>
      <div className="card-body p-4 p-md-5">
        <h3 className="card-title text-center mb-4" style={{ color: 'var(--text-color)' }}>
          Mis Tareas
        </h3>

        {/* Formulario de ingreso */}
        <form onSubmit={manejarEnvio} className="mb-4">
          <div className="input-group input-group-lg">
            <input 
              type="text" 
              className={`form-control ${errorTexto ? 'is-invalid' : ''} ${styles.inputTarea}`}
              placeholder="¿Qué necesitas hacer?" 
              value={nuevoTexto}
              onChange={(e) => {
                setNuevoTexto(e.target.value);
                if (errorTexto) setErrorTexto(''); // Limpia el error al escribir
              }}
              aria-label="Nueva tarea"
            />
            <button className="btn btn-primary px-4 fw-bold" type="submit">
              Agregar
            </button>
          </div>
          {errorTexto && (
            <div className="invalid-feedback d-block mt-2 fw-medium">
              {errorTexto}
            </div>
          )}
        </form>

        {/* Lista de Tareas */}
        {tareas.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-clipboard-check display-3 mb-3 d-block opacity-50"></i>
            <p className="lead mb-0">No hay tareas todavía. ¡Agrega una para empezar!</p>
          </div>
        ) : (
          <ul className="list-group list-group-flush rounded-3">
            {tareas.map(tarea => (
              <Tarea 
                key={tarea.id} 
                tarea={tarea} 
                onToggle={alternarCompletada} 
                onEliminar={eliminarTarea} 
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ListaTareas;
