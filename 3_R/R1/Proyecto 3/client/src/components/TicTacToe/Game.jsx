import React, { useState, useEffect } from 'react';
import Board from './Board';
import GameStatus from './GameStatus';
import MoveHistory from './MoveHistory';
import GameControls from './GameControls';
import { calcularGanador, calcularEmpate } from './utils/logic';
import styles from './TicTacToe.module.css';

const Game = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  
  const ganadorResult = calcularGanador(currentSquares);
  const winner = ganadorResult ? ganadorResult.ganador : null;
  const winningLine = ganadorResult ? ganadorResult.linea : null;
  const isDraw = !winner && calcularEmpate(currentSquares);

  // Guardar partida en el backend al terminar
  useEffect(() => {
    if (winner || isDraw) {
      const guardarPartida = async () => {
        try {
          const resultado = winner ? winner : 'Empate';
          await fetch('http://localhost:3001/api/partidas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ganador: resultado,
              total_movimientos: currentMove
            })
          });
        } catch (error) {
          console.error("No se pudo guardar la partida en la BD:", error);
        }
      };
      guardarPartida();
    }
  }, [winner, isDraw, currentMove]);

  const handlePlay = (nextSquares) => {
    // Branching: corta el futuro si estábamos en el pasado y hacemos un nuevo movimiento
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
  };

  const restart = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  };

  return (
    <div className={styles.gameWrapper}>
      
      <div className={styles.boardContainer}>
        <GameStatus 
          winner={winner} 
          isDraw={isDraw} 
          xIsNext={xIsNext} 
        />
        
        <Board 
          xIsNext={xIsNext} 
          squares={currentSquares} 
          onPlay={handlePlay} 
          winningLine={winningLine}
        />
        
        <GameControls onRestart={restart} />
      </div>

      <div className={styles.historyContainer}>
        <MoveHistory 
          history={history} 
          currentMove={currentMove} 
          jumpTo={jumpTo} 
        />
      </div>

    </div>
  );
};

export default Game;
