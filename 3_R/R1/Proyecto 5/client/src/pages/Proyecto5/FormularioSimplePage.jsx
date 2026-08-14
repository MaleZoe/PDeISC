import React from 'react';
import FormularioSimple from '../../components/FormularioSimple/FormularioSimple';

const FormularioSimplePage = ({ onVolver }) => {
  return (
    <div className="container-fluid px-4 px-xl-5 pt-4 pb-5 min-vh-100 d-flex flex-column" style={{ position: 'relative', zIndex: 1 }}>
      <div 
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1,
          background: 'radial-gradient(at 10% 20%, hsla(253,16%,7%,0.03) 0, transparent 40%), radial-gradient(at 90% 80%, hsla(225,39%,30%,0.03) 0, transparent 40%)'
        }}
        className="theme-mesh"
      ></div>

      <div className="row mb-4 mt-2 text-center">
        <div className="col">
          <div className="mb-2 d-inline-block px-3 py-1 rounded-pill" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', fontSize: '0.85rem', fontWeight: 600, border: '1px solid var(--border-color)' }}>
            Proyecto 5
          </div>
          <h2 className="display-6 fw-bold mb-2" style={{ color: 'var(--text-color)', letterSpacing: '-1px' }}>
            Formulario Simple
          </h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1.05rem' }}>
            Ejemplo de un input controlado con validación local y renderizado condicional.
          </p>
        </div>
      </div>

      <div className="row justify-content-center mb-5 flex-grow-1 align-items-start">
        <div className="col-12 col-xl-8">
          <FormularioSimple />
        </div>
      </div>
    </div>
  );
};

export default FormularioSimplePage;

