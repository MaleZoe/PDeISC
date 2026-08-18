/**
 * Archivo: TicTacToePage.jsx
 * Propósito: Define la lógica y funcionalidad asociada a TicTacToePage.
 */

import React, { useState, useEffect } from 'react';
import Game from '../../components/TicTacToe/Game';

const TicTacToePage = ({ onVolver }) => {
  const [partidasAnteriores, setPartidasAnteriores] = useState([]);
  const [errorBd, setErrorBd] = useState('');

  const cargarPartidas = async () => {
    try {
      // Intentamos cargar el leaderboard desde la BD (Express)
      const res = await fetch('http://localhost:3001/api/partidas');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setPartidasAnteriores(data);
    } catch (error) {
      setErrorBd('No se pudo conectar con la Base de Datos para el historial global.');
    }
  };

  useEffect(() => {
    cargarPartidas();
  }, []); // Carga inicial

  return (
    <div className="container py-5 min-vh-100 d-flex flex-column">
      <div className="row mb-5 text-center flex-shrink-0">
        <div className="col">
          <h2 className="display-5 fw-bold mb-3" style={{ color: 'var(--text-color)' }}>
            Ta-Te-Ti (Tic-Tac-Toe)
          </h2>
          <p className="lead text-muted">
            Proyecto Fullstack. Estado elevado, viaje en el tiempo y Base de Datos (SQLite).
          </p>
        </div>
      </div>

      <div className="row justify-content-center flex-grow-1 align-items-start gap-4">
        <div className="col-12 col-lg-8">
          <Game />
        </div>

        {/* Sección Opcional: Leaderboard desde BD */}
        <div className="col-12 col-lg-3 mt-5 mt-lg-0">
          <div className="card shadow-sm border-0" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold m-0" style={{ color: 'var(--text-color)' }}>
                  Partidas Globales
                </h6>
                <button className="btn btn-sm btn-outline-primary rounded-circle" onClick={cargarPartidas} aria-label="Actualizar">
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>

              {errorBd ? (
                <div className="alert alert-warning py-2 small">{errorBd}</div>
              ) : partidasAnteriores.length === 0 ? (
                <p className="text-muted small m-0">Aún no hay partidas registradas.</p>
              ) : (
                <ul className="list-group list-group-flush small">
                  {partidasAnteriores.map(p => (
                    <li key={p.id} className="list-group-item bg-transparent px-0 d-flex justify-content-between align-items-center" style={{ color: 'var(--text-color)', borderColor: 'var(--border-color)' }}>
                      <span>Ganador: <strong>{p.ganador}</strong></span>
                      <span className="badge bg-secondary rounded-pill">{p.total_movimientos} movs</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row text-center mt-5 flex-shrink-0">
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

export default TicTacToePage;
