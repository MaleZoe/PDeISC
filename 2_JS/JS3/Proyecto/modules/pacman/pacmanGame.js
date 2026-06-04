/**
 * Módulo: pacmanGame.js
 * Responsabilidad: Game loop, canvas y lógica principal de PacMan.
 */

import { NIVELES_PACMAN, BONUS_FRUTAS } from './pacmanLevels.js';
import { MAPAS, colocarPowerPellets, contarApuntes } from './map.js';
import {
  crearFantasma,
  calcularObjetivo,
  moverFantasma,
  actualizarEstadosGlobales,
  asustarFantasmas
} from './ghosts.js';
import {
  conectar,
  emitir,
  escuchar
} from '../../scripts/socketClient.js';
import { Modal } from 'bootstrap';

const PATRON_NOMBRE = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]{3,20}$/;
const TIPOS_FANT = ['director', 'inspectora', 'preceptor', 'vicedirector'];

let canvas, ctx, canvasMapa, ctxMapa;
let tamTile = 16;
let nivelIdx = 0;
let mapa = [];
let pacman, fantasmas = [];
let puntaje = 0;
let vidas = 3;
let nombreJugador = '';
let modoJuego = 'individual';
let apuntesRestantes = 0;
let tiempoInicioFase = Date.now();
let tiempoLimiteRestante = null;
let animId = null;
let ultimoTiempo = 0;
let audioCtx = null;


/**
 * Inicializa el juego PacMan.
 */
export async function iniciarPacman() {
  canvas = document.getElementById('canvasPacman');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  canvasMapa = document.createElement('canvas');
  ctxMapa = canvasMapa.getContext('2d');
  configurarResize();
  configurarControles();
  cerrarNavbar();
  await flujoInicio();
}


/**
 * Flujo de modales: modo → registro → juego.
 */
async function flujoInicio() {
  const modo = await elegirModo();
  modoJuego = modo;
  nombreJugador = await pedirNombre();
  if (!nombreJugador) {
    nombreJugador = sessionStorage.getItem('nombreJugador') || 'Estudiante';
  }
  cargarNivel(0);
}


/**
 * Modal de selección de modo.
 * @returns {Promise<string>} Modo elegido
 */
function elegirModo() {
  return new Promise((resolver) => {
    const el = document.getElementById('modalModoPacman');
    const modal = new Modal(el, { backdrop: 'static' });
    document.getElementById('btnPacIndividual')?.addEventListener('click', () => {
      modal.hide();
      resolver('individual');
    }, { once: true });
    document.getElementById('btnPacCoop')?.addEventListener('click', () => {
      modal.hide();
      resolver('cooperativo');
    }, { once: true });
    document.getElementById('btnPacVersus')?.addEventListener('click', () => {
      modal.hide();
      resolver('versus');
    }, { once: true });
    modal.show();
  });
}


/**
 * Modal de registro con validación.
 * @returns {Promise<string>} Nombre validado
 */
function pedirNombre() {
  return new Promise((resolver) => {
    const el = document.getElementById('modalRegistroPacman');
    const modal = new Modal(el, { backdrop: 'static' });
    const input = document.getElementById('inputNombrePacman');
    const btn = document.getElementById('btnConfirmarPacman');
    const validar = () => {
      const ok = PATRON_NOMBRE.test(input?.value.trim() || '');
      input?.classList.toggle('is-valid', ok);
      input?.classList.toggle('is-invalid', !ok);
      if (btn) btn.disabled = !ok;
      return ok;
    };
    input?.addEventListener('input', validar);
    btn?.addEventListener('click', () => {
      if (!validar()) return;
      const n = input.value.trim();
      sessionStorage.setItem('nombreJugador', n);
      modal.hide();
      resolver(n);
    }, { once: true });
    modal.show();
  });
}


/**
 * Carga un nivel por índice.
 * @param {number} idx - Índice del nivel
 */
