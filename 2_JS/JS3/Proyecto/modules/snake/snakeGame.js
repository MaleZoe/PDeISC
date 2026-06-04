/**
 * Módulo: snakeGame.js
 * Responsabilidad: Game loop, canvas, colisiones y lógica Snake.
 */

import { NIVELES_SNAKE } from './snakeLevels.js';
import {
  crearSerpiente,
  cambiarDireccion,
  moverSerpiente,
  verificarColision
} from './snakePlayer.js';
import {
  inicializarModales,
  mostrarModalModo,
  mostrarRegistro,
  actualizarHUD,
  mostrarTransicionNivel,
  mostrarGameOver,
  enviarPuntaje,
  cerrarNavbarAlClick
} from './snakeUI.js';
import {
  crearSalaSnake,
  unirseSalaSnake,
  enviarMovimiento,
  registrarEventosMultijugador
} from './snakeMultiplayer.js';

const TIPOS_COMIDA = [
  { tipo: 'billete', puntos: 10, emoji: '💵', prob: 0.5 },
  { tipo: 'copa', puntos: 50, emoji: '🏆', prob: 0.1 },
  { tipo: 'contrato', puntos: 30, emoji: '📄', prob: 0.2 },
  { tipo: 'sobre', puntos: 20, emoji: '✉️', prob: 0.2 }
];

const TIPOS_POWERUP = ['turbo', 'congelar', 'inmunidad'];
const DURACION_POWERUP = { turbo: 5000, congelar: 4000, inmunidad: 6000 };


let canvas, ctx, tamCelda = 20;
let nivelActual = 0;
let serpiente, enemigos = [];
let comida = null;
let powerup = null;
let powerupActivo = null;
let tiempoPowerup = 0;
let puntaje = 0;
let vidas = 3;
let nombreJugador = '';
let modoJuego = 'individual';
let tickId = null;
let animId = null;
let pausado = false;
let obstaculosMoviles = [];


/**
 * Inicializa el juego Snake.
 */
export async function iniciarSnake() {
  inicializarModales();
  cerrarNavbarAlClick();
  canvas = document.getElementById('canvasSnake');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  configurarResize();
  configurarControles();

  mostrarModalModo(async (modo) => {
    modoJuego = modo;
    if (modo === 'multijugador') {
      await configurarMultijugador();
    }
    nombreJugador = await mostrarRegistro();
    if (!nombreJugador) {
      nombreJugador = sessionStorage.getItem('nombreJugador') || 'Jugador';
    }
    iniciarNivel(0);
  });
}


/**
 * Configura sala multijugador.
 */
async function configurarMultijugador() {
  return new Promise((resolver) => {
    const panel = document.getElementById('panelMultijugador');
    if (panel) panel.classList.remove('d-none');

    document.getElementById('btnCrearSala')?.addEventListener('click', async () => {
      const cod = await crearSalaSnake(nombreJugador);
      const el = document.getElementById('codigoSala');
      if (el) el.textContent = cod;
    });

    document.getElementById('btnUnirseSala')?.addEventListener('click', () => {
      const cod = document.getElementById('inputCodigoSala')?.value;
      unirseSalaSnake(cod, nombreJugador);
    });

    const mostrarError = (msg) => {
      const el = document.getElementById('errorSala');
      if (el) el.textContent = msg;
    };
    registrarEventosMultijugador({
      jugadorUnido: () => resolver(),
      salaNoencontrada: (d) => mostrarError(d.mensaje),
      salaLlena: (d) => mostrarError(d.mensaje)
    });
  });
}


/**
 * Inicia un nivel por índice.
 * @param {number} idx - Índice del nivel
 */
async function iniciarNivel(idx) {
  nivelActual = idx;
  const config = NIVELES_SNAKE[idx];
  vidas = vidas || 3;
  const { columnas, filas } = config.tamañoMapa;
  serpiente = crearSerpiente(Math.floor(columnas / 2), Math.floor(filas / 2));
  enemigos = [];
  if (config.enemigoIA) {
    for (let i = 0; i < config.cantidadEnemigos; i++) {
      enemigos.push(crearSerpiente(2 + i * 3, 2, 'abajo'));
    }
  }
  obstaculosMoviles = config.obstaculosMoviles
    ? [{ x: 5, y: 5, dx: 1, dy: 0 }]
    : [];
  generarComida(config);
  await mostrarTransicionNivel(config.mensajeInicio);
  iniciarTick(config);
  iniciarRender();
}


/**
 * Genera comida aleatoria en celda libre.
 * @param {Object} config - Config del nivel
 */
