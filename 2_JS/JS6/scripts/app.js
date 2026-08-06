/**
 * ============================================================================
 * CONTROLADOR PRINCIPAL DE LA APLICACIÓN (/scripts/app.js)
 * ============================================================================
 * Explicación didáctica:
 * Este módulo orquesta la aplicación en el navegador web. Sigue el principio
 * de Inversión de Dependencias y Mediador: conecta los eventos del usuario
 * (clics en el teclado virtual o pulsaciones de teclado físico) con el modelo lógico
 * (`Juego.js`), el temporizador (`Temporizador.js`) y la presentación (`UI.js`).
 * 
 * Además, gestiona las comunicaciones asíncronas con el backend (`fetch` y `async/await`)
 * tanto para obtener la palabra secreta como para guardar los scores en MySQL.
 */

import { Juego } from '../modules/Juego.js';
import { UI } from '../modules/UI.js';
import { Temporizador } from '../modules/Temporizador.js';
import { GAME_CONFIG, GameContext } from '../context/GameContext.js';
import GeneradorPDF from './pdfGenerator.js';

// Instanciación de las capas de la arquitectura
const juego = new Juego();
const ui = new UI();
const temporizador = new Temporizador((segundos, tiempoFormateado) => {
  ui.actualizarCronometro(tiempoFormateado);
});

/**
 * Inicia una nueva partida: consulta la API REST, reinicia el temporizador y prepara el DOM.
 */
