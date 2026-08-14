import React from 'react';
import PropTypes from 'prop-types';
import Square from './Square';
import styles from './TicTacToe.module.css';

const Board = ({ xIsNext, squares, onPlay, winningLine }) => {
  const handleClick = (i) => {
    // Si la casilla está ocupada o hay ganador, no hacer nada
    if (squares[i] || winningLine) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  };

  const renderSquare = (i) => {
    const isWinningSquare = winningLine?.includes(i) || false;
    return (
      <Square 
        key={i} 
        value={squares[i]} 
        onClick={() => handleClick(i)} 
        isWinningSquare={isWinningSquare}
      />
    );
  };

  return (
    <div className={styles.board}>
      {[0, 1, 2].map((row) => (
        <div key={row} className={styles.boardRow}>
          {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
};

Board.propTypes = {
  xIsNext: PropTypes.bool.isRequired,
  squares: PropTypes.arrayOf(PropTypes.oneOf(['X', 'O', null])).isRequired,
  onPlay: PropTypes.func.isRequired,
  winningLine: PropTypes.arrayOf(PropTypes.number)
};

export default Board;
