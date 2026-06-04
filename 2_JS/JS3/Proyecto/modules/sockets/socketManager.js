/**
 * Módulo: socketManager.js
 * Responsabilidad: Gestión de salas y eventos Socket.IO del servidor.
 */

const salas = new Map();
const CODIGO_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';


/**
 * Genera un código de sala de 4 caracteres.
 * @returns {string} Código alfanumérico
 */
function generarCodigoSala() {
  let codigo = '';
  for (let i = 0; i < 4; i++) {
    const idx = Math.floor(Math.random() * CODIGO_CHARS.length);
    codigo += CODIGO_CHARS[idx];
  }
  return salas.has(codigo) ? generarCodigoSala() : codigo;
}


/**
 * Obtiene o crea el estado de una sala.
 * @param {string} codigo - Código de sala
 * @returns {Object} Estado de la sala
 */
function obtenerSala(codigo) {
  if (!salas.has(codigo)) {
    salas.set(codigo, {
      codigo,
      jugadores: [],
      juego: null,
      estadoSnake: null,
      estadoPacman: null,
      tickSnake: null
    });
  }
  return salas.get(codigo);
}


/**
 * Elimina sala si no quedan jugadores.
 * @param {string} codigo - Código de sala
 */
function limpiarSala(codigo) {
  const sala = salas.get(codigo);
  if (sala && sala.jugadores.length === 0) {
    if (sala.tickSnake) clearInterval(sala.tickSnake);
    salas.delete(codigo);
  }
}


/**
 * Inicializa todos los manejadores de Socket.IO.
 * @param {import('socket.io').Server} io - Instancia de Socket.IO
 */
export function inicializarSockets(io) {
  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on('crearSala', (datos) => {
      const codigo = generarCodigoSala();
      const sala = obtenerSala(codigo);
      sala.juego = datos?.juego || 'snake';
      sala.jugadores = [{ id: socket.id, nombre: datos?.nombre || '' }];
      socket.join(codigo);
      socket.data.codigoSala = codigo;
      socket.emit('salaCreada', { codigo, juego: sala.juego });
      console.log(`Sala creada: ${codigo}`);
    });

    socket.on('unirseSala', (datos) => {
      const codigo = (datos?.codigo || '').toUpperCase();
      if (!salas.has(codigo)) {
        socket.emit('salaNoencontrada', {
          mensaje: 'La sala no existe. Verificá el código.'
        });
        return;
      }
      const sala = salas.get(codigo);
      if (sala.jugadores.length >= 2) {
        socket.emit('salaLlena', {
          mensaje: 'La sala ya está llena.'
        });
        return;
      }
      sala.jugadores.push({
        id: socket.id,
        nombre: datos?.nombre || ''
      });
      socket.join(codigo);
      socket.data.codigoSala = codigo;
      io.to(codigo).emit('jugadorUnido', {
        codigo,
        jugadores: sala.jugadores.map((j) => j.nombre),
        listo: sala.jugadores.length === 2
      });
    });

    socket.on('movimientoSnake', (datos) => {
      const codigo = socket.data.codigoSala;
      if (!codigo) return;
      const sala = salas.get(codigo);
      if (!sala) return;
      if (!sala.estadoSnake) {
        sala.estadoSnake = {
          serpientes: {},
          direcciones: {},
          puntajes: {},
          nivel: 1
        };
      }
      const dir = datos?.direccion;
      if (dir && sala.estadoSnake.direcciones[socket.id] !== dir) {
        sala.estadoSnake.direcciones[socket.id] = dir;
      }
    });

    socket.on('movimientoPacman', (datos) => {
      const codigo = socket.data.codigoSala;
      if (!codigo) return;
      const sala = salas.get(codigo);
      if (!sala?.estadoPacman) return;
      const dir = datos?.direccion;
      if (dir) {
        sala.estadoPacman.entradas[socket.id] = dir;
      }
    });

    socket.on('reconectar', (datos) => {
      const codigo = (datos?.codigo || '').toUpperCase();
      if (salas.has(codigo)) {
        socket.join(codigo);
        socket.data.codigoSala = codigo;
        socket.emit('jugadorUnido', { codigo, reconectado: true });
      }
    });

    socket.on('disconnect', () => {
      const codigo = socket.data.codigoSala;
      if (codigo && salas.has(codigo)) {
        const sala = salas.get(codigo);
        sala.jugadores = sala.jugadores.filter((j) => j.id !== socket.id);
        io.to(codigo).emit('jugadorDesconectado', {
          mensaje: 'Tu oponente se desconectó',
          socketId: socket.id
        });
        limpiarSala(codigo);
      }
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  iniciarLoopSnake(io);
}


/**
 * Loop autoritativo del servidor para Snake multijugador.
 * @param {import('socket.io').Server} io - Instancia Socket.IO
 */
function iniciarLoopSnake(io) {
  setInterval(() => {
    salas.forEach((sala, codigo) => {
      if (sala.juego !== 'snake' || sala.jugadores.length < 2) return;
      if (!sala.estadoSnake) return;
      io.to(codigo).emit('estadoJuegoSnake', {
        direcciones: sala.estadoSnake.direcciones,
        puntajes: sala.estadoSnake.puntajes,
        nivel: sala.estadoSnake.nivel,
        timestamp: Date.now()
      });
    });
  }, 150);
}