export async function iniciarNuevaPartida() {
  console.log('🔄 Preparando nueva partida del Juego del Ahorcado...');
  
  // 1. Detenemos cualquier temporizador activo previamente
  temporizador.reiniciar();
  
  // 2. Mostramos feedback visual de carga en la UI
  ui.toggleCarga(true);
  
  try {
    // 3. Petición asíncrona a nuestra API REST backend GET /api/palabra
    const respuesta = await fetch(GAME_CONFIG.API.OBTENER_PALABRA);
    
    if (!respuesta.ok) {
      throw new Error(`Error en el servidor HTTP: status ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    console.log(`📡 Datos recibidos desde API (${datos.origen || 'REST'}): Categoría [${datos.categoria}]`);

    // 4. Inicializamos la lógica pura de la partida
    juego.inicializar(datos.palabra, datos.pista, datos.categoria);

    // 5. Ocultamos el spinner y actualizamos la interfaz de usuario
    ui.toggleCarga(false);
    ui.renderizarPalabra(juego.obtenerPalabraMapeada(), false);
    ui.actualizarInfoPanel(juego.pista, juego.categoria, juego.intentosRestantes);
    ui.actualizarAhorcadoSVG(0);

    // 6. Generamos el teclado virtual con su callback respectivo
    ui.renderizarTecladoVirtual(GAME_CONFIG.TECLADO_ALFABETO, (letraSeleccionada) => {
      procesarLetra(letraSeleccionada);
    });

    // 7. El cronómetro espera la acción manual del usuario a través del botón #btn-start-timer
    const btnStartTimer = document.getElementById('btn-start-timer');
    if (btnStartTimer) {
      btnStartTimer.classList.remove('d-none');
    }
    ui.mostrarToast('¡Partida cargada! Presiona el botón "Iniciar Cronómetro" para empezar.', 'info');

  } catch (error) {
    console.error('❌ Error crítico al iniciar la partida:', error);
    ui.toggleCarga(false);
    
    // Fallback de ultra-seguridad si el servidor Node estuviere caído al recargar solo el frontend
    juego.inicializar('FULLSTACK', 'Desarrollo integral de frontend y backend con Node.js', 'Tecnología');
    ui.renderizarPalabra(juego.obtenerPalabraMapeada(), false);
    ui.actualizarInfoPanel(juego.pista, juego.categoria, juego.intentosRestantes);
    ui.actualizarAhorcadoSVG(0);
    ui.renderizarTecladoVirtual(GAME_CONFIG.TECLADO_ALFABETO, (letra) => procesarLetra(letra));
    
    const btnStartTimer = document.getElementById('btn-start-timer');
    if (btnStartTimer) {
      btnStartTimer.classList.remove('d-none');
    }
    ui.mostrarToast('Modo autónomo activado. Presiona "Iniciar Cronómetro" para comenzar.', 'warning');
  }
}

/**
 * Procesa la letra seleccionada por el usuario (sea por ratón, táctil o teclado físico).
 * @param {string} letra 
 */
function procesarLetra(letra) {
  if (juego.estado !== 'jugando') return;

  // Requisito estricto: no permitir jugar si el cronómetro no ha sido iniciado manualmente
  if (!temporizador.enMarcha) {
    ui.mostrarToast('⏳ Debes presionar el botón "Iniciar Cronómetro" para comenzar a adivinar.', 'warning');
    const btnStartTimer = document.getElementById('btn-start-timer');
    if (btnStartTimer) {
      btnStartTimer.classList.add('pulse-warning');
      setTimeout(() => btnStartTimer.classList.remove('pulse-warning'), 1500);
    }
    return;
  }

  const resultado = juego.intentarLetra(letra);

  if (!resultado.exito) {
    return; // Carácter especial no alfabético ignorado
  }

  if (resultado.repeticion) {
    ui.mostrarToast(`La letra "${letra}" ya la habías intentado. Elige otra.`, 'warning');
    return;
  }

  // Actualizar el botón en el teclado virtual (verde o rojo)
  ui.marcarLetraTeclado(letra, resultado.esCorrecta);

  // Actualizar las casillas de la palabra
  ui.renderizarPalabra(juego.obtenerPalabraMapeada());

  // Actualizar panel (intentos restantes)
  ui.actualizarInfoPanel(juego.pista, juego.categoria, juego.intentosRestantes);

  if (resultado.esCorrecta) {
    ui.mostrarToast(`¡Bien hecho! La "${letra}" está en la palabra.`, 'success');
  } else {
    // Dibujar una nueva parte del cuerpo del ahorcado en el SVG
    const erroresCometidos = juego.intentosMaximos - juego.intentosRestantes;
    ui.actualizarAhorcadoSVG(erroresCometidos);
    ui.mostrarToast(`¡Oops! La "${letra}" no está. Te quedan ${juego.intentosRestantes} intentos.`, 'danger');
  }

  // Comprobar si la jugada finalizó la partida (Victoria o Derrota)
  if (juego.estado === 'ganado') {
    procesarVictoria();
  } else if (juego.estado === 'perdido') {
    procesarDerrota();
  }
}

/**
 * Acciones a ejecutar inmediatamente cuando el jugador descubre toda la palabra.
 */
function procesarVictoria() {
  const segundos = temporizador.detener();
  const puntajeFinal = juego.calcularPuntaje(segundos);
  const resumen = juego.obtenerResumen();

  console.log(`🏆 ¡VICTORIA! Puntos calculados: ${puntajeFinal} en ${segundos}s`);
  
  // Guardamos en contexto por si quiere descargar diploma individual
  GameContext.guardarUltimaPartida(resumen);

  ui.mostrarToast('¡FELICITACIONES! Has resuelto la palabra correctamente.', 'success');

  // Mostramos el modal de resultado al cabo de 600ms para permitir ver la animación final
  setTimeout(() => {
    ui.mostrarModalResultado(
      resumen,
      async (nombreJugador, puntos, tiempo, alGuardarConExito) => {
        await enviarScoreAlServidor(nombreJugador, puntos, tiempo, alGuardarConExito, resumen);
      },
      () => iniciarNuevaPartida()
    );
  }, 600);
}

/**
 * Acciones a ejecutar cuando se agotan los 6 intentos permitidos.
 */
function procesarDerrota() {
  const segundos = temporizador.detener();
  juego.calcularPuntaje(segundos);
  const resumen = juego.obtenerResumen();

  console.log(`💀 GAME OVER. Palabra no resuelta: ${juego.palabra}`);

  ui.mostrarToast(`Game Over. La palabra era: ${juego.palabra}`, 'danger');

  // Revelamos la palabra completa en el tablero visual para satisfacer la curiosidad del estudiante
  ui.renderizarPalabra(juego.palabra.split(''), true);

  setTimeout(() => {
    ui.mostrarModalResultado(resumen, null, () => iniciarNuevaPartida());
  }, 800);
}

/**
 * Envía el puntaje del jugador a la API REST Node.js (`POST /api/score`).
 * @param {string} nombre 
 * @param {number} puntos 
 * @param {number} tiempo 
 * @param {Function} callbackOcultarModal 
 * @param {Object} resumenPartida
 */
async function enviarScoreAlServidor(nombre, puntos, tiempo, callbackOcultarModal, resumenPartida) {
  try {
    const respuesta = await fetch(GAME_CONFIG.API.SCORE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, puntos, tiempo })
    });

    const datos = await respuesta.json();

    if (respuesta.ok && datos.exito) {
      ui.mostrarToast(`¡Score guardado con éxito en MySQL! Posición: #${datos.datos.posicionRanking}. Puedes descargar tu PDF en el botón superior.`, 'success');

      if (typeof callbackOcultarModal === 'function') {
        callbackOcultarModal();
      }
    } else {
      throw new Error(datos.error || 'No se pudo guardar en MySQL por error de validación.');
    }

  } catch (error) {
    console.error('❌ Error al guardar puntuación mediante API REST:', error);
    ui.mostrarToast(error.message || 'Error al conectar con la base de datos MySQL.', 'danger');
  }
}

/**
 * Conecta los oyentes globales de eventos del teclado físico para permitir una jugabilidad ágil.
 */
function conectarTecladoFísico() {
  window.addEventListener('keydown', (evento) => {
    // Si el usuario está escribiendo en un input de formulario (ej: ingresando su nombre o buscando en el ranking), no interferimos
    if (evento.target.tagName === 'INPUT' || evento.target.tagName === 'TEXTAREA') {
      return;
    }

    const tecla = evento.key.toUpperCase();
    if (/^[A-ZÑ]$/.test(tecla) && tecla.length === 1) {
      procesarLetra(tecla);
    }
  });
}

/**
 * Conecta los botones de la interfaz de usuario principales (Reiniciar, Nueva Palabra, Descargar PDF anterior).
 */
function conectarBotonesUI() {
  const btnReiniciar = document.getElementById('btn-restart');
  const btnNuevaPalabra = document.getElementById('btn-new-word');
  const btnDiplomaUltimo = document.getElementById('btn-download-last-diploma');

  if (btnReiniciar) {
    btnReiniciar.addEventListener('click', () => {
      iniciarNuevaPartida();
    });
  }

  if (btnNuevaPalabra) {
    btnNuevaPalabra.addEventListener('click', () => {
      iniciarNuevaPartida();
    });
  }

  if (btnDiplomaUltimo) {
    btnDiplomaUltimo.addEventListener('click', () => {
      const ultima = GameContext.obtenerUltimaPartida();
      if (!ultima || ultima.estado !== 'ganado') {
        ui.mostrarToast('No hay una partida ganada reciente en memoria para exportar a PDF.', 'warning');
        return;
      }
      GeneradorPDF.descargarDiplomaPartida({
        nombre: 'Estudiante / Jugador',
        puntos: ultima.puntos,
        tiempo: ultima.tiempo,
        palabra: ultima.palabra,
        categoria: ultima.categoria
      });
    });
  }

  const btnStartTimer = document.getElementById('btn-start-timer');
  if (btnStartTimer) {
    btnStartTimer.addEventListener('click', () => {
      if (juego.estado === 'jugando' && !temporizador.enMarcha) {
        temporizador.iniciar();
        btnStartTimer.classList.add('d-none');
        ui.mostrarToast('▶️ ¡Cronómetro en marcha! Ya puedes escribir o pulsar las letras.', 'info');
      }
    });
  }

  const formPalabraCompleta = document.getElementById('form-palabra-completa');
  if (formPalabraCompleta) {
    formPalabraCompleta.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('input-palabra-completa');
      const val = input ? input.value.trim() : '';
      if (!val) return;

      if (juego.estado !== 'jugando') return;
      if (!temporizador.enMarcha) {
        ui.mostrarToast('⏳ Debes presionar el botón "Iniciar Cronómetro" para adivinar la palabra.', 'warning');
        if (btnStartTimer) {
          btnStartTimer.classList.add('pulse-warning');
          setTimeout(() => btnStartTimer.classList.remove('pulse-warning'), 1500);
        }
        return;
      }

      const res = juego.intentarPalabraCompleta(val);
      if (input) input.value = '';

      if (res.esCorrecta) {
        ui.renderizarPalabra(juego.obtenerPalabraMapeada());
        ui.actualizarInfoPanel(juego.pista, juego.categoria, juego.intentosRestantes);
        ui.mostrarToast('¡MANDAMAS! Has adivinado la palabra completa de un solo golpe. ⚡🏆', 'success');
        procesarVictoria();
      } else {
        const erroresCometidos = juego.intentosMaximos - juego.intentosRestantes;
        ui.actualizarAhorcadoSVG(erroresCometidos);
        ui.actualizarInfoPanel(juego.pista, juego.categoria, juego.intentosRestantes);
        ui.mostrarToast(`La palabra "${val.toUpperCase()}" no es la correcta. Pierdes 1 intento. Te quedan ${juego.intentosRestantes}.`, 'danger');
        if (juego.estado === 'perdido') {
          procesarDerrota();
        }
      }
    });
  }
}

// Inicializar automáticamente cuando el DOM esté listo
if (typeof window !== 'undefined' && document.getElementById('word-display')) {
  window.addEventListener('DOMContentLoaded', () => {
    conectarTecladoFísico();
    conectarBotonesUI();
    iniciarNuevaPartida();
  });
}

export default {
  iniciarNuevaPartida
};
