/**
 * ============================================================================
 * CLASE PRINCIPAL DEL JUEGO (/modules/Juego.js)
 * ============================================================================
 * Explicación didáctica:
 * Esta clase es el núcleo (Core) del patrón de diseño. Mantiene el Estado Puro del
 * juego independientemente de cómo se muestre en pantalla. Controla estrictamente:
 * - palabra oculta y revelada
 * - letras acertadas e incorrectas usando estructuras `Set` de ES6 para evitar duplicados
 * - intentos restantes (máximo 6)
 * - cálculo algorítmico y coherente del puntaje final
 * - seguimiento del tiempo y estado global ('iniciado', 'ganado', 'perdido')
 */

import { GAME_CONFIG } from '../context/GameContext.js';

export class Juego {
  constructor() {
    this.palabra = '';
    this.pista = '';
    this.categoria = '';
    this.letrasAcertadas = new Set();
    this.letrasIncorrectas = new Set();
    this.intentosMaximos = GAME_CONFIG.JUEGO.INTENTOS_MAXIMOS;
    this.intentosRestantes = this.intentosMaximos;
    this.puntos = 0;
    this.tiempo = 0;
    this.estado = 'espera'; // 'espera' | 'jugando' | 'ganado' | 'perdido'
  }

  /**
   * Configura una nueva partida con la palabra obtenida desde la API o fallback.
   * @param {string} palabra 
   * @param {string} pista 
   * @param {string} categoria 
   */
  inicializar(palabra, pista = 'Sin pista disponible', categoria = 'General') {
    this.palabra = palabra.toUpperCase().trim();
    this.pista = pista;
    this.categoria = categoria;
    this.letrasAcertadas.clear();
    this.letrasIncorrectas.clear();
    this.intentosRestantes = this.intentosMaximos;
    this.puntos = 0;
    this.tiempo = 0;
    this.estado = 'jugando';
  }

  /**
   * Procesa el intento de una letra por parte del jugador (teclado físico o virtual).
   * @param {string} letraRaw 
   * @returns {Object} Resultado del intento: { exito: boolean, esCorrecta: boolean, repeticion: boolean, estado: string }
   */
  intentarLetra(letraRaw) {
    if (this.estado !== 'jugando') {
      return { exito: false, esCorrecta: false, repeticion: false, estado: this.estado, mensaje: 'La partida no está activa.' };
    }

    const letra = letraRaw.toUpperCase().trim();
    if (!letra || letra.length !== 1 || !/^[A-ZÑ]$/.test(letra)) {
      return { exito: false, esCorrecta: false, repeticion: false, estado: this.estado, mensaje: 'Carácter inválido.' };
    }

    // Verificar si la letra ya se intentó previamente (evitar penalizar dos veces)
    if (this.letrasAcertadas.has(letra) || this.letrasIncorrectas.has(letra)) {
      return { exito: true, esCorrecta: this.letrasAcertadas.has(letra), repeticion: true, estado: this.estado, mensaje: 'Letra ya intentada.' };
    }

    // Verificar si la palabra secreta contiene la letra
    const esCorrecta = this.palabra.includes(letra);

    if (esCorrecta) {
      this.letrasAcertadas.add(letra);
      this.verificarVictoria();
    } else {
      this.letrasIncorrectas.add(letra);
      this.intentosRestantes--;
      this.verificarDerrota();
    }

    return {
      exito: true,
      esCorrecta,
      repeticion: false,
      letra,
      intentosRestantes: this.intentosRestantes,
      estado: this.estado
    };
  }

