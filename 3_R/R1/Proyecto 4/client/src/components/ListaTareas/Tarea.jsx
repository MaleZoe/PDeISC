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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
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
