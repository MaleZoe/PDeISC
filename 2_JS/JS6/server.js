/**
 * ============================================================================
 * TRABAJO PRÁCTICO PROFESIONAL: JUEGO DEL AHORCADO FULL STACK
 * ARCHIVO PRINCIPAL DEL SERVIDOR (server.js)
 * ============================================================================
 * Explicación didáctica:
 * Este es el punto de entrada principal del servidor Node.js desarrollado con Express.
 * Cumpliendo de forma estricta el requerimiento, se utilizan exclusivamente
 * ES Modules (import/export), eliminando por completo el uso de CommonJS (require).
 * 
 * Arquitectura:
 * - Puerto: 3000 (o variable de entorno PORT).
 * - Middleware JSON & CORS para procesar peticiones asíncronas desde el cliente.
 * - Archivos estáticos servidos desde el sistema modular (/pages, /styles, /scripts, /modules).
 * - API REST montada bajo el prefijo /api.
 * - Inicialización autómata y verificación del pool MySQL (Base de datos: Score).
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importamos los enrutadores de la API REST
import palabrasRoutes from './routes/palabras.routes.js';
import scoresRoutes from './routes/scores.routes.js';

// Importamos el inicializador de la base de datos MySQL
import { checkAndInitDatabase } from './database/connection.js';

// Importamos configuración central del backend
import CONFIG from './context/config.js';

// Configuración inicial del entorno
dotenv.config();

// Recreación de __dirname y __filename en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialización de la aplicación Express
const app = express();
const PUERTO = process.env.PORT || CONFIG.PUERTO_DEFECTO;

// ============================================================================
// CONFIGURACIÓN DE MIDDLEWARES
// ============================================================================

// 1. CORS: Permite que el frontend consulte nuestra API REST sin problemas de dominios cruzados
app.use(cors());

// 2. Parser JSON: Permite procesar los datos de las peticiones POST (ej: { nombre, puntos, tiempo })
app.use(express.json());

// 3. Parser URL-Encoded: Maneja datos enviados mediante formularios estándar
app.use(express.urlencoded({ extended: true }));

// 4. Servidor de Archivos Estáticos: Servimos la carpeta raíz del proyecto para que
// los recursos en /pages, /styles, /scripts y /modules estén disponibles para el navegador.
app.use(express.static(__dirname));

// ============================================================================
// ENRUTAMIENTO VISTAS HTML (FRONTEND)
// ============================================================================

// Ruta Raíz (/): Redirige o sirve directamente la vista principal del juego
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Ruta /ranking: Sirve la tabla de posiciones y descargas de diplomas en PDF
app.get('/ranking', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'ranking.html'));
});

// Ruta /instrucciones: Sirve la guía pedagógica y reglas de juego
app.get('/instrucciones', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'instrucciones.html'));
});

// ============================================================================
// ENRUTAMIENTO API REST (BACKEND)
// ============================================================================

// Montamos las rutas REST bajo el prefijo /api
app.use('/api', palabrasRoutes);
app.use('/api', scoresRoutes);

// Manejo de peticiones 404 para endpoints API no definidos
app.use('/api/*', (req, res) => {
  res.status(404).json({
    exito: false,
    error: 'Endpoint API REST no encontrado.'
  });
});

// Manejo genérico para rutas web desconocidas -> Retornar al juego
app.use('*', (req, res) => {
  res.redirect('/');
});

// ============================================================================
// PUESTA EN MARCHA DEL SERVIDOR Y CONEXIÓN A MYSQL
// ============================================================================

async function iniciarServidor() {
  console.clear();
  console.log('====================================================================');
  console.log('🚀 INICIANDO SERVIDOR DEL JUEGO DEL AHORCADO FULL STACK (ES MODULES)');
  console.log('====================================================================');

  // Intentamos inicializar la base de datos MySQL (Score) y la tabla (score)
  await checkAndInitDatabase();

  // Encendemos el servidor en el puerto 3000
  app.listen(PUERTO, () => {
    console.log('====================================================================');
    console.log(`🎮 Servidor Express en ejecución en: http://localhost:${PUERTO}`);
    console.log(`📂 Vistas HTML servidas en:        http://localhost:${PUERTO}/pages`);
    console.log(`📊 Tabla de Posiciones en:         http://localhost:${PUERTO}/ranking`);
    console.log(`🔗 API REST de Palabras en:        http://localhost:${PUERTO}/api/palabra`);
    console.log(`🔗 API REST de Puntuaciones en:    http://localhost:${PUERTO}/api/score`);
    console.log('====================================================================');
    console.log('👉 Presione CTRL+C para detener el servidor.');
  });
}

iniciarServidor();
