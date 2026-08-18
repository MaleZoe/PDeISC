/**
 * Archivo: TarjetaPresentacionPage.jsx
 * Propósito: Define la lógica y funcionalidad asociada a TarjetaPresentacionPage.
 */

import React from 'react';
import TarjetaPresentacion from '../../components/TarjetaPresentacion/TarjetaPresentacion';

const TarjetaPresentacionPage = ({ onVolver }) => {
  // Datos de ejemplo para mapear sobre un array, demostrando reusabilidad con props
  const profesionales = [
    {
      id: 1,
      nombre: 'Ana',
      apellido: 'García',
      profesion: 'Desarrolladora Frontend',
      imagen: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
    },
    {
      id: 2,
      nombre: 'Carlos',
      apellido: 'López',
      profesion: 'Diseñador UX/UI',
      imagen: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
    },
    {
      id: 3,
      nombre: 'María',
      apellido: 'Fernández',
      profesion: 'Ingeniera de Datos',
      imagen: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    {
      id: 4, // Prueba de fallback para props faltantes
      nombre: 'Usuario',
      apellido: 'Misterioso'
      // Faltan profesion e imagen para demostrar el fallback
    }
  ];

  return (
    <div className="container-fluid px-4 px-xl-5 py-5 min-vh-100">
      <div className="row mb-5 text-center">
        <div className="col">
          <h2 className="display-5 fw-bold mb-3" style={{ color: 'var(--text-color)' }}>
            Equipo de Trabajo
          </h2>
          <p className="lead text-muted">
            Ejemplo de componentes presentacionales reutilizables mediante Props.
          </p>
        </div>
      </div>

      {/* Grid responsivo: 1 columna en móvil, 2 en tablet, 4 en desktop, 5 en ultra-wide */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 row-cols-xl-5 g-4 justify-content-center">
        {profesionales.map((pro) => (
          <div className="col" key={pro.id}>
            <TarjetaPresentacion 
              nombre={pro.nombre}
              apellido={pro.apellido}
              profesion={pro.profesion}
              imagen={pro.imagen}
            />
          </div>
        ))}
      </div>

      <div className="row mt-5 text-center">
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

export default TarjetaPresentacionPage;