function generarComida(config) {
  const { columnas, filas } = config.tamañoMapa;
  let x, y, libre;
  do {
    x = Math.floor(Math.random() * columnas);
    y = Math.floor(Math.random() * filas);
    libre = !serpiente.cuerpo.some((s) => s.x === x && s.y === y);
    libre = libre && !config.obstaculos.some((o) => o.x === x && o.y === y);
  } while (!libre);
  const r = Math.random();
  let acum = 0;
  let tipo = TIPOS_COMIDA[0];
  for (const t of TIPOS_COMIDA) {
    acum += t.prob;
    if (r <= acum) { tipo = t; break; }
  }
  const trampa = config.objetosFalsos && Math.random() < 0.15;
  comida = { x, y, ...tipo, trampa };
}


/**
 * Inicia el tick de lógica del juego.
 * @param {Object} config - Config del nivel
 */
function iniciarTick(config) {
  if (tickId) clearInterval(tickId);
  let velocidad = config.velocidadBase;
  if (powerupActivo === 'turbo') velocidad /= 2;

  tickId = setInterval(() => {
    if (pausado) return;
    const inm = powerupActivo === 'inmunidad' &&
      Date.now() < tiempoPowerup;
    moverSerpiente(serpiente, config.tamañoMapa, inm);

    aplicarPortales(config);
    const zonaLenta = config.zonasLentas.some(
      (z) => z.x === serpiente.cuerpo[0].x &&
        z.y === serpiente.cuerpo[0].y
    );
    if (zonaLenta && tickId) {
      clearInterval(tickId);
      setTimeout(() => iniciarTick(config), 200);
    }

    if (verificarColision(serpiente, config, enemigos, inm)) {
      perderVida(config);
      return;
    }

    if (comida && serpiente.cuerpo[0].x === comida.x &&
        serpiente.cuerpo[0].y === comida.y) {
      if (comida.trampa) {
        puntaje = Math.max(0, puntaje - 20);
      } else {
        puntaje += comida.puntos;
        serpiente.crecer += 2;
      }
      generarComida(config);
      if (Math.random() < 0.08 && !powerup) {
        powerup = {
          x: comida.x,
          y: comida.y,
          tipo: TIPOS_POWERUP[
            Math.floor(Math.random() * TIPOS_POWERUP.length)
          ]
        };
      }
      if (puntaje >= config.umbralPuntaje) {
        completarNivel(config);
      }
    }

    if (powerup && serpiente.cuerpo[0].x === powerup.x &&
        serpiente.cuerpo[0].y === powerup.y) {
      activarPowerup(powerup.tipo);
      powerup = null;
    }

    moverObstaculosMoviles(config);
    if (config.enemigoIA && powerupActivo !== 'congelar') {
      moverEnemigos(config);
    }
    actualizarHUD({
      nombre: nombreJugador,
      puntaje,
      nivel: config.numero,
      vidas,
      powerup: powerupActivo || '—'
    });
  }, velocidad);
}


/**
 * Aplica portales al cruzar bordes especiales.
 * @param {Object} config - Config del nivel
 */
function aplicarPortales(config) {
  const cab = serpiente.cuerpo[0];
  for (const p of config.portales) {
    if (cab.x === p.entrada.x && cab.y === p.entrada.y) {
      serpiente.cuerpo[0] = { ...p.salida };
    }
  }
}


/**
 * Activa un power-up temporal.
 * @param {string} tipo - Tipo de power-up
 */
function activarPowerup(tipo) {
  powerupActivo = tipo;
  tiempoPowerup = Date.now() + (DURACION_POWERUP[tipo] || 5000);
  setTimeout(() => { powerupActivo = null; }, DURACION_POWERUP[tipo]);
}


/**
 * Mueve obstáculos móviles.
 * @param {Object} config - Config del nivel
 */
function moverObstaculosMoviles(config) {
  const { columnas, filas } = config.tamañoMapa;
  obstaculosMoviles.forEach((obs) => {
    obs.x += obs.dx;
    if (obs.x <= 0 || obs.x >= columnas - 1) obs.dx *= -1;
    if (serpiente.cuerpo[0].x === obs.x &&
        serpiente.cuerpo[0].y === obs.y) {
      perderVida(config);
    }
  });
}


/**
 * IA simple para serpientes enemigas.
 * @param {Object} config - Config del nivel
 */
function moverEnemigos(config) {
  enemigos.forEach((en) => {
    const cab = serpiente.cuerpo[0];
    const ecab = en.cuerpo[0];
    if (cab.x > ecab.x) cambiarDireccion(en, 'derecha');
    else if (cab.x < ecab.x) cambiarDireccion(en, 'izquierda');
    else if (cab.y > ecab.y) cambiarDireccion(en, 'abajo');
    else cambiarDireccion(en, 'arriba');
    moverSerpiente(en, config.tamañoMapa);
  });
}


/**
 * Pierde una vida y reinicia o termina.
 * @param {Object} config - Config del nivel
 */
function perderVida(config) {
  vidas--;
  if (vidas <= 0) {
    clearInterval(tickId);
    cancelAnimationFrame(animId);
    mostrarGameOver(puntaje, config.numero);
    enviarPuntaje({
      nombre: nombreJugador,
      puntaje,
      juego: 'snake',
      modo: modoJuego === 'multijugador' ? 'multijugador' : 'individual',
      nivel: config.numero
    });
    return;
  }
  const { columnas, filas } = config.tamañoMapa;
  serpiente = crearSerpiente(
    Math.floor(columnas / 2),
    Math.floor(filas / 2)
  );
}


