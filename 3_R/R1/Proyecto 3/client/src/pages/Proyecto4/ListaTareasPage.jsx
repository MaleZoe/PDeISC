/**
 * Archivo: ListaTareasPage.jsx
 * Propósito: Define la lógica y funcionalidad asociada a ListaTareasPage.
 */

import React from 'react';
import ListaTareas from '../../components/ListaTareas/ListaTareas';

const ListaTareasPage = ({ onVolver }) => {
  return (
    <div className="container py-5 min-vh-100">
      <div className="row mb-5 text-center">
        <div className="col">
          <h2 className="display-5 fw-bold mb-3" style={{ color: 'var(--text-color)' }}>
            Lista de Tareas
          </h2>
          <p className="lead text-muted">
            Ejemplo de manejo de listas utilizando arreglos en el estado de React.
          </p>
        </div>
      </div>

      <div className="row justify-content-center mb-5">
        <div className="col-12 col-md-10 col-lg-8">
          <ListaTareas />
        </div>
      </div>

      <div className="row text-center">
        <div className="col">
          <button 
            className="btn rounded-pill px-4" 
            style={{ 
              borderColor: 'var(--primary-color)', 
              color: 'var(--primary-color)', 
              fontWeight: '600',
              borderWidth: '2px'
            }}
            onClick={onVolver}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListaTareasPage;
