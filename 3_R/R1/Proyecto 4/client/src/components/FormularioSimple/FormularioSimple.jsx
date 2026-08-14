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
    <div className={`card ${styles.formularioContenedor} shadow-sm border-0 mx-auto`}>
      <div className="card-body p-4 p-md-5">
        <h3 className="card-title text-center mb-4" style={{ color: 'var(--text-color)' }}>
          Formulario Simple
        </h3>

        {/* Renderizado Condicional: Muestra el form o el mensaje de bienvenida */}
        {!nombreEnviado ? (
          <form onSubmit={manejarEnvio} noValidate>
            <div className="mb-4 text-start">
              <label htmlFor="nombreInput" className="form-label fw-medium">
                Tu Nombre
              </label>
              <input 
                type="text" 
                id="nombreInput"
                className={`form-control form-control-lg ${error ? 'is-invalid' : ''} ${styles.inputFormulario}`}
                placeholder="Ej. Juan Pérez" 
                value={nombre}
                onChange={manejarCambio}
                aria-describedby={error ? "nombreError" : undefined}
              />
              {error && (
                <div id="nombreError" className="invalid-feedback d-block fw-medium mt-2">
                  {error}
                </div>
              )}
            </div>
            
            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold rounded-pill">
              Enviar
            </button>
          </form>
        ) : (
          <div className={`${styles.mensajeBienvenida} text-center p-4 rounded-4 mt-3`}>
            <div className="mb-3">
              <i className="bi bi-person-check-fill display-4 text-success"></i>
            </div>
            <h4 className="fw-bold mb-3">¡Bienvenido/a, {nombreEnviado}!</h4>
            <p className="text-muted mb-4">
              Tu nombre ha sido registrado exitosamente en el estado de React.
            </p>
            <button 
              onClick={manejarEdicion} 
              className="btn btn-outline-secondary rounded-pill px-4"
            >
              <i className="bi bi-arrow-counterclockwise me-2"></i>Enviar otro nombre
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioSimple;
