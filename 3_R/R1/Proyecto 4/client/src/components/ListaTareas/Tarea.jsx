/**
 * Archivo: Tarea.jsx
 * Propósito: Define la lógica y funcionalidad asociada a Tarea.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ListaTareas.module.css';

const Tarea = ({ tarea, onToggle, onEliminar, onEditar }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTexto, setEditTexto] = useState(tarea.texto);

  const handleSave = () => {
    if (editTexto.trim()) {
      onEditar(tarea.id, editTexto.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTexto(tarea.texto);
    }
  };

  return (
    <li className={`list-group-item d-flex justify-content-between align-items-center p-3 ${styles.tareaItem} ${tarea.completada ? styles.tareaCompletada : ''}`}>
      <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ overflow: 'hidden' }}>
        <input 
          className="form-check-input mt-0" 
          type="checkbox" 
          checked={tarea.completada} 
          onChange={() => onToggle(tarea.id)}
          aria-label={`Marcar tarea "${tarea.texto}" como ${tarea.completada ? 'pendiente' : 'completada'}`}
          style={{ width: '1.5rem', height: '1.5rem', cursor: 'pointer' }}
        />
        {isEditing ? (
          <input
            type="text"
            className="form-control"
            value={editTexto}
            onChange={(e) => setEditTexto(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <span 
            className={`${styles.tareaTexto} text-truncate flex-grow-1`} 
            onClick={() => onToggle(tarea.id)}
            style={{ cursor: 'pointer', transition: 'color 0.2s ease, text-decoration 0.2s ease' }}
          >
            {tarea.texto}
          </span>
        )}
      </div>
      
      <div className="d-flex align-items-center flex-shrink-0 ms-2">
        {!isEditing && (
          <button 
            className="btn btn-outline-primary btn-sm rounded-circle me-2 d-flex align-items-center justify-content-center"
            onClick={() => setIsEditing(true)}
            aria-label="Editar tarea"
            style={{ width: '32px', height: '32px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
            </svg>
          </button>
        )}
        <button 
          className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
          onClick={() => onEliminar(tarea.id)}
          aria-label="Eliminar tarea"
          style={{ width: '32px', height: '32px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </button>
      </div>
    </li>
  );
};

Tarea.propTypes = {
  tarea: PropTypes.shape({
    id: PropTypes.string.isRequired,
    texto: PropTypes.string.isRequired,
    completada: PropTypes.bool.isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
  onEditar: PropTypes.func.isRequired,
};

export default Tarea;
