/**
 * ============================================================================
 * MÓDULO DE CONFIGURACIÓN Y CONSTANTES COMPARTIDAS DEL BACKEND
 * ============================================================================
 * Explicación didáctica:
 * Centralizar las constantes mágicas y configuraciones del negocio en un solo archivo
 * (/context/config.js) permite un mantenimiento sencillo, evita el uso de valores
 * hardcodeados dispersos en el código y facilita la adaptabilidad del sistema.
 */

export const CONFIG = {
  PUERTO_DEFECTO: 3000,
  JUEGO: {
    INTENTOS_MAXIMOS: 6,
    PUNTOS_POR_LETRA: 100,
    BONUS_POR_INTENTO_RESTANTE: 150,
    BONUS_TIEMPO_BASE: 500, // Se resta el tiempo transcurrido en segundos
    TIEMPO_PENALIZACION_MULT: 10 // Puntos restados por segundo transcurrido
  },
  VALIDACIONES: {
    NOMBRE_LONGITUD_MINIMA: 3,
    NOMBRE_LONGITUD_MAXIMA: 30,
    REGEX_NOMBRE: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-_0-9]+$/
  },
  API_EXTERNA_PALABRAS: 'https://random-word-api.herokuapp.com/word?lang=es',
  TOP_RANKING_LIMIT: 20
};

export default CONFIG;
