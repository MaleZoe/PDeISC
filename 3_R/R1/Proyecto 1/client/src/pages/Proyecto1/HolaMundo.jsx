/**
 * Archivo: HolaMundo.jsx
 * Propósito: Define la lógica y funcionalidad asociada a HolaMundo.
 */

import React, { useState } from 'react';
import styles from './HolaMundo.module.css';

const HolaMundo = () => {
  const [sizeIndex, setSizeIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  const sizes = [styles.sizeNormal, styles.sizeLarge, styles.sizeXLarge];
  const colors = [styles.colorDefault, styles.colorEmerald, styles.colorSunset];

  const handleSizeChange = () => setSizeIndex((prev) => (prev + 1) % sizes.length);
  const handleColorChange = () => setColorIndex((prev) => (prev + 1) % colors.length);

  return (
    <div className={`container-fluid px-0 ${styles.pageWrapper}`}>
      <div className={`row w-100 m-0 align-items-center justify-content-center ${styles.heroSection}`}>
        <div className="col-12 col-md-10 col-lg-8 col-xl-7 text-center">
          <div className={`${styles.glassCard} p-5`}>
            
            <div className={`${styles.badge} mb-4 d-inline-block px-3 py-1 rounded-pill`}>
              Proyecto 1
            </div>

            <h1 className={`fw-bold mb-4 ${styles.title} ${sizes[sizeIndex]} ${styles.highlight} ${colors[colorIndex]}`}>
              ¡Hola, mundo!
            </h1>
            
            <p className={`lead mb-5 ${styles.subtitle}`}>
              Mi primer componente en React. Explora el poder de los layouts fluidos y los gradientes modernos en esta nueva versión mejorada.
            </p>

            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button 
                className={`btn btn-lg ${styles.controlBtn}`}
                onClick={handleSizeChange}
              >
                <i className="bi bi-arrows-expand me-2"></i> Cambiar Tamaño
              </button>
              <button 
                className={`btn btn-lg ${styles.controlBtn}`}
                onClick={handleColorChange}
              >
                <i className="bi bi-palette me-2"></i> Cambiar Color
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HolaMundo;
