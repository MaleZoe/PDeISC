/**
 * Archivo: ListaTareas.jsx
 * Propósito: Define la lógica y funcionalidad asociada a ListaTareas.
 */

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

  const pendientes = tareas.filter(t => !t.completada);
  const completadas = tareas.filter(t => t.completada);

  return (
    <div className="w-100">
      {/* Formulario de ingreso (Box superior independiente) */}
      <div className={`card ${styles.listaTareasContenedor} mb-4 border-0`}>
        <div className="card-body p-4">
          <h3 className="card-title text-center mb-3" style={{ color: 'var(--text-color)' }}>
            Nueva Tarea
          </h3>
          <form onSubmit={manejarEnvio}>
            <div className="d-flex flex-column flex-md-row gap-3">
              <input 
                type="text" 
                className={`form-control form-control-lg ${errorTexto ? 'is-invalid' : ''} ${styles.inputTarea}`}
                placeholder="¿Qué necesitas hacer?" 
                value={nuevoTexto}
                onChange={(e) => {
                  setNuevoTexto(e.target.value);
                  if (errorTexto) setErrorTexto(''); // Limpia el error al escribir
                }}
                aria-label="Nueva tarea"
                style={{ borderRadius: '12px' }}
              />
              <button className="btn btn-primary btn-lg px-4 fw-bold flex-shrink-0" type="submit" style={{ borderRadius: '12px', whiteSpace: 'nowrap' }}>
                Agregar
              </button>
            </div>
            {errorTexto && (
              <div className="invalid-feedback d-block mt-2 fw-medium text-center text-md-start">
                {errorTexto}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Grid de listas (Pendientes y Completadas) */}
      <div className="row g-4">
        {/* Columna Pendientes */}
        <div className="col-12 col-md-6">
          <div className={`card ${styles.listaTareasContenedor} h-100 border-0`}>
            <div className="card-body p-4 d-flex flex-column">
              <h4 className="card-title mb-3 d-flex justify-content-between align-items-center" style={{ color: 'var(--text-color)' }}>
                <span>Pendientes</span>
                <span className="badge bg-primary rounded-pill fs-6">{pendientes.length}</span>
              </h4>
              <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0 1rem' }} />
              {pendientes.length === 0 ? (
                <div className="text-center py-5 my-auto text-muted">
                  <p className="lead mb-0 fs-6">¡No hay tareas pendientes!</p>
                </div>
              ) : (
                <ul className="list-group list-group-flush rounded-3 flex-grow-1">
                  {pendientes.map(tarea => (
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
        </div>

        {/* Columna Completadas */}
        <div className="col-12 col-md-6">
          <div className={`card ${styles.listaTareasContenedor} h-100 border-0`}>
            <div className="card-body p-4 d-flex flex-column">
              <h4 className="card-title mb-3 d-flex justify-content-between align-items-center" style={{ color: 'var(--text-color)' }}>
                <span>Completadas</span>
                <span className="badge bg-success rounded-pill fs-6">{completadas.length}</span>
              </h4>
              <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0 1rem' }} />
              {completadas.length === 0 ? (
                <div className="text-center py-5 my-auto text-muted">
                  <p className="lead mb-0 fs-6">Aún no has completado ninguna tarea. ✍️</p>
                </div>
              ) : (
                <ul className="list-group list-group-flush rounded-3 flex-grow-1">
                  {completadas.map(tarea => (
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
        </div>
      </div>
    </div>
  );
};

export default ListaTareas;
