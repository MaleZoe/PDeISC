// client/src/components/TicTacToe/utils/logic.js

/**
 * Calcula el ganador del Ta-Te-Ti.
 * @param {Array} squares Arreglo de 9 posiciones con 'X', 'O' o null.
 * @returns {Object|null} Objeto con el ganador ('X' o 'O') y la línea ganadora, o null si no hay.
 */
export function calcularGanador(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { ganador: squares[a], linea: lines[i] };
    }
  }
  return null;
}

/**
 * Calcula si hay empate.
 * @param {Array} squares Arreglo de 9 posiciones.
 * @returns {boolean} True si todas las casillas están llenas y no hay ganador.
 */
export function calcularEmpate(squares) {
  return squares.every(square => square !== null);
}
