import React from 'react';
import Contador from '../../components/Contador/Contador';

const ContadorPage = ({ onVolver }) => {
  return (
    <div className="container py-5 min-vh-100">
      <div className="row mb-5 text-center">
        <div className="col">
          <h2 className="display-5 fw-bold mb-3" style={{ color: 'var(--text-color)' }}>
            Manejo de Estado
          </h2>
          <p className="lead text-muted">
            Ejemplo de un componente con estado local utilizando <code>useState</code>.
          </p>
        </div>
      </div>

      <div className="row justify-content-center mb-5">
        <div className="col-12 col-md-8 col-lg-6">
          <Contador />
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

export default ContadorPage;
