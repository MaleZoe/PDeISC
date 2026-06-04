/**
 * Módulo: map.js
 * Responsabilidad: Matrices de mapa por nivel de PacMan.
 * 0=pasillo 1=pared 2=apunte 3=examen 4=puerta 5=unidireccional
 */

function crearMapaBase(filas, cols, paredes) {
  const mapa = Array.from({ length: filas }, () =>
    Array(cols).fill(2)
  );
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < cols; c++) {
      if (f === 0 || f === filas - 1 || c === 0 || c === cols - 1) {
        mapa[f][c] = 1;
      }
    }
  }
  paredes.forEach(([f, c]) => { mapa[f][c] = 1; });
  return mapa;
}


export const MAPAS = {
  nivel1: crearMapaBase(19, 21, [
    [5, 5], [5, 6], [5, 7], [5, 13], [5, 14], [5, 15],
    [9, 9], [9, 10], [9, 11], [13, 5], [13, 15]
  ]),
  nivel2: crearMapaBase(19, 21, [
    [4, 4], [4, 5], [4, 16], [4, 17],
    [9, 8], [9, 9], [9, 10], [9, 11], [9, 12],
    [14, 10], [14, 11]
  ]),
  nivel3: crearMapaBase(21, 23, [
    [6, 6], [6, 7], [6, 8], [6, 16], [6, 17],
    [10, 10], [10, 11], [10, 12], [14, 6], [14, 17],
    [3, 11], [17, 11]
  ]),
  nivel4: crearMapaBase(19, 21, [
    [5, 10], [6, 10], [7, 10], [12, 10], [13, 10],
    [9, 5], [9, 6], [9, 14], [9, 15]
  ]),
  nivel5: crearMapaBase(19, 21, [
    [3, 3], [3, 4], [3, 17], [3, 18],
    [15, 3], [15, 18], [9, 9], [9, 10], [9, 11]
  ]),
  nivel6: (() => {
    const m = crearMapaBase(19, 21, [
      [8, 5], [8, 6], [9, 5], [10, 5]
    ]);
    m[9][10] = 5;
    m[9][11] = 5;
    return m;
  })(),
  nivel7: crearMapaBase(19, 21, [
    [4, 4], [4, 17], [14, 4], [14, 17],
    [7, 10], [8, 10], [11, 10], [12, 10]
  ]),
  nivel8: crearMapaBase(21, 23, [
    [5, 5], [5, 18], [15, 5], [15, 18],
    [10, 10], [10, 11], [10, 12]
  ]),
  nivel9: crearMapaBase(19, 21, [
    [6, 6], [6, 15], [12, 6], [12, 15],
    [9, 9], [9, 10], [9, 11]
  ]),
  nivel10: (() => {
    const m = crearMapaBase(21, 23, [
      [5, 5], [5, 18], [15, 5], [15, 18],
      [10, 10], [10, 11], [10, 12]
    ]);
    m[9][10] = 5;
    m[9][12] = 5;
    return m;
  })()
};


/**
 * Coloca power pellets en el mapa.
 * @param {Array} mapa - Matriz del mapa
 */
export function colocarPowerPellets(mapa) {
  const esquinas = [
    [1, 1], [1, mapa[0].length - 2],
    [mapa.length - 2, 1],
    [mapa.length - 2, mapa[0].length - 2]
  ];
  esquinas.forEach(([f, c]) => {
    if (mapa[f][c] === 2) mapa[f][c] = 3;
  });
}


/**
 * Cuenta apuntes restantes en el mapa.
 * @param {Array} mapa - Matriz del mapa
 * @returns {number} Cantidad de apuntes
 */
export function contarApuntes(mapa) {
  let total = 0;
  mapa.forEach((fila) => {
    fila.forEach((cel) => { if (cel === 2) total++; });
  });
  return total;
}
