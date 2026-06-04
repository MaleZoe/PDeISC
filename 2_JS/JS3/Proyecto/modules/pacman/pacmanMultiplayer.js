/**
 * Módulo: pacmanMultiplayer.js
 * Responsabilidad: Eventos Socket.IO para PacMan multijugador.
 */

import {
  conectar,
  emitir,
  escuchar,
  dejarDeEscuchar
} from '../../scripts/socketClient.js';


/**
 * Crea sala para PacMan cooperativo o versus.
 * @param {string} nombre - Nombre del jugador
 * @param {string} modo - 'cooperativo' | 'versus'
 */
export function crearSalaPacman(nombre, modo) {
  conectar();
  return new Promise((resolver) => {
    const handler = (datos) => {
      dejarDeEscuchar('salaCreada', handler);
      resolver(datos.codigo);
    };
    escuchar('salaCreada', handler);
    emitir('crearSala', { juego: 'pacman', nombre, modo });
  });
}


/**
 * Une a sala de PacMan.
 * @param {string} codigo - Código de sala
 * @param {string} nombre - Nombre del jugador
 */
export function unirseSalaPacman(codigo, nombre) {
  conectar();
  emitir('unirseSala', { codigo: codigo.toUpperCase(), nombre });
}


/**
 * Envía movimiento de PacMan o fantasma controlado.
 * @param {string} direccion - Dirección
 * @param {string} rol - 'pacman' | 'fantasma'
 */
export function enviarMovimientoPacman(direccion, rol = 'pacman') {
  emitir('movimientoPacman', { direccion, rol });
}


/**
 * Escucha estado sincronizado del juego.
 * @param {Function} callback - Handler del estado
 */
export function alRecibirEstadoPacman(callback) {
  escuchar('estadoJuegoPacman', callback);
}


/**
 * Registra eventos de multijugador PacMan.
 * @param {Object} handlers - Callbacks por evento
 */
export function registrarEventosPacman(handlers) {
  const eventos = [
    'jugadorUnido', 'salaNoencontrada', 'salaLlena',
    'jugadorDesconectado', 'puntoRecolectado',
    'vidasActualizadas', 'nivelCompletado', 'juegoTerminado'
  ];
  eventos.forEach((ev) => {
    if (handlers[ev]) escuchar(ev, handlers[ev]);
  });
}
