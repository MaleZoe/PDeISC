/**
 * Archivo: Contador.jsx
 * Propósito: Define la lógica y funcionalidad asociada a Contador.
 */

import React, { useState } from 'react';
import styles from './Contador.module.css';

const Contador = () => {
  // Inicializamos el estado en 0
  const [valor, setValor] = useState(0);

  // Usamos la forma funcional de actualización para evitar bugs 
  // si el usuario hace clics rápidos consecutivos
  const incrementar = () => setValor((prev) => prev + 1);
  const decrementar = () => setValor((prev) => prev - 1);
  const reiniciar = () => setValor(0);

  return (
    <div className={`card ${styles.contadorContenedor} shadow-sm border-0`}>
      <div className="card-body text-center p-4 p-md-5">
        <h3 className="card-title text-muted mb-4">Contador Interactivo</h3>
        
        {/* Contenedor del número con ancho fijo relativo para evitar saltos de layout con cifras grandes */}
        <div className={`${styles.valorWrapper} d-flex justify-content-center align-items-center mx-auto mb-5`}>
          <span className={`display-1 fw-bold ${styles.contadorValor}`}>
            {valor}
          </span>
        </div>

        {/* Botones organizados responsivamente */}
        <div className={`d-flex flex-column flex-sm-row justify-content-center gap-3 ${styles.contadorBotones}`}>
          <button 
            onClick={decrementar} 
            className="btn btn-danger btn-lg rounded-pill px-4"
          >
            <i className="bi bi-dash-circle me-2"></i>Decrementar
          </button>
          
          <button 
            onClick={reiniciar} 
            className="btn btn-outline-secondary btn-lg rounded-pill px-4"
          >
            <i className="bi bi-arrow-counterclockwise me-2"></i>Reiniciar
          </button>
          
          <button 
            onClick={incrementar} 
            className="btn btn-success btn-lg rounded-pill px-4"
          >
            <i className="bi bi-plus-circle me-2"></i>Incrementar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contador;
