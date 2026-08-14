import React from 'react';
import PropTypes from 'prop-types';
import styles from './ListaTareas.module.css';

const Tarea = ({ tarea, onToggle, onEliminar }) => {
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
        <span 
          className={`${styles.tareaTexto} text-truncate`} 
          onClick={() => onToggle(tarea.id)}
          style={{ cursor: 'pointer', transition: 'color 0.2s ease, text-decoration 0.2s ease' }}
        >
          {tarea.texto}
        </span>
      </div>
      <button 
        className="btn btn-outline-danger btn-sm rounded-circle ms-2 flex-shrink-0 d-flex align-items-center justify-content-center"
        onClick={() => onEliminar(tarea.id)}
        aria-label="Eliminar tarea"
        style={{ width: '32px', height: '32px' }}
      >
        <i className="bi bi-trash"></i>
      </button>
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
};

export default Tarea;
