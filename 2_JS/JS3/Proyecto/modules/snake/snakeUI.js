/**
 * Módulo: snakeUI.js
 * Responsabilidad: HUD, modales y validación de UI de Snake.
 */

import { Modal } from 'bootstrap';

const PATRON_NOMBRE = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]{3,20}$/;

export const MENSAJES_HUMOR = [
  '¡Chiqui perdió el maletín de los sobres!',
  '¡La AFA pidió las cuentas!',
  '¡Se le acabaron los contratos truchos!',
  '¡La tribuna lo abandonó!',
  '¡El VAR anuló el gol de la serpiente!',
  '¡Le confiscaron el billete dorado!',
  '¡La auditoría lo atrapó en offside!',
  '¡Perdió el partido contra la honestidad!',
  '¡El directorio lo expulsó del vestuario!',
  '¡El sobre se comió a Chiqui!'
];


let modalRegistro = null;
let modalGameOver = null;
let modalNivel = null;
let modalModo = null;
let modalRanking = null;


/**
 * Inicializa referencias a modales Bootstrap.
 */
export function inicializarModales() {
  const elModo = document.getElementById('modalModo');
  const elReg = document.getElementById('modalRegistro');
  const elGO = document.getElementById('modalGameOver');
  const elNiv = document.getElementById('modalNivel');
  const elRank = document.getElementById('modalRanking');

  if (elModo) modalModo = new Modal(elModo, { backdrop: 'static' });
  if (elReg) modalRegistro = new Modal(elReg, { backdrop: 'static' });
  if (elGO) modalGameOver = new Modal(elGO, { backdrop: 'static' });
  if (elNiv) modalNivel = new Modal(elNiv, { backdrop: 'static' });
  if (elRank) modalRanking = new Modal(elRank);
}


/**
 * Valida el nombre del jugador en tiempo real.
 * @param {HTMLInputElement} input - Campo de nombre
 * @param {HTMLButtonElement} btn - Botón de confirmar
 */
export function validarNombre(input, btn) {
  const valor = input.value.trim();
  const valido = PATRON_NOMBRE.test(valor);
  input.classList.toggle('is-valid', valido);
  input.classList.toggle('is-invalid', !valido && valor.length > 0);
  if (btn) btn.disabled = !valido;
  return valido;
}


/**
 * Muestra modal de selección de modo.
 * @param {Function} alElegir - Callback(modo)
 */
export function mostrarModalModo(alElegir) {
  document.getElementById('btnUnJugador')?.addEventListener('click', () => {
    modalModo?.hide();
    alElegir('individual');
  }, { once: true });
  document.getElementById('btnMultijugador')?.addEventListener('click', () => {
    modalModo?.hide();
    alElegir('multijugador');
  }, { once: true });
  modalModo?.show();
}


/**
 * Muestra modal de registro.
 * @returns {Promise<string>} Nombre validado
 */
export function mostrarRegistro() {
  return new Promise((resolver) => {
    const input = document.getElementById('inputNombre');
    const btn = document.getElementById('btnConfirmarNombre');
    if (!input || !btn) return resolver('');

    const handler = () => {
      if (!validarNombre(input, btn)) return;
      const nombre = input.value.trim();
      sessionStorage.setItem('nombreJugador', nombre);
      modalRegistro?.hide();
      resolver(nombre);
    };

    input.addEventListener('input', () => validarNombre(input, btn));
    btn.addEventListener('click', handler, { once: true });
    modalRegistro?.show();
  });
}


/**
 * Actualiza el HUD del juego.
 * @param {Object} datos - nombre, puntaje, nivel, vidas, powerup
 */
export function actualizarHUD(datos) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  set('hudNombre', datos.nombre);
  set('hudPuntaje', datos.puntaje);
  set('hudNivel', datos.nivel);
  set('hudVidas', datos.vidas);
  set('hudPowerup', datos.powerup || '—');
}


/**
 * Muestra transición de nivel con cuenta regresiva.
 * @param {string} mensaje - Mensaje del nivel
 * @returns {Promise<void>}
 */
export function mostrarTransicionNivel(mensaje) {
  return new Promise((resolver) => {
    const elMsg = document.getElementById('nivelMensaje');
    const elCnt = document.getElementById('nivelCuenta');
    if (elMsg) elMsg.textContent = mensaje;
    modalNivel?.show();
    let cuenta = 3;
    const tick = () => {
      if (elCnt) elCnt.textContent = cuenta;
      if (cuenta <= 0) {
        modalNivel?.hide();
        resolver();
        return;
      }
      cuenta--;
      setTimeout(tick, 1000);
    };
    tick();
  });
}


/**
 * Muestra modal de fin de partida.
 * @param {number} puntaje - Puntaje final
 * @param {number} nivel - Nivel alcanzado
 */
export function mostrarGameOver(puntaje, nivel) {
  const msg = MENSAJES_HUMOR[
    Math.floor(Math.random() * MENSAJES_HUMOR.length)
  ];
  const elMsg = document.getElementById('gameOverMensaje');
  const elPts = document.getElementById('gameOverPuntaje');
  if (elMsg) elMsg.textContent = msg;
  if (elPts) elPts.textContent = puntaje;
  modalGameOver?.show();
}


/**
 * Envía puntaje al ranking vía API.
 * @param {Object} datos - Entrada de ranking
 */
export async function enviarPuntaje(datos) {
  try {
    const res = await fetch('/api/ranking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!res.ok) {
      const err = await res.json();
      console.error('Error al guardar:', err.error);
    }
  } catch (e) {
    console.error('Error de red al guardar puntaje:', e.message);
  }
}


/**
 * Cierra el menú hamburguesa al hacer clic en un enlace.
 */
export function cerrarNavbarAlClick() {
  document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      const collapse = document.querySelector('.navbar-collapse');
      if (collapse?.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        bsCollapse?.hide();
      }
    });
  });
}
