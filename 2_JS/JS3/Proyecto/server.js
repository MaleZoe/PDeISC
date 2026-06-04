/**
 * Punto de entrada: Express + Socket.IO + rutas estáticas.
 */

import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { obtenerTop10, guardarPuntaje } from './modules/ranking/ranking.js';
import { inicializarSockets } from './modules/sockets/socketManager.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUERTO = process.env.PORT || 3000;
const app = express();
const servidor = createServer(app);
const io = new Server(servidor);

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (_req, res) => {
  res.sendFile(join(__dirname, 'pages/index.html'));
});

app.get('/snake', (_req, res) => {
  res.sendFile(join(__dirname, 'pages/snake.html'));
});

app.get('/pacman', (_req, res) => {
  res.sendFile(join(__dirname, 'pages/pacman.html'));
});

app.get('/api/ranking', async (req, res) => {
  try {
    const juego = req.query.juego || 'snake';
    const top = await obtenerTop10(juego);
    res.json(top);
  } catch (err) {
    console.error('Error al leer ranking:', err.message);
    res.status(500).json({ error: 'Error al cargar el ranking' });
  }
});

/**
 * Valida el cuerpo de una entrada de ranking.
 * @param {Object} cuerpo - Datos recibidos
 * @returns {{ valido: boolean, error?: string }}
 */
function validarEntrada(cuerpo) {
  const nombreRegex = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]{3,20}$/;
  if (!cuerpo.nombre || !nombreRegex.test(cuerpo.nombre)) {
    return {
      valido: false,
      error: 'El nombre debe tener entre 3 y 20 letras.'
    };
  }
  if (!Number.isInteger(cuerpo.puntaje) || cuerpo.puntaje < 0) {
    return {
      valido: false,
      error: 'El puntaje debe ser un entero positivo.'
    };
  }
  if (!['snake', 'pacman'].includes(cuerpo.juego)) {
    return { valido: false, error: 'Juego inválido.' };
  }
  if (!['individual', 'multijugador'].includes(cuerpo.modo)) {
    return { valido: false, error: 'Modo inválido.' };
  }
  if (!Number.isInteger(cuerpo.nivel) || cuerpo.nivel < 1 ||
      cuerpo.nivel > 10) {
    return {
      valido: false,
      error: 'El nivel debe ser un entero entre 1 y 10.'
    };
  }
  return { valido: true };
}


app.post('/api/ranking', async (req, res) => {
  const validacion = validarEntrada(req.body);
  if (!validacion.valido) {
    return res.status(400).json({ error: validacion.error });
  }
  try {
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const anio = String(ahora.getFullYear()).slice(-2);
    const hora = String(ahora.getHours()).padStart(2, '0');
    const min = String(ahora.getMinutes()).padStart(2, '0');
    const entrada = await guardarPuntaje({
      nombre: req.body.nombre.trim(),
      puntaje: req.body.puntaje,
      juego: req.body.juego,
      modo: req.body.modo,
      nivel: req.body.nivel,
      fecha: `${dia}/${mes}/${anio}`,
      hora: `${hora}:${min}`
    });
    res.status(201).json({
      mensaje: 'Puntaje guardado correctamente',
      entrada
    });
  } catch (err) {
    console.error('Error al guardar puntaje:', err.message);
    res.status(500).json({ error: 'Error interno al guardar' });
  }
});

inicializarSockets(io);

servidor.listen(PUERTO, () => {
  console.log(
    `Servidor de Juegos Clásicos activo en http://localhost:${PUERTO}`
  );
});
