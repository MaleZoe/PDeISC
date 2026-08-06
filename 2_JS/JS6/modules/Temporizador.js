/**
 * ============================================================================
 * CLASE TEMPORIZADOR (/modules/Temporizador.js)
 * ============================================================================
 * Explicación didáctica:
 * Módulo que encapsula el comportamiento del cronómetro de la partida.
 * No accede directamente a elementos del DOM para mantener una alta cohesión
 * y bajo acoplamiento (Principio de Responsabilidad Única - SRP).
 * En su lugar, recibe un callback opcional `onTick` que se ejecuta cada segundo.
 */

export class Temporizador {
  constructor(onTick = null) {
    this.segundosTranscurridos = 0;
    this.intervaloId = null;
    this.onTickCallback = onTick;
    this.enMarcha = false;
  }

  /**
   * Inicia el conteo del temporizador. Si ya está en marcha, no lo duplica.
   */
  iniciar() {
    if (this.enMarcha) return;

    this.enMarcha = true;
    this.intervaloId = setInterval(() => {
      this.segundosTranscurridos++;
      if (typeof this.onTickCallback === 'function') {
        this.onTickCallback(this.segundosTranscurridos, this.formatearTiempo());
      }
    }, 1000);
  }

  /**
   * Detiene el conteo exacto donde está y retorna los segundos acumulados.
   * @returns {number} Segundos transcurridos al detener
   */
  detener() {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
      this.intervaloId = null;
    }
    this.enMarcha = false;
    return this.segundosTranscurridos;
  }

  /**
   * Reinicia el temporizador a 0 y lo detiene.
   */
  reiniciar() {
    this.detener();
    this.segundosTranscurridos = 0;
    if (typeof this.onTickCallback === 'function') {
      this.onTickCallback(0, '00:00');
    }
  }

  /**
   * Devuelve los segundos exactos transcurridos.
   * @returns {number}
   */
  obtenerSegundos() {
    return this.segundosTranscurridos;
  }

  /**
   * Formatea los segundos a un formato visual human-readable MM:SS (ej: 01:24).
   * @returns {string}
   */
  formatearTiempo() {
    const min = Math.floor(this.segundosTranscurridos / 60);
    const seg = this.segundosTranscurridos % 60;
    const minStr = min < 10 ? `0${min}` : `${min}`;
    const segStr = seg < 10 ? `0${seg}` : `${seg}`;
    return `${minStr}:${segStr}`;
  }
}

export default Temporizador;
