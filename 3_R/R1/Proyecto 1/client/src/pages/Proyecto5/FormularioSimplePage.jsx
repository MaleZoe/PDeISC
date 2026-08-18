/**
 * Archivo: FormularioSimplePage.jsx
 * Propósito: Define la lógica y funcionalidad asociada a FormularioSimplePage.
 */

import React from 'react';
import FormularioSimple from '../../components/FormularioSimple/FormularioSimple';

const FormularioSimplePage = ({ onVolver }) => {
  return (
    <div className="container py-5 min-vh-100 d-flex flex-column">
      <div className="row mb-5 text-center flex-shrink-0">
        <div className="col">
          <h2 className="display-5 fw-bold mb-3" style={{ color: 'var(--text-color)' }}>
            Formulario Simple
          </h2>
          <p className="lead text-muted">
            Ejemplo de un input controlado con validación local y renderizado condicional.
          </p>
        </div>
      </div>

      <div className="row justify-content-center mb-5 flex-grow-1 align-items-start">
        <div className="col-12 col-md-8 col-lg-6">
          <FormularioSimple />
        </div>
      </div>

      <div className="row text-center mt-auto flex-shrink-0">
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

export default FormularioSimplePage;
