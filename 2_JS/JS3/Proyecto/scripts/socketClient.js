/**
 * Módulo: socketClient.js
 * Responsabilidad: Wrapper singleton de Socket.IO en el cliente.
 */

let socket = null;
let intentosReconexion = 0;
const MAX_INTENTOS = 5;


/**
 * Muestra toast de conexión en español.
 * @param {string} mensaje - Texto del toast
 * @param {string} tipo - 'success' | 'danger' | 'warning'
 */
function mostrarToast(mensaje, tipo = 'warning') {
  const cont = document.getElementById('toastConexion');
  if (!cont) return;
  const cuerpo = cont.querySelector('.toast-body');
  if (cuerpo) cuerpo.textContent = mensaje;
  cont.className = `toast align-items-center text-bg-${tipo}`;
  const toast = new bootstrap.Toast(cont);
  toast.show();
}


/**
 * Conecta al servidor Socket.IO (singleton).
 * @returns {Object} Instancia del socket
 */
export function conectar() {
  if (socket?.connected) return socket;

  socket = io({
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 8000
  });

  socket.on('connect', () => {
    intentosReconexion = 0;
    mostrarToast('Conexión restaurada', 'success');
    console.log('Socket conectado');
  });

  socket.on('disconnect', () => {
    mostrarToast('Conexión perdida. Reintentando...', 'danger');
    console.log('Socket desconectado');
  });

  socket.io.on('reconnect_attempt', () => {
    intentosReconexion++;
    const delay = Math.min(1000 * 2 ** intentosReconexion, 8000);
    console.log(`Reintento ${intentosReconexion}, espera ${delay}ms`);
  });

  socket.io.on('reconnect_failed', () => {
    mostrarToast('No se pudo reconectar al servidor', 'danger');
  });

  return socket;
}


/**
 * Desconecta el socket.
 */
export function desconectar() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}


/**
 * Emite un evento al servidor.
 * @param {string} evento - Nombre del evento
 * @param {Object} datos - Payload
 */
export function emitir(evento, datos = {}) {
  if (!socket) conectar();
  socket.emit(evento, datos);
}


/**
 * Registra listener de evento.
 * @param {string} evento - Nombre del evento
 * @param {Function} callback - Handler
 */
export function escuchar(evento, callback) {
  if (!socket) conectar();
  socket.on(evento, callback);
}


/**
 * Elimina listener de evento.
 * @param {string} evento - Nombre del evento
 * @param {Function} [callback] - Handler específico
 */
export function dejarDeEscuchar(evento, callback) {
  if (!socket) return;
  if (callback) socket.off(evento, callback);
  else socket.off(evento);
}