function cargarNivel(idx) {
  nivelIdx = idx;
  const config = NIVELES_PACMAN[idx];
  mapa = MAPAS[config.mapa].map((f) => [...f]);
  colocarPowerPellets(mapa);
  apuntesRestantes = contarApuntes(mapa);

  pacman = {
    x: 10,
    y: 15,
    dirX: 0,
    dirY: 0,
    siguienteDir: null,
    posRender: { x: 10, y: 15 },
    velocidad: config.velocidadPacman
  };

  fantasmas = [];
  for (let i = 0; i < config.cantidadFantasmas; i++) {
    const tipo = TIPOS_FANT[i % TIPOS_FANT.length];
    fantasmas.push(crearFantasma(tipo, 10 + i, 9));
  }

  tiempoInicioFase = Date.now();
  tiempoLimiteRestante = config.tiempoLimite;
  dibujarMapaEstatico();
  actualizarHUD();
  mostrarMensajeNivel(config.nombre);
  iniciarLoop();
}


/**
 * Dibuja capa estática del mapa en offscreen canvas.
 */
function dibujarMapaEstatico() {
  const filas = mapa.length;
  const cols = mapa[0].length;
  canvasMapa.width = cols * tamTile;
  canvasMapa.height = filas * tamTile;
  ctxMapa.fillStyle = '#0a0a2e';
  ctxMapa.fillRect(0, 0, canvasMapa.width, canvasMapa.height);

  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < cols; c++) {
      const cel = mapa[f][c];
      const px = c * tamTile;
      const py = f * tamTile;
      if (cel === 1) {
        ctxMapa.fillStyle = '#1a3a6e';
        ctxMapa.fillRect(px, py, tamTile, tamTile);
      } else if (cel === 2) {
        ctxMapa.fillStyle = '#ffe000';
        ctxMapa.beginPath();
        ctxMapa.arc(
          px + tamTile / 2, py + tamTile / 2, 2, 0, Math.PI * 2
        );
        ctxMapa.fill();
      } else if (cel === 3) {
        ctxMapa.fillStyle = '#ff6b00';
        ctxMapa.fillRect(px + 4, py + 4, tamTile - 8, tamTile - 8);
      }
    }
  }
}


/**
 * Loop principal con requestAnimationFrame.
 */
function iniciarLoop() {
  if (animId) cancelAnimationFrame(animId);
  const loop = (tiempo) => {
    const dt = (tiempo - ultimoTiempo) / 16.67;
    ultimoTiempo = tiempo;
    actualizar(dt);
    dibujar();
    animId = requestAnimationFrame(loop);
  };
  ultimoTiempo = performance.now();
  animId = requestAnimationFrame(loop);
}


/**
 * Actualiza lógica del juego.
 * @param {number} dt - Delta time normalizado
 */
function actualizar(dt) {
  const config = NIVELES_PACMAN[nivelIdx];
  if (tiempoLimiteRestante !== null) {
    tiempoLimiteRestante -= 16.67 * dt;
    if (tiempoLimiteRestante <= 0) {
      perderVida();
      return;
    }
  }

  moverPacman(config, dt);
  actualizarEstadosGlobales(fantasmas, config, tiempoInicioFase);

  const director = fantasmas.find((f) => f.tipo === 'director');
  fantasmas.forEach((fant) => {
    const obj = calcularObjetivo(fant, pacman, config, director);
    moverFantasma(fant, obj, mapa, fant.asustado);
    fant.posRender.x += (fant.x - fant.posRender.x) * 0.3;
    fant.posRender.y += (fant.y - fant.posRender.y) * 0.3;

    if (!fant.asustado &&
        Math.round(fant.x) === Math.round(pacman.x) &&
        Math.round(fant.y) === Math.round(pacman.y)) {
      perderVida();
    }
    if (fant.asustado &&
        Math.round(fant.x) === Math.round(pacman.x) &&
        Math.round(fant.y) === Math.round(pacman.y)) {
      puntaje += 200;
      fant.x = 10;
      fant.y = 9;
      reproducirSonido(600, 0.1);
    }
  });

  pacman.posRender.x += (pacman.x - pacman.posRender.x) * 0.35;
  pacman.posRender.y += (pacman.y - pacman.posRender.y) * 0.35;
  actualizarHUD();
}


