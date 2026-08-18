/**
 * Archivo: HolaMundo.jsx
 * Propósito: Define la lógica y funcionalidad asociada a HolaMundo.
 */

import React from 'react';
import styles from './HolaMundo.module.css';

const HolaMundo = ({ onVolver }) => {
  return (
    <div className={`d-flex align-items-center justify-content-center ${styles.pageWrapper}`}>
      <div className={`${styles.card} p-4 p-md-5 mx-3`}>
        <h1 className={`display-3 fw-bold mb-3 ${styles.title}`}>¡Hola, mundo!</h1>
        <p className={`lead mb-4 ${styles.subtitle}`}>Mi primer componente en React</p>
        
        <div className="mt-4">
          <button onClick={onVolver} className={`btn ${styles.button}`}>
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default HolaMundo;
