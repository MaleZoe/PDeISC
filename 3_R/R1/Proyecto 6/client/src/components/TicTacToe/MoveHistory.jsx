/**
 * Archivo: MoveHistory.jsx
 * Propósito: Define la lógica y funcionalidad asociada a MoveHistory.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './TicTacToe.module.css';

const MoveHistory = ({ history, currentMove, jumpTo }) => {
  return (
    <div className={`card ${styles.historyCard} border-0 shadow-sm h-100`}>
      <div className="card-header bg-transparent border-bottom-0 pt-4 pb-0">
        <h5 className="fw-bold m-0" style={{ color: 'var(--text-color)' }}>Historial de Movimientos</h5>
      </div>
      <div className="card-body">
        <ul className={`${styles.historyList} p-0 m-0`}>
          {history.map((step, move) => {
            const isCurrentMove = move === currentMove;
            const description = move > 0 
              ? `Movimiento #${move}` 
              : 'Inicio del juego';

            return (
              <li key={move} className="mb-2">
                <button
                  className={`btn btn-sm w-100 text-start ${isCurrentMove ? 'btn-primary fw-bold' : 'btn-outline-secondary'}`}
                  onClick={() => jumpTo(move)}
                  disabled={isCurrentMove}
                >
                  {description}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

MoveHistory.propTypes = {
  history: PropTypes.array.isRequired,
  currentMove: PropTypes.number.isRequired,
  jumpTo: PropTypes.func.isRequired
};

export default MoveHistory;