/**
 * Mueve a PacMan según dirección y colisiones.
 * @param {Object} config - Config del nivel
 * @param {number} dt - Delta time
 */
function moverPacman(config, dt) {
  if (pacman.siguienteDir) {
    const { dx, dy } = pacman.siguienteDir;
    const nx = pacman.x + dx;
    const ny = pacman.y + dy;
    if (puedeMover(nx, ny)) {
      pacman.dirX = dx;
      pacman.dirY = dy;
    }
  }
  const vel = config.velocidadPacman * dt * 0.08;
  const nx = pacman.x + pacman.dirX * vel;
  const ny = pacman.y + pacman.dirY * vel;
  if (puedeMover(Math.round(nx), Math.round(ny))) {
    pacman.x = nx;
    pacman.y = ny;
    recolectar(pacman.x, pacman.y, config);
  }
}


/**
 * Verifica si una celda es transitable.
 * @param {number} x - Columna
 * @param {number} y - Fila
 * @returns {boolean}
 */
function puedeMover(x, y) {
  if (y < 0 || y >= mapa.length || x < 0 || x >= mapa[0].length) {
    return false;
  }
  const cel = mapa[y][x];
  return cel !== 1;
}


/**
 * Recolecta apunte o power pellet.
 * @param {number} x - Columna
 * @param {number} y - Fila
 * @param {Object} config - Config del nivel
 */
function recolectar(x, y, config) {
  const cx = Math.round(x);
  const cy = Math.round(y);
  const cel = mapa[cy]?.[cx];
  if (cel === 2) {
    mapa[cy][cx] = 0;
    puntaje += 10;
    apuntesRestantes--;
    reproducirSonido(440, 0.05);
    if (apuntesRestantes <= 0) completarNivel();
  } else if (cel === 3) {
    mapa[cy][cx] = 0;
    puntaje += 50;
    asustarFantasmas(fantasmas, config.tiempoAsustado);
    reproducirSonido(880, 0.15);
  }
}


/**
 * Pierde una vida y reinicia posiciones.
 */
function perderVida() {
  vidas--;
  reproducirSonido(200, 0.3);
  if (vidas <= 0) {
    cancelAnimationFrame(animId);
    mostrarFinPartida();
    return;
  }
  pacman.x = 10;
  pacman.y = 15;
  pacman.dirX = 0;
  pacman.dirY = 0;
}


/**
 * Avanza al siguiente nivel.
 */
function completarNivel() {
  cancelAnimationFrame(animId);
  const config = NIVELES_PACMAN[nivelIdx];
  const bonus = BONUS_FRUTAS[config.bonusFruta];
  if (bonus) puntaje += bonus.puntos;

  if (nivelIdx + 1 >= NIVELES_PACMAN.length) {
    mostrarFinPartida();
    return;
  }
  setTimeout(() => cargarNivel(nivelIdx + 1), 2000);
}


/**
 * Muestra modal de fin de partida y guarda puntaje.
 */
function mostrarFinPartida() {
  const el = document.getElementById('modalFinPacman');
  const modal = new Modal(el, { backdrop: 'static' });
  document.getElementById('finPuntaje').textContent = puntaje;
  modal.show();
  guardarPuntaje();
}


/**
 * Envía puntaje al servidor.
 */
async function guardarPuntaje() {
  try {
    await fetch('/api/ranking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombreJugador,
        puntaje,
        juego: 'pacman',
        modo: modoJuego === 'individual' ? 'individual' : 'multijugador',
        nivel: NIVELES_PACMAN[nivelIdx].numero
      })
    });
  } catch (e) {
    console.error('Error al guardar puntaje PacMan:', e.message);
  }
}


/**
 * Dibuja frame actual.
 */
