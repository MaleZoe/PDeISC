/**
 * Archivo: GameStatus.jsx
 * Propósito: Define la lógica y funcionalidad asociada a GameStatus.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './TicTacToe.module.css';

const GameStatus = ({ winner, isDraw, xIsNext }) => {
  let statusText;
  let statusClass = styles.statusTurn;

  if (winner) {
    statusText = `¡Ganó ${winner}!`;
    statusClass = styles.statusWinner;
  } else if (isDraw) {
    statusText = '¡Empate!';
    statusClass = styles.statusDraw;
  } else {
    statusText = `Turno de: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className={`${styles.gameStatus} ${statusClass} rounded-pill mb-4`}>
      <h4 className="m-0 fw-bold">{statusText}</h4>
    </div>
  );
};

GameStatus.propTypes = {
  winner: PropTypes.string,
  isDraw: PropTypes.bool.isRequired,
  xIsNext: PropTypes.bool.isRequired
};

export default GameStatus;
