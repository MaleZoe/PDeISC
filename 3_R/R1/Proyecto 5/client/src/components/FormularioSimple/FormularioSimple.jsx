import React, { useState } from 'react';
import styles from './FormularioSimple.module.css';

const FormularioSimple = () => {
  // Estado para el valor controlado del input
  const [nombre, setNombre] = useState('');
  // Estado para saber si el formulario fue enviado con éxito
  const [nombreEnviado, setNombreEnviado] = useState(null);
  // Estado para manejar mensajes de validación
  const [error, setError] = useState('');

  const manejarCambio = (e) => {
    setNombre(e.target.value);
    // Si el usuario empieza a escribir, limpiamos el error para mejorar la UX
    if (error) setError('');
  };

  const manejarEnvio = (e) => {
    e.preventDefault(); // Previene la recarga completa de la página

    const nombreLimpio = nombre.trim();
    
    // Validación: si está vacío después de quitar espacios
    if (!nombreLimpio) {
      setError('Por favor, ingresa un nombre válido.');
      setNombreEnviado(null);
      return;
    }

    // Si es válido, guardamos el nombre enviado y limpiamos errores
    setError('');
    setNombreEnviado(nombreLimpio);
  };

  const manejarEdicion = () => {
    // Permite al usuario volver a intentar / cambiar el nombre
    setNombreEnviado(null);
    setNombre(''); // Limpiamos el input, o podríamos dejarlo si se prefiere editar. El prompt pide permitir intentar de nuevo.
  };

  return (
    <div className={`card ${styles.formularioContenedor} shadow-sm border-0 w-100`}>
      <div className="row g-0 h-100">
        
        {/* Columna Izquierda: Decorativa / Vista Previa */}
        <div className="col-12 col-md-5 d-flex flex-column justify-content-center align-items-center p-5" style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--accent-bg, #ec4899))', color: 'white' }}>
          {nombreEnviado ? (
            <div className="text-center" style={{ animation: 'fadeInScale 0.5s ease forwards' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="mb-4" viewBox="0 0 16 16">
                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                <path d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z"/>
              </svg>
              <h3 className="fw-bold text-white mb-2">¡Registro Exitoso!</h3>
              <p className="opacity-75 mb-0">El estado se ha actualizado correctamente.</p>
            </div>
          ) : (
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="mb-4 opacity-75" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
              </svg>
              <h3 className="fw-bold text-white mb-2">Identificación</h3>
              <p className="opacity-75 mb-0">
                {nombre.trim() ? `Hola, ${nombre.trim()} 👋` : 'Ingresa tu nombre para comenzar.'}
              </p>
            </div>
          )}
        </div>

        {/* Columna Derecha: Formulario Interactivo */}
        <div className="col-12 col-md-7 d-flex align-items-center">
          <div className="card-body p-4 p-md-5 w-100">
            {!nombreEnviado ? (
              <form onSubmit={manejarEnvio} noValidate className="d-flex flex-column h-100 justify-content-center">
                <h3 className="fw-bold mb-4" style={{ color: 'var(--text-color)' }}>
                  Completa tu perfil
                </h3>
                <div className="mb-4">
                  <label htmlFor="nombreInput" className="form-label fw-medium text-muted">
                    Tu Nombre Completo
                  </label>
                  <input 
                    type="text" 
                    id="nombreInput"
                    className={`form-control form-control-lg ${error ? 'is-invalid' : ''} ${styles.inputFormulario}`}
                    placeholder="Ej. Juan Pérez" 
                    value={nombre}
                    onChange={manejarCambio}
                    aria-describedby={error ? "nombreError" : undefined}
                    style={{ borderRadius: '12px', padding: '1rem' }}
                  />
                  {error && (
                    <div id="nombreError" className="invalid-feedback d-block fw-medium mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2 mb-1" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                      </svg>
                      {error}
                    </div>
                  )}
                </div>
                
                <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold rounded-pill mt-3 py-3" style={{ transition: 'transform 0.2s ease', ':hover': { transform: 'translateY(-2px)' } }}>
                  Confirmar Identidad
                </button>
              </form>
            ) : (
              <div className="d-flex flex-column h-100 justify-content-center align-items-center text-center">
                <h2 className="fw-bold mb-3" style={{ color: 'var(--text-color)' }}>¡Hola, {nombreEnviado}!</h2>
                <p className="text-muted mb-5 fs-5">
                  Tu información ya está validada en el sistema.
                </p>
                <button 
                  onClick={manejarEdicion} 
                  className="btn btn-outline-secondary rounded-pill px-5 py-3 fw-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2 mb-1" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                  </svg>
                  Ingresar otro usuario
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioSimple;
