/**
 * Archivo: TicTacToePage.jsx
 * Propósito: Define la lógica y funcionalidad asociada a TicTacToePage.
 */

import React, { useState, useEffect } from 'react';
import Game from '../../components/TicTacToe/Game';
import styles from '../../components/TicTacToe/TicTacToe.module.css';

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
            Proyecto 6
          </div>
          <h2 className="display-6 fw-bold mb-2" style={{ color: 'var(--text-color)', letterSpacing: '-1px' }}>
            Ta-Te-Ti (Tic-Tac-Toe)
          </h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1.05rem' }}>
            Proyecto Fullstack. Estado elevado, viaje en el tiempo y Base de Datos (SQLite).
          </p>
        </div>
      </div>

      <div className="row justify-content-center flex-grow-1 align-items-start gap-4">
        <div className="col-12 col-xl-7">
          <Game onGameEnd={cargarPartidas} />
        </div>

        {/* Sección Opcional: Leaderboard desde BD */}
        <div className="col-12 col-xl-4 mt-5 mt-xl-0">
          <div className={`card shadow-sm border-0 h-100 ${styles.glassCard}`}>
            <div className="card-body p-4 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold m-0" style={{ color: 'var(--text-color)' }}>
                  Ranking Global (BD)
                </h5>
                <button className="btn btn-sm btn-primary rounded-circle" onClick={cargarPartidas} aria-label="Actualizar">
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>
              
              <p className="small text-muted mb-4">
                <strong>¿Para qué sirve esto?</strong> Cada vez que terminas una partida, el resultado se envía a un servidor Backend (Node.js) y se guarda en una Base de Datos SQLite, demostrando una integración Fullstack real.
              </p>

              {errorBd ? (
                <div className="alert alert-danger py-3 small rounded-4 my-auto text-center">
                  <i className="bi bi-x-circle-fill fs-4 d-block mb-2"></i>
                  {errorBd}
                </div>
              ) : partidasAnteriores.length === 0 ? (
                <div className="text-center text-muted my-auto py-4">
                  <i className="bi bi-database display-4 mb-3 d-block opacity-25"></i>
                  <p className="small m-0">Aún no hay partidas en la base de datos.</p>
                </div>
              ) : (
                <ul className="list-group list-group-flush small rounded-3 flex-grow-1" style={{ overflowY: 'auto', maxHeight: '300px' }}>
                  {partidasAnteriores.map(p => (
                    <li key={p.id} className="list-group-item bg-transparent px-2 py-3 d-flex justify-content-between align-items-center" style={{ color: 'var(--text-color)', borderColor: 'var(--border-color)' }}>
                      <div className="d-flex align-items-center">
                        <span className="badge rounded-circle me-3 p-2" style={{ backgroundColor: 'rgba(128, 128, 128, 0.2)', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="bi bi-trophy-fill text-warning"></i>
                        </span>
                        <span>
                          Ganador: <strong className={p.ganador === 'X' ? 'text-danger' : p.ganador === 'O' ? 'text-info' : 'text-muted'}>{p.ganador}</strong>
                        </span>
                      </div>
                      <span className="badge bg-secondary rounded-pill">{p.total_movimientos} movs</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default TicTacToePage;

