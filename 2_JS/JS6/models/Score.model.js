/**
 * ============================================================================
 * MODELO DE PUNTUACIONES (Score.model.js)
 * ============================================================================
 * Explicación didáctica:
 * Este archivo implementa el Patrón de Arquitectura MVC (Modelo-Vista-Controlador).
 * El modelo encapsula de manera exclusiva el acceso y persistencia de datos en MySQL.
 * 
 * Seguridad:
 * SIEMPRE utilizamos "Prepared Statements" (Consultas preparadas con '?') al pasar
 * datos ingresados por el usuario. Esto evita de raíz ataques de Inyección SQL (SQLi),
 * ya que el motor de base de datos trata los parámetros como datos escalares y nunca
 * como instrucciones ejecutables.
 */

import { getPool } from '../database/connection.js';
import CONFIG from '../context/config.js';

class ScoreModel {
  /**
   * Inserta un nuevo registro de puntuación en la tabla `score`.
   * @param {string} nombre - Nombre del jugador sanitizado
   * @param {number} puntos - Puntuación entera obtenida en la partida
   * @param {number} tiempo - Duración en segundos transcurridos
   * @returns {Promise<Object>} Objeto con información de la inserción (insertId, éxito)
   */
  async guardarScore(nombre, puntos, tiempo) {
    const pool = getPool();
    // Consulta SQL preparada (?)
    const query = `
      INSERT INTO score (nombre, puntos, tiempo)
      VALUES (?, ?, ?);
    `;

    try {
      const [resultado] = await pool.execute(query, [nombre, puntos, tiempo]);
      return {
        exito: true,
        id: resultado.insertId,
        nombre,
        puntos,
        tiempo
      };
    } catch (error) {
      console.error('❌ Error al guardar puntuación en MySQL:', error.message);
      throw error;
    }
  }

  /**
   * Obtiene la tabla de posiciones ordenada por mayor puntaje y menor tiempo.
   * @param {number} limite - Cantidad máxima de registros a retornar (por defecto 20)
   * @returns {Promise<Array>} Lista ordenada de objetos con las puntuaciones
   */
  async obtenerTopScores(limite = CONFIG.TOP_RANKING_LIMIT) {
    const pool = getPool();
    // El ordenamiento principal es por `puntos DESC` (mayor puntaje primero).
    // Si hay empate de puntos, desempata por `tiempo ASC` (quien lo hizo más rápido gana).
    const query = `
      SELECT 
        id,
        nombre,
        puntos,
        tiempo,
        DATE_FORMAT(fecha, '%d/%m/%Y %H:%i') AS fecha_formateada
      FROM score
      ORDER BY puntos DESC, tiempo ASC
      LIMIT ?;
    `;

    try {
      // Nota: execute en mysql2 no acepta enteros directos en LIMIT salvo si se configura o se pasa como string/entero verificado
      // Por compatibilidad total con mysql2 en consultas preparadas con LIMIT, convertimos a entero estricto
      const [filas] = await pool.query(query, [Number(limite)]);
      return filas;
    } catch (error) {
      console.error('❌ Error al obtener el ranking de MySQL:', error.message);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas y la posición (ranking real) que ocupa un puntaje determinado.
   * @param {number} puntos 
   * @param {number} tiempo 
   * @returns {Promise<number>} Posición en la tabla de ranking (1-indexed)
   */
  async calcularPosicionRanking(puntos, tiempo) {
    const pool = getPool();
    const query = `
      SELECT COUNT(*) + 1 AS posicion
      FROM score
      WHERE puntos > ? OR (puntos = ? AND tiempo < ?);
    `;

    try {
      const [rows] = await pool.execute(query, [puntos, puntos, tiempo]);
      return rows[0].posicion || 1;
    } catch (error) {
      console.error('❌ Error al calcular la posición del ranking:', error.message);
      return 1;
    }
  }
}

export default new ScoreModel();
