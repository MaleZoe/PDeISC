/**
 * Módulo: snakePlayer.js
 * Responsabilidad: Estado y movimiento de la serpiente del jugador.
 */

const DIRECCIONES = {
  arriba: { x: 0, y: -1 },
  abajo: { x: 0, y: 1 },
  izquierda: { x: -1, y: 0 },
  derecha: { x: 1, y: 0 }
};

const OPUESTAS = {
  arriba: 'abajo',
  abajo: 'arriba',
  izquierda: 'derecha',
  derecha: 'izquierda'
};


/**
 * Crea el estado inicial de una serpiente.
 * @param {number} col - Columna inicial
 * @param {number} fil - Fila inicial
 * @param {string} dir - Dirección inicial
 * @returns {Object} Estado de serpiente
 */
export function crearSerpiente(col, fil, dir = 'derecha') {
  return {
    cuerpo: [
      { x: col, y: fil },
      { x: col - 1, y: fil },
      { x: col - 2, y: fil }
    ],
    direccion: dir,
    siguienteDireccion: dir,
    crecer: 0,
    viva: true
  };
}


/**
 * Cambia la dirección si no es opuesta.
 * @param {Object} serpiente - Estado actual
 * @param {string} nuevaDir - Nueva dirección
 */
export function cambiarDireccion(serpiente, nuevaDir) {
  if (!DIRECCIONES[nuevaDir]) return;
  const actual = serpiente.siguienteDireccion || serpiente.direccion;
  if (OPUESTAS[actual] === nuevaDir) return;
  serpiente.siguienteDireccion = nuevaDir;
}


/**
 * Mueve la serpiente un paso en la grilla.
 * @param {Object} serpiente - Estado actual
 * @param {Object} mapa - Config del nivel
 * @param {boolean} inmunidad - Si atraviesa paredes
 * @returns {Object} Cabeza nueva
 */
export function moverSerpiente(serpiente, mapa, inmunidad = false) {
  serpiente.direccion = serpiente.siguienteDireccion;
  const delta = DIRECCIONES[serpiente.direccion];
  const cabeza = { ...serpiente.cuerpo[0] };
  let nx = cabeza.x + delta.x;
  let ny = cabeza.y + delta.y;

  if (inmunidad) {
    if (nx < 0) nx = mapa.columnas - 1;
    if (nx >= mapa.columnas) nx = 0;
    if (ny < 0) ny = mapa.filas - 1;
    if (ny >= mapa.filas) ny = 0;
  }

  const nuevaCabeza = { x: nx, y: ny };
  serpiente.cuerpo.unshift(nuevaCabeza);
  if (serpiente.crecer > 0) {
    serpiente.crecer--;
  } else {
    serpiente.cuerpo.pop();
  }
  return nuevaCabeza;
}


/**
 * Verifica colisión de cabeza con cuerpo, pared u obstáculo.
 * @param {Object} serpiente - Estado actual
 * @param {Object} config - Nivel actual
 * @param {Array} otras - Otras serpientes
 * @param {boolean} inmunidad - Modo inmunidad activo
 * @returns {boolean} true si hay colisión
 */
export function verificarColision(
  serpiente,
  config,
  otras = [],
  inmunidad = false
) {
  const cabeza = serpiente.cuerpo[0];
  const { columnas, filas } = config.tamañoMapa;

  if (!inmunidad) {
    if (cabeza.x < 0 || cabeza.x >= columnas ||
        cabeza.y < 0 || cabeza.y >= filas) {
      return true;
    }
    const enObst = config.obstaculos.some(
      (o) => o.x === cabeza.x && o.y === cabeza.y
    );
    if (enObst) return true;
  }

  for (let i = 1; i < serpiente.cuerpo.length; i++) {
    if (serpiente.cuerpo[i].x === cabeza.x &&
        serpiente.cuerpo[i].y === cabeza.y) {
      return true;
    }
  }

  for (const otra of otras) {
    for (const seg of otra.cuerpo) {
      if (seg.x === cabeza.x && seg.y === cabeza.y) return true;
    }
  }
  return false;
}
