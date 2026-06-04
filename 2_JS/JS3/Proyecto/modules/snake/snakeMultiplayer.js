/**
 * Módulo: snakeMultiplayer.js
 * Responsabilidad: Eventos Socket.IO para Snake multijugador.
 */

import {
  conectar,
  emitir,
  escuchar,
  dejarDeEscuchar
} from '../../scripts/socketClient.js';


let codigoSalaActual = null;


/**
 * Crea una sala multijugador de Snake.
 * @param {string} nombre - Nombre del jugador
 * @returns {Promise<string>} Código de sala
 */
export function crearSalaSnake(nombre) {
  conectar();
  return new Promise((resolver) => {
    const handler = (datos) => {
      codigoSalaActual = datos.codigo;
      dejarDeEscuchar('salaCreada', handler);
      resolver(datos.codigo);
    };
    escuchar('salaCreada', handler);
    emitir('crearSala', { juego: 'snake', nombre });
  });
}


/**
 * Une al jugador a una sala existente.
 * @param {string} codigo - Código de 4 caracteres
 * @param {string} nombre - Nombre del jugador
 */
export function unirseSalaSnake(codigo, nombre) {
  conectar();
  codigoSalaActual = codigo.toUpperCase();
  emitir('unirseSala', { codigo: codigoSalaActual, nombre });
}


/**
 * Envía dirección al servidor.
 * @param {string} direccion - Dirección del movimiento
 */
export function enviarMovimiento(direccion) {
  emitir('movimientoSnake', { direccion });
}


/**
 * Registra callback de estado del juego.
 * @param {Function} callback - Recibe estado del servidor
 */
export function alRecibirEstado(callback) {
  escuchar('estadoJuegoSnake', callback);
}


/**
 * Registra eventos de sala multijugador.
 * @param {Object} handlers - Mapa de callbacks
 */
export function registrarEventosMultijugador(handlers) {
  if (handlers.jugadorUnido) {
    escuchar('jugadorUnido', handlers.jugadorUnido);
  }
  if (handlers.salaNoencontrada) {
    escuchar('salaNoencontrada', handlers.salaNoencontrada);
  }
  if (handlers.salaLlena) {
    escuchar('salaLlena', handlers.salaLlena);
  }
  if (handlers.jugadorDesconectado) {
    escuchar('jugadorDesconectado', handlers.jugadorDesconectado);
  }
  if (handlers.juegoTerminado) {
    escuchar('juegoTerminado', handlers.juegoTerminado);
  }
}


export function obtenerCodigoSala() {
  return codigoSalaActual;
}
