import React from 'react';
import PropTypes from 'prop-types';
import styles from './TicTacToe.module.css';

const Square = ({ value, onClick, isWinningSquare }) => {
  return (
    <button
      className={`${styles.square} ${isWinningSquare ? styles.winningSquare : ''} ${value ? styles.occupied : ''}`}
      onClick={onClick}
      aria-label={value ? `Casilla ocupada por ${value}` : "Casilla vacía"}
    >
      {value}
    </button>
  );
};

Square.propTypes = {
  value: PropTypes.oneOf(['X', 'O', null]),
  onClick: PropTypes.func.isRequired,
  isWinningSquare: PropTypes.bool
};

export default Square;