  /**
   * Intenta adivinar la palabra o frase completa de una sola vez.
   * @param {string} palabraIntento 
   * @returns {Object}
   */
  intentarPalabraCompleta(palabraIntento) {
    if (this.estado !== 'jugando') {
      return { exito: false, esCorrecta: false, estado: this.estado, mensaje: 'La partida no está activa.' };
    }

    const intento = palabraIntento.toUpperCase().trim();
    if (!intento) {
      return { exito: false, esCorrecta: false, estado: this.estado, mensaje: 'Debes ingresar una palabra.' };
    }

    if (intento === this.palabra.toUpperCase().trim()) {
      for (const char of this.palabra) {
        if (char !== ' ' && char !== '-') {
          this.letrasAcertadas.add(char);
        }
      }
      this.estado = 'ganado';
      return { exito: true, esCorrecta: true, estado: this.estado };
    } else {
      this.intentosRestantes--;
      this.verificarDerrota();
      return { exito: true, esCorrecta: false, intentosRestantes: this.intentosRestantes, estado: this.estado };
    }
  }

  /**
   * Devuelve un arreglo de caracteres representando la palabra actual.
   * Las letras descubiertas aparecen visibles, y las ocultas como '_'
   * @returns {Array<string>}
   */
  obtenerPalabraMapeada() {
    return this.palabra.split('').map((char) => {
      if (char === ' ' || char === '-') return char;
      return this.letrasAcertadas.has(char) ? char : '_';
    });
  }

  /**
   * Comprueba si todas las letras de la palabra objetivo han sido descubiertas.
   */
  verificarVictoria() {
    const letrasUnicasPalabra = new Set(this.palabra.split(''));
    let todasDescubiertas = true;

    for (const char of letrasUnicasPalabra) {
      if (char === ' ' || char === '-') continue;
      if (!this.letrasAcertadas.has(char)) {
        todasDescubiertas = false;
        break;
      }
    }

    if (todasDescubiertas) {
      this.estado = 'ganado';
    }
  }

  /**
   * Comprueba si los intentos se agotaron por completo.
   */
  verificarDerrota() {
    if (this.intentosRestantes <= 0) {
      this.intentosRestantes = 0;
      this.estado = 'perdido';
    }
  }

  /**
   * Calcula de forma justa y coherente la puntuación total al finalizar una partida ganada.
   * Fórmula didáctica:
   * (Letras únicas * 100) + (Intentos restantes * 150) + Math.max(0, 500 - (Segundos transcurridos * 10))
   * @param {number} segundosTranscurridos 
   * @returns {number} Puntos totales enteros
   */
  calcularPuntaje(segundosTranscurridos) {
    this.tiempo = Math.max(1, Math.floor(segundosTranscurridos));

    if (this.estado !== 'ganado') {
      this.puntos = 0;
      return 0;
    }

    const letrasUnicas = new Set(this.palabra.split('')).size;
    const puntosBaseLetras = letrasUnicas * GAME_CONFIG.JUEGO.PUNTOS_POR_LETRA;
    const bonusIntentos = this.intentosRestantes * GAME_CONFIG.JUEGO.BONUS_POR_INTENTO_RESTANTE;
    const penalizacionTiempo = this.tiempo * GAME_CONFIG.JUEGO.PENALIZACION_SEGUNDO;
    const bonusTiempo = Math.max(0, GAME_CONFIG.JUEGO.BONUS_TIEMPO_BASE - penalizacionTiempo);

    this.puntos = Math.round(puntosBaseLetras + bonusIntentos + bonusTiempo);
    return this.puntos;
  }

  /**
   * Devuelve un resumen estadístico completo de la partida (para modales o PDF).
   */
  obtenerResumen() {
    return {
      palabra: this.palabra,
      pista: this.pista,
      categoria: this.categoria,
      letrasAcertadas: Array.from(this.letrasAcertadas),
      letrasIncorrectas: Array.from(this.letrasIncorrectas),
      intentosMaximos: this.intentosMaximos,
      intentosRestantes: this.intentosRestantes,
      erroresCometidos: this.intentosMaximos - this.intentosRestantes,
      puntos: this.puntos,
      tiempo: this.tiempo,
      estado: this.estado
    };
  }
}

export default Juego;