/**
 * Avanza al siguiente nivel o termina.
 * @param {Object} config - Config actual
 */
function completarNivel(config) {
  clearInterval(tickId);
  if (nivelActual + 1 >= NIVELES_SNAKE.length) {
    mostrarGameOver(puntaje, config.numero);
    enviarPuntaje({
      nombre: nombreJugador,
      puntaje,
      juego: 'snake',
      modo: 'individual',
      nivel: config.numero
    });
    return;
  }
  iniciarNivel(nivelActual + 1);
}


/**
 * Loop de renderizado con requestAnimationFrame.
 */
function iniciarRender() {
  const render = () => {
    dibujar();
    animId = requestAnimationFrame(render);
  };
  render();
}


/**
 * Dibuja el estado actual en el canvas.
 */
function dibujar() {
  if (!ctx || !canvas) return;
  const config = NIVELES_SNAKE[nivelActual];
  if (!config) return;
  const { columnas, filas } = config.tamañoMapa;
  const ancho = columnas * tamCelda;
  const alto = filas * tamCelda;

  ctx.fillStyle = '#0d3b1e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#1a5c32';
  config.obstaculos.forEach((o) => {
    ctx.fillRect(o.x * tamCelda, o.y * tamCelda, tamCelda, tamCelda);
  });

  config.zonasLentas.forEach((z) => {
    ctx.fillStyle = 'rgba(100,100,100,0.5)';
    ctx.fillRect(z.x * tamCelda, z.y * tamCelda, tamCelda, tamCelda);
  });

  if (comida) {
    ctx.font = `${tamCelda - 4}px serif`;
    ctx.fillText(
      comida.emoji,
      comida.x * tamCelda + 2,
      comida.y * tamCelda + tamCelda - 4
    );
  }

  const glow = powerupActivo === 'turbo';
  ctx.fillStyle = glow ? '#7fff00' : '#39ff14';
  serpiente.cuerpo.forEach((seg, i) => {
    ctx.fillRect(
      seg.x * tamCelda + 1,
      seg.y * tamCelda + 1,
      tamCelda - 2,
      tamCelda - 2
    );
  });

  ctx.fillStyle = '#ff4444';
  enemigos.forEach((en) => {
    en.cuerpo.forEach((seg) => {
      ctx.fillRect(
        seg.x * tamCelda + 1,
        seg.y * tamCelda + 1,
        tamCelda - 2,
        tamCelda - 2
      );
    });
  });

  ctx.strokeStyle = '#39ff14';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, ancho, alto);
}


/**
 * Configura ResizeObserver para el canvas.
 */
function configurarResize() {
  const cont = document.getElementById('canvasContainer');
  if (!cont) return;
  const obs = new ResizeObserver(() => {
    const ancho = cont.clientWidth;
    tamCelda = window.innerWidth < 768 ? 15 : 20;
    const config = NIVELES_SNAKE[nivelActual] || NIVELES_SNAKE[0];
    canvas.width = config.tamañoMapa.columnas * tamCelda;
    canvas.height = config.tamañoMapa.filas * tamCelda;
    canvas.style.maxWidth = `${ancho}px`;
  });
  obs.observe(cont);
  obs.disconnect();
  obs.observe(cont);
}


/**
 * Configura teclado y joystick táctil.
 */
function configurarControles() {
  const mapa = {
    ArrowUp: 'arriba', ArrowDown: 'abajo',
    ArrowLeft: 'izquierda', ArrowRight: 'derecha',
    w: 'arriba', s: 'abajo', a: 'izquierda', d: 'derecha'
  };
  document.addEventListener('keydown', (e) => {
    const dir = mapa[e.key];
    if (dir) {
      cambiarDireccion(serpiente, dir);
      if (modoJuego === 'multijugador') enviarMovimiento(dir);
    }
  });

  const joy = document.getElementById('joystickSnake');
  if (!joy) return;
  let activo = false;
  const centro = { x: 0, y: 0 };

  joy.addEventListener('pointerdown', (e) => {
    activo = true;
    const rect = joy.getBoundingClientRect();
    centro.x = rect.left + rect.width / 2;
    centro.y = rect.top + rect.height / 2;
    e.preventDefault();
  }, { passive: false });

  joy.addEventListener('pointermove', (e) => {
    if (!activo || !serpiente) return;
    const dx = e.clientX - centro.x;
    const dy = e.clientY - centro.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      cambiarDireccion(serpiente, dx > 0 ? 'derecha' : 'izquierda');
    } else {
      cambiarDireccion(serpiente, dy > 0 ? 'abajo' : 'arriba');
    }
  });

  joy.addEventListener('pointerup', () => { activo = false; });
}
