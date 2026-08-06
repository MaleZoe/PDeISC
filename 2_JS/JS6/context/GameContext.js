/**
 * ============================================================================
 * CONTEXTO DE JUEGO Y CONFIGURACIÓN DEL CLIENTE (GameContext.js)
 * ============================================================================
 * Explicación didáctica:
 * Módulo ES6 que exporta la configuración y parámetros del juego para el frontend.
 * Mantiene coherencia con el backend al definir los mismos límites e incrementadores.
 */

export const GAME_CONFIG = {
  API: {
    OBTENER_PALABRA: '/api/palabra',
    SCORE: '/api/score'
  },
  JUEGO: {
    INTENTOS_MAXIMOS: 6,
    PUNTOS_POR_LETRA: 100,
    BONUS_POR_INTENTO_RESTANTE: 150,
    BONUS_TIEMPO_BASE: 500,
    PENALIZACION_SEGUNDO: 10
  },
  TECLADO_ALFABETO: [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M'
  ]
};

/**
 * Estado global simplificado para compartir información entre vistas/controladores si es necesario.
 */
export const GameContext = {
  ultimaPartida: null,
  guardarUltimaPartida(datos) {
    this.ultimaPartida = datos;
    localStorage.setItem('ahorcado_ultima_partida', JSON.stringify(datos));
  },
  obtenerUltimaPartida() {
    if (this.ultimaPartida) return this.ultimaPartida;
    const cache = localStorage.getItem('ahorcado_ultima_partida');
    return cache ? JSON.parse(cache) : null;
  }
};

export default GAME_CONFIG;
