/**
 * Módulo: ghosts.js
 * Responsabilidad: IA y comportamiento de fantasmas escolares.
 */

const ESQUINAS_SCATTER = {
  director: { x: 18, y: 1 },
  inspectora: { x: 1, y: 1 },
  preceptor: { x: 18, y: 17 },
  vicedirector: { x: 1, y: 17 }
};

const COLORES = {
  director: '#ff0000',
  inspectora: '#ff69b4',
  preceptor: '#00ffff',
  vicedirector: '#ffa500'
};

const NOMBRES = {
  director: 'Director',
  inspectora: 'Inspectora',
  preceptor: 'Preceptor',
  vicedirector: 'Vicedirector'
};


/**
 * Crea un fantasma con su máquina de estados.
 * @param {string} tipo - Tipo de fantasma
 * @param {number} x - Posición inicial X
 * @param {number} y - Posición inicial Y
 * @returns {Object} Estado del fantasma
 */
export function crearFantasma(tipo, x, y) {
  return {
    tipo,
    nombre: NOMBRES[tipo],
    color: COLORES[tipo],
    x,
    y,
    dirX: 0,
    dirY: -1,
    estado: 'scatter',
    asustado: false,
    comido: false,
    posRender: { x, y }
  };
}


/**
 * Calcula objetivo según tipo y estado del fantasma.
 * @param {Object} fant - Fantasma
 * @param {Object} pac - Posición de PacMan
 * @param {Object} config - Config del nivel
 * @param {Object} director - Posición del director (para Inky)
 * @returns {{ x: number, y: number }} Celda objetivo
 */
export function calcularObjetivo(fant, pac, config, director) {
  if (fant.estado === 'scatter' || fant.asustado) {
    return ESQUINAS_SCATTER[fant.tipo];
  }

  const pred = config.iaPredictiva;
  const px = pred ? pac.x + pac.dirX * 2 : pac.x;
  const py = pred ? pac.y + pac.dirY * 2 : pac.y;

  switch (fant.tipo) {
    case 'director':
      return { x: px, y: py };
    case 'inspectora':
      return {
        x: pac.x + pac.dirX * 4,
        y: pac.y + pac.dirY * 4
      };
    case 'preceptor': {
      const vx = director ? director.x : fant.x;
      const vy = director ? director.y : fant.y;
      const tx = pac.x + pac.dirX * 2;
      const ty = pac.y + pac.dirY * 2;
      return { x: tx + (tx - vx), y: ty + (ty - vy) };
    }
    case 'vicedirector': {
      const dist = Math.hypot(fant.x - pac.x, fant.y - pac.y);
      if (dist > 8) return { x: pac.x, y: pac.y };
      return ESQUINAS_SCATTER.vicedirector;
    }
    default:
      return { x: pac.x, y: pac.y };
  }
}


/**
 * Elige la mejor dirección hacia el objetivo.
 * @param {Object} fant - Fantasma
 * @param {{ x: number, y: number }} objetivo - Celda meta
 * @param {Array} mapa - Matriz del mapa
 * @param {boolean} invertir - Si está asustado
 */
export function moverFantasma(fant, objetivo, mapa, invertir = false) {
  const dirs = [
    { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
    { dx: -1, dy: 0 }, { dx: 1, dy: 0 }
  ];
  let mejor = null;
  let mejorDist = Infinity;

  dirs.forEach(({ dx, dy }) => {
    if (invertir && dx === -fant.dirX && dy === -fant.dirY) return;
    const nx = fant.x + dx;
    const ny = fant.y + dy;
    if (ny < 0 || ny >= mapa.length || nx < 0 ||
        nx >= mapa[0].length) return;
    const cel = mapa[ny][nx];
    if (cel === 1) return;
    const dist = Math.hypot(nx - objetivo.x, ny - objetivo.y);
    if (dist < mejorDist) {
      mejorDist = dist;
      mejor = { dx, dy, nx, ny };
    }
  });

  if (mejor) {
    fant.dirX = mejor.dx;
    fant.dirY = mejor.dy;
    fant.x = mejor.nx;
    fant.y = mejor.ny;
  }
}


/**
 * Actualiza máquina de estados global de fantasmas.
 * @param {Array} fantasmas - Lista de fantasmas
 * @param {Object} config - Config del nivel
 * @param {number} tiempoInicio - Timestamp de inicio de fase
 */
export function actualizarEstadosGlobales(
  fantasmas,
  config,
  tiempoInicio
) {
  const ahora = Date.now() - tiempoInicio;
  const ciclo = config.tiempoScatter + config.tiempoChase;
  const fase = ahora % ciclo;
  const nuevoEstado = fase < config.tiempoScatter ? 'scatter' : 'chase';

  fantasmas.forEach((f) => {
    if (!f.asustado) f.estado = nuevoEstado;
  });
}


/**
 * Activa modo asustado en todos los fantasmas.
 * @param {Array} fantasmas - Lista de fantasmas
 * @param {number} duracion - Milisegundos
 */
export function asustarFantasmas(fantasmas, duracion) {
  fantasmas.forEach((f) => {
    f.asustado = true;
    f.estado = 'frightened';
    f.dirX *= -1;
    f.dirY *= -1;
  });
  setTimeout(() => {
    fantasmas.forEach((f) => {
      f.asustado = false;
      f.estado = 'chase';
    });
  }, duracion);
}
