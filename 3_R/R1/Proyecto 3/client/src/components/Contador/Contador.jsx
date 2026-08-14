import React, { useState } from 'react';
import styles from './Contador.module.css';

const Contador = () => {
  const [valor, setValor] = useState(0);
  const [historial, setHistorial] = useState([]);

  const agregarHistorial = (accion, nuevoValor) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setHistorial(prev => [{ id: crypto.randomUUID(), accion, valor: nuevoValor, time }, ...prev].slice(0, 50));
  };

  const incrementar = () => {
    setValor(prev => {
      const v = prev + 1;
      agregarHistorial('Incremento', v);
      return v;
    });
  };

  const decrementar = () => {
    setValor(prev => {
      const v = prev - 1;
      agregarHistorial('Decremento', v);
      return v;
    });
  };

  const reiniciar = () => {
    setValor(0);
    agregarHistorial('Reinicio', 0);
  };

  return (
    <div className="row g-4">
      {/* Columna Contador Principal */}
      <div className="col-12 col-md-6">
        <div className={`card ${styles.contadorContenedor} shadow-sm border-0 h-100`}>
          <div className="card-body text-center p-4 p-md-5 d-flex flex-column">
            <h3 className="card-title mb-4 fw-bold" style={{ color: 'var(--text-color)' }}>Panel de Control</h3>
            
            <div className={`${styles.valorWrapper} d-flex justify-content-center align-items-center mx-auto mb-auto`}>
              <span className={`display-1 fw-bold ${styles.contadorValor}`}>
                {valor}
              </span>
            </div>

            <div className={`d-flex flex-column flex-xl-row justify-content-center gap-3 mt-5 ${styles.contadorBotones}`}>
              <button onClick={decrementar} className="btn btn-danger btn-lg rounded-pill px-4 flex-grow-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2 mb-1" viewBox="0 0 16 16"><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/></svg>
                Restar
              </button>
              <button onClick={reiniciar} className="btn btn-outline-secondary btn-lg rounded-pill px-4 flex-grow-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2 mb-1" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>
                Cero
              </button>
              <button onClick={incrementar} className="btn btn-success btn-lg rounded-pill px-4 flex-grow-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2 mb-1" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
                Sumar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Historial */}
      <div className="col-12 col-md-6">
        <div className={`card ${styles.contadorContenedor} shadow-sm border-0 h-100`}>
          <div className="card-body p-4 p-md-5 d-flex flex-column">
            <h3 className="card-title mb-4 fw-bold text-center" style={{ color: 'var(--text-color)' }}>Historial de Cambios</h3>
            
            {historial.length === 0 ? (
              <div className="text-center text-muted my-auto">
                <p className="lead fs-6 mb-0">Toca un botón para comenzar a registrar eventos.</p>
              </div>
            ) : (
              <div className={styles.historialContainer}>
                <ul className="list-group list-group-flush rounded-3">
                  {historial.map((item) => (
                    <li key={item.id} className={`list-group-item d-flex justify-content-between align-items-center p-3 ${styles.historialItem}`}>
                      <div>
                        <span className="badge bg-secondary me-2">{item.time}</span>
                        <span style={{ color: 'var(--text-color)' }}>{item.accion}</span>
                      </div>
                      <span className="badge rounded-pill" style={{ backgroundColor: 'var(--primary-color)' }}>
                        Total: {item.valor}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contador;
