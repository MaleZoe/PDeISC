/**
 * ============================================================================
 * CONTROLADOR DE PUNTUACIONES (scores.controller.js)
 * ============================================================================
 * Explicación didáctica:
 * Contiene los controladores para gestionar las peticiones REST relacionadas con
 * el almacenamiento y consulta de la tabla de posiciones (Ranking).
 * 
 * Nivel 3 de Validación (Backend):
 * Nunca debemos confiar en que las validaciones del frontend son suficientes,
 * ya que un atacante o usuario avanzado podría enviar peticiones directas vía
 * Postman, cURL o la consola del navegador. Aquí verificamos tipos de datos,
 * longitudes exactas y sanitizamos posibles etiquetas HTML (XSS).
 */

import ScoreModel from '../models/Score.model.js';
import CONFIG from '../context/config.js';

/**
 * Función helper privada para sanitizar cadenas en el backend (prevención básica de XSS).
 * Elimina etiquetas HTML y recorta espacios superfluos.
 * @param {string} input 
 * @returns {string} Cadena limpia y segura
 */
function sanitizarTexto(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/["']/g, '');
}

/**
 * Endpoint POST /api/score
 * Guarda el resultado de una partida en la base de datos MySQL.
 */
export async function guardarScore(req, res) {
  try {
    const { nombre, puntos, tiempo } = req.body;

    // =========================================================================
    // VALIDACIONES DE NIVEL 3 (BACKEND / SERVIDOR)
    // =========================================================================

    // 1. Validar presencia y no vacío
    if (!nombre || puntos === undefined || puntos === null || !tiempo) {
      return res.status(400).json({
        exito: false,
        error: 'Datos incompletos. Se requieren los campos: nombre, puntos y tiempo.'
      });
    }

    // 2. Validar tipos de datos strictly
    if (typeof nombre !== 'string' || typeof puntos !== 'number' || typeof tiempo !== 'number') {
      return res.status(400).json({
        exito: false,
        error: 'Tipos de datos inválidos. `nombre` debe ser texto, `puntos` y `tiempo` deben ser números enteros.'
      });
    }

    // 3. Sanitizar nombre y validar longitud (entre 3 y 30 caracteres)
    const nombreLimpio = sanitizarTexto(nombre);
    if (
      nombreLimpio.length < CONFIG.VALIDACIONES.NOMBRE_LONGITUD_MINIMA ||
      nombreLimpio.length > CONFIG.VALIDACIONES.NOMBRE_LONGITUD_MAXIMA
    ) {
      return res.status(400).json({
        exito: false,
        error: `El nombre debe tener entre ${CONFIG.VALIDACIONES.NOMBRE_LONGITUD_MINIMA} y ${CONFIG.VALIDACIONES.NOMBRE_LONGITUD_MAXIMA} caracteres.`
      });
    }

    // 4. Validar coherencia numérica (no se permiten puntos negativos ni tiempo 0 o negativo)
    if (puntos < 0 || !Number.isInteger(puntos) || tiempo <= 0 || !Number.isInteger(tiempo)) {
      return res.status(400).json({
        exito: false,
        error: 'Los puntos y el tiempo deben ser valores numéricos positivos coherentes.'
      });
    }

    // =========================================================================
    // PERSISTENCIA EN MYSQL
    // =========================================================================

    // Insertamos el registro en la tabla `score`
    const resultado = await ScoreModel.guardarScore(nombreLimpio, puntos, tiempo);

    // Calculamos qué posición ocupa en el ranking para dar un feedback gratificante en la UI
    const posicionRanking = await ScoreModel.calcularPosicionRanking(puntos, tiempo);

    console.log(`🏆 Nuevo score registrado en MySQL [ID ${resultado.id}]: ${nombreLimpio} (${puntos} pts - ${tiempo}s) -> Posición en Top: #${posicionRanking}`);

    return res.status(201).json({
      exito: true,
      mensaje: '¡Puntuación registrada exitosamente en MySQL!',
      datos: {
        id: resultado.id,
        nombre: nombreLimpio,
        puntos,
        tiempo,
        posicionRanking
      }
    });

  } catch (error) {
    console.error('❌ Error crítico al procesar POST /api/score:', error);
    return res.status(500).json({
      exito: false,
      error: 'Error interno del servidor al intentar almacenar la puntuación en la base de datos.'
    });
  }
}

/**
 * Endpoint GET /api/score
 * Retorna la lista ordenada de puntuaciones (Tabla de Posiciones).
 */
export async function obtenerScores(req, res) {
  try {
    // Permitimos consultar opcionalmente con un límite vía query params (?limite=10)
    const limiteSolicitado = req.query.limite ? parseInt(req.query.limite, 10) : CONFIG.TOP_RANKING_LIMIT;
    const limiteSeguro = (!isNaN(limiteSolicitado) && limiteSolicitado > 0 && limiteSolicitado <= 100)
      ? limiteSolicitado
      : CONFIG.TOP_RANKING_LIMIT;

    const scores = await ScoreModel.obtenerTopScores(limiteSeguro);

    return res.status(200).json({
      exito: true,
      total: scores.length,
      scores
    });

  } catch (error) {
    console.warn('⚠️ No se pudo consultar MySQL (o no está inicializado). Retornando ranking de respaldo.');
    const respaldoScores = [
      { id: 1, nombre: 'Salvador (Pro)', puntos: 1350, tiempo: 20, fecha_formateada: '13/07/2026 18:00' },
      { id: 2, nombre: 'Ada Lovelace', puntos: 1250, tiempo: 25, fecha_formateada: '13/07/2026 14:30' },
      { id: 3, nombre: 'Alan Turing', puntos: 1100, tiempo: 32, fecha_formateada: '12/07/2026 19:15' },
      { id: 4, nombre: 'Grace Hopper', puntos: 980, tiempo: 40, fecha_formateada: '11/07/2026 10:20' },
      { id: 5, nombre: 'Linus Torvalds', puntos: 850, tiempo: 45, fecha_formateada: '10/07/2026 16:45' }
    ];
    return res.status(200).json({
      exito: true,
      fuente: 'respaldo',
      total: respaldoScores.length,
      scores: respaldoScores
    });
  }
}

export default {
  guardarScore,
  obtenerScores
};