function dibujar() {
  const config = NIVELES_PACMAN[nivelIdx];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(canvasMapa, 0, 0);

  if (config.visibilidadReducida) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const px = pacman.posRender.x * tamTile + tamTile / 2;
    const py = pacman.posRender.y * tamTile + tamTile / 2;
    const grad = ctx.createRadialGradient(px, py, 0, px, py, tamTile * 5);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.95)');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, tamTile * 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.drawImage(canvasMapa, 0, 0);
  }

  ctx.fillStyle = '#ffe000';
  ctx.beginPath();
  ctx.arc(
    pacman.posRender.x * tamTile + tamTile / 2,
    pacman.posRender.y * tamTile + tamTile / 2,
    tamTile / 2 - 2, 0.2, Math.PI * 2 - 0.2
  );
  ctx.fill();

  fantasmas.forEach((f) => {
    ctx.fillStyle = f.asustado ? '#4444ff' : f.color;
    ctx.beginPath();
    ctx.arc(
      f.posRender.x * tamTile + tamTile / 2,
      f.posRender.y * tamTile + tamTile / 2,
      tamTile / 2 - 1, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '8px Inter';
    ctx.fillText(
      f.nombre[0],
      f.posRender.x * tamTile + 4,
      f.posRender.y * tamTile + tamTile / 2 + 3
    );
  });

  ctx.strokeStyle = '#ffe000';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}


/**
 * Actualiza elementos del HUD.
 */
function actualizarHUD() {
  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  };
  set('hudPacNombre', nombreJugador);
  set('hudPacPuntaje', puntaje);
  set('hudPacNivel', NIVELES_PACMAN[nivelIdx]?.numero || 1);
  set('hudPacVidas', vidas);
  set('hudPacApuntes', apuntesRestantes);
}


/**
 * Muestra mensaje de inicio de nivel.
 * @param {string} nombre - Nombre del nivel
 */
function mostrarMensajeNivel(nombre) {
  const el = document.getElementById('mensajeNivelPacman');
  if (!el) return;
  el.textContent = nombre;
  el.classList.remove('d-none');
  setTimeout(() => el.classList.add('d-none'), 2500);
}


/**
 * Reproduce un beep con Web Audio API.
 * @param {number} freq - Frecuencia Hz
 * @param {number} dur - Duración segundos
 */
function reproducirSonido(freq, dur) {
  if (!audioCtx) audioCtx = new AudioContext();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = freq;
  gain.gain.value = 0.1;
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
}


/**
 * Configura ResizeObserver del canvas.
 */
function configurarResize() {
  const cont = document.getElementById('canvasContainerPacman');
  if (!cont) return;
  const obs = new ResizeObserver(() => {
    tamTile = window.innerWidth < 768 ? 14 : 16;
    const config = NIVELES_PACMAN[nivelIdx] || NIVELES_PACMAN[0];
    const m = MAPAS[config.mapa];
    if (m) {
      canvas.width = m[0].length * tamTile;
      canvas.height = m.length * tamTile;
    }
  });
  obs.observe(cont);
}


/**
 * Controles de teclado y D-pad táctil.
 */
function configurarControles() {
  const dirs = {
    ArrowUp: { dx: 0, dy: -1 },
    ArrowDown: { dx: 0, dy: 1 },
    ArrowLeft: { dx: -1, dy: 0 },
    ArrowRight: { dx: 1, dy: 0 }
  };
  document.addEventListener('keydown', (e) => {
    if (dirs[e.key]) pacman.siguienteDir = dirs[e.key];
  });

  document.querySelectorAll('[data-dir]').forEach((btn) => {
    const activar = (e) => {
      e.preventDefault();
      const d = btn.dataset.dir;
      const map = {
        up: { dx: 0, dy: -1 }, down: { dx: 0, dy: 1 },
        left: { dx: -1, dy: 0 }, right: { dx: 1, dy: 0 }
      };
      if (pacman) pacman.siguienteDir = map[d];
      btn.classList.add('activo');
    };
    const desactivar = () => btn.classList.remove('activo');
    btn.addEventListener('pointerdown', activar, { passive: false });
    btn.addEventListener('pointerup', desactivar);
    btn.addEventListener('pointerleave', desactivar);
  });
}


/**
 * Cierra navbar al hacer clic en enlaces.
 */
function cerrarNavbar() {
  document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      const col = document.querySelector('.navbar-collapse.show');
      if (col) bootstrap.Collapse.getInstance(col)?.hide();
    });
  });
}
