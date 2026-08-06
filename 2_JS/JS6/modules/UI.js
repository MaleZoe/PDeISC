/**
 * ============================================================================
 * CLASE INTERFAZ DE USUARIO (/modules/UI.js)
 * ============================================================================
 * Explicación didáctica:
 * Esta clase es responsable de la manipulación y renderizado dinámico del DOM
 * (Document Object Model) en el navegador, separando por completo la presentación
 * visual de la lógica matemática del juego (que reside en `Juego.js`).
 * 
 * Características:
 * - Dibujado del Ahorcado mediante gráficos SVG escalables de alta definición.
 * - Teclado virtual animado con estados visuales (acierto, error, deshabilitado).
 * - Sistema de notificaciones tipo "Toast" de Bootstrap 5 en sustitución de alert().
 * - Modales dinámicos de fin de partida.
 */

import { GeneradorPDF } from '../scripts/pdfGenerator.js';

export class UI {
  constructor() {
    // Cache de referencias del DOM para evitar repeticiones innecesarias de `document.getElementById`
    this.elementos = {
      contenedorPalabra: document.getElementById('word-display'),
      contenedorTeclado: document.getElementById('keyboard-container'),
      contenedorPista: document.getElementById('clue-text'),
      badgeCategoria: document.getElementById('category-badge'),
      contadorIntentos: document.getElementById('remaining-attempts'),
      temporizadorDisplay: document.getElementById('timer-display'),
      svgHorca: document.getElementById('hangman-svg'),
      toastContenedor: document.getElementById('toast-container'),
      spinnerLoading: document.getElementById('loading-spinner'),
      btnReiniciar: document.getElementById('btn-restart'),
      btnNuevaPalabra: document.getElementById('btn-new-word')
    };
  }

  /**
   * Muestra u oculta el spinner de carga al consultar la API REST de palabras.
   * @param {boolean} visible 
   */
  toggleCarga(visible) {
    if (this.elementos.spinnerLoading) {
      this.elementos.spinnerLoading.style.display = visible ? 'flex' : 'none';
    }
  }

  /**
   * Renderiza las casillas de la palabra oculta/revelada dinámicamente en el DOM.
   * @param {Array<string>} arregloLetras Ejemplo: ['A', '_', 'O', 'R', '_', 'A', 'D', 'O']
   * @param {boolean} animar Si es true, añade efecto de salto a las letras descubiertas
   */
  renderizarPalabra(arregloLetras, animar = true) {
    if (!this.elementos.contenedorPalabra) return;
    
    this.elementos.contenedorPalabra.innerHTML = '';
    
    // Dividir en palabras si la frase contiene espacios (para que estén en renglones diferentes si son compuestas)
    const palabras = [];
    let palabraActual = [];
    
    arregloLetras.forEach((char) => {
      if (char === ' ') {
        if (palabraActual.length > 0) {
          palabras.push(palabraActual);
          palabraActual = [];
        }
      } else {
        palabraActual.push(char);
      }
    });
    if (palabraActual.length > 0) {
      palabras.push(palabraActual);
    }

    if (palabras.length === 0) return;

    palabras.forEach((subArreglo) => {
      const row = document.createElement('div');
      row.className = 'word-row d-flex justify-content-center align-items-center flex-nowrap my-1';
      
      // Ajuste dinámico de tamaño para garantizar que nunca se corte ni rebase el recuadro, manteniendo estética
      const len = subArreglo.length;
      let sizeClass = 'size-lg';
      if (len >= 13) {
        sizeClass = 'size-xs';
      } else if (len >= 11) {
        sizeClass = 'size-sm';
      } else if (len >= 9) {
        sizeClass = 'size-md';
      }
      row.classList.add(sizeClass);

      subArreglo.forEach((letra) => {
        const letraBox = document.createElement('div');
        letraBox.className = 'letter-box';
        
        if (letra !== '_' && letra !== '-') {
          letraBox.textContent = letra;
          letraBox.classList.add('letter-revealed');
          if (animar) letraBox.classList.add('animate-pop');
        } else if (letra === '-') {
          letraBox.textContent = '-';
          letraBox.classList.add('letter-separator');
        } else {
          letraBox.textContent = '';
          letraBox.classList.add('letter-hidden');
        }
        row.appendChild(letraBox);
      });

      this.elementos.contenedorPalabra.appendChild(row);
    });
  }

  /**
   * Actualiza el panel informativo (pista, categoría, intentos restantes y cronómetro).
   * @param {string} pista 
   * @param {string} categoria 
   * @param {number} intentosRestantes 
   */
  actualizarInfoPanel(pista, categoria, intentosRestantes) {
    if (this.elementos.contenedorPista) {
      this.elementos.contenedorPista.textContent = pista || 'Sin pista asignada.';
    }
    if (this.elementos.badgeCategoria) {
      this.elementos.badgeCategoria.textContent = categoria || 'General';
    }
    if (this.elementos.contadorIntentos) {
      this.elementos.contadorIntentos.textContent = intentosRestantes;
      // Alerta visual de peligro cuando quedan pocos intentos
      if (intentosRestantes <= 2) {
        this.elementos.contadorIntentos.classList.remove('bg-success', 'bg-warning');
        this.elementos.contadorIntentos.classList.add('bg-danger', 'pulse-warning');
      } else if (intentosRestantes <= 4) {
        this.elementos.contadorIntentos.classList.remove('bg-success', 'bg-danger', 'pulse-warning');
        this.elementos.contadorIntentos.classList.add('bg-warning');
      } else {
        this.elementos.contadorIntentos.classList.remove('bg-warning', 'bg-danger', 'pulse-warning');
        this.elementos.contadorIntentos.classList.add('bg-success');
      }
    }
  }

  /**
   * Actualiza la visualización del cronómetro en formato MM:SS.
   * @param {string} tiempoStr Ejemplo: '00:45'
   */
  actualizarCronometro(tiempoStr) {
    if (this.elementos.temporizadorDisplay) {
      this.elementos.temporizadorDisplay.textContent = tiempoStr;
    }
  }

  /**
   * Genera dinámicamente los botones del teclado virtual QWERTY o Alfabético.
   * @param {Array<string>} alfabeto Arreglo de letras permitidas
   * @param {Function} onClickLetra Callback que se ejecuta cuando el usuario hace clic
   */
  renderizarTecladoVirtual(alfabeto, onClickLetra) {
    if (!this.elementos.contenedorTeclado) return;
    this.elementos.contenedorTeclado.innerHTML = '';

    alfabeto.forEach((letra) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'btn btn-key';
      boton.textContent = letra;
      boton.dataset.letra = letra;
      boton.setAttribute('aria-label', `Letra ${letra}`);

      boton.addEventListener('click', () => {
        onClickLetra(letra);
      });

      this.elementos.contenedorTeclado.appendChild(boton);
    });
  }

  /**
   * Actualiza visualmente el estado del botón en el teclado virtual (Verde acierto, Rojo error).
   * @param {string} letra 
   * @param {boolean} esCorrecta 
   */
  marcarLetraTeclado(letra, esCorrecta) {
    if (!this.elementos.contenedorTeclado) return;
    const boton = this.elementos.contenedorTeclado.querySelector(`button[dataset-letra="${letra}"], button[data-letra="${letra}"]`);
    if (boton) {
      boton.disabled = true;
      if (esCorrecta) {
        boton.classList.add('key-correct');
      } else {
        boton.classList.add('key-wrong');
        // Efecto de sacudida visual al equivocarse (microanimación)
        boton.classList.add('shake-error');
      }
    }
  }

  /**
   * Dibuja progresivamente las partes del cuerpo del ahorcado utilizando elementos SVG.
   * @param {number} erroresCometidos (0 a 6)
   */
  actualizarAhorcadoSVG(erroresCometidos) {
    // Array con las IDs o clases de las partes del SVG correspondientes a cada error (1 a 6)
    const partesSVG = [
      'cabeza',
      'torso',
      'brazo-izquierdo',
      'brazo-derecho',
      'pierna-izquierd',
      'pierna-derecha'
    ];

    if (!this.elementos.svgHorca) return;

    // Reseteamos u ocultamos todas las partes primero si es el inicio (errores === 0)
    if (erroresCometidos === 0) {
      partesSVG.forEach((parteId) => {
        const elem = document.getElementById(`svg-${parteId}`);
        if (elem) elem.style.opacity = '0';
      });
      return;
    }

    // Ocultamos todas las partes superiores y mostramos estrictamente hasta el número de errores
    for (let i = 0; i < partesSVG.length; i++) {
      const elem = document.getElementById(`svg-${partesSVG[i]}`);
      if (elem) {
        if (i < erroresCometidos) {
          elem.style.opacity = '1';
          elem.style.transition = 'opacity 0.4s ease-in, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        } else {
          elem.style.opacity = '0';
        }
      }
    }
  }

  /**
   * Muestra una notificación Toast de Bootstrap animada sin requerir alert().
   * @param {string} mensaje 
   * @param {string} tipo 'info' | 'success' | 'danger' | 'warning'
   */
  mostrarToast(mensaje, tipo = 'info') {
    if (!this.elementos.toastContenedor) {
      // Si el contenedor no existe aún, lo creamos e insertamos en el body
      const contenedor = document.createElement('div');
      contenedor.id = 'toast-container';
      contenedor.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      contenedor.style.zIndex = '1080';
      document.body.appendChild(contenedor);
      this.elementos.toastContenedor = contenedor;
    }

    const iconos = {
      info: 'info',
      success: 'check-circle',
      danger: 'alert-triangle',
      warning: 'alert-circle'
    };

    const colores = {
      info: 'bg-primary text-white',
      success: 'bg-success text-white',
      danger: 'bg-danger text-white',
      warning: 'bg-warning text-dark'
    };

    const idToast = `toast-${Date.now()}`;
    const toastHTML = `
      <div id="${idToast}" class="toast align-items-center ${colores[tipo] || colores.info} border-0 shadow-lg mb-2" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2 font-weight-medium">
            <i data-lucide="${iconos[tipo] || 'info'}" class="icon-toast"></i>
            <span>${mensaje}</span>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>
      </div>
    `;

    this.elementos.toastContenedor.insertAdjacentHTML('beforeend', toastHTML);
    
    // Renderizamos el icono Lucide inyectado
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    const toastElement = document.getElementById(idToast);
    if (toastElement && window.bootstrap && window.bootstrap.Toast) {
      const bsToast = new window.bootstrap.Toast(toastElement, { delay: 4000 });
      bsToast.show();
      toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
    }
  }

  /**
   * Muestra el modal de victoria o derrota con la puntuación y el formulario para guardar.
   * @param {Object} resumen - Resumen devuelto por Juego.obtenerResumen()
   * @param {Function} onSubmitScore - Callback para guardar en MySQL
   * @param {Function} onJugarDeNuevo - Callback para reiniciar la partida
   */
  mostrarModalResultado(resumen, onSubmitScore, onJugarDeNuevo) {
    const esGanado = resumen.estado === 'ganado';
    const modalId = 'modal-resultado-partida';
    let modalElement = document.getElementById(modalId);

    if (!modalElement) {
      modalElement = document.createElement('div');
      modalElement.id = modalId;
      modalElement.className = 'modal fade';
      modalElement.setAttribute('data-bs-backdrop', 'static');
      modalElement.setAttribute('data-bs-keyboard', 'false');
      modalElement.setAttribute('tabindex', '-1');
      document.body.appendChild(modalElement);
    }

    const titulo = esGanado ? '¡FELICITACIONES, HAS GANADO!' : '¡GAME OVER! HAS PERDIDO';
    const icono = esGanado ? 'trophy' : 'frown';
    const colorHeader = esGanado ? 'bg-success text-white' : 'bg-danger text-white';

    modalElement.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
          <div class="modal-header ${colorHeader} p-4 d-flex align-items-center justify-content-between">
            <h4 class="modal-title d-flex align-items-center gap-2 mb-0 fw-bold">
              <i data-lucide="${icono}" class="icon-modal"></i> ${titulo}
            </h4>
          </div>
          <div class="modal-body p-4">
            <div class="text-center mb-4">
              <p class="text-muted mb-1 fs-5">La palabra secreta era:</p>
              <h2 class="word-revealed-final my-2 px-3 py-2 rounded-3 d-inline-block bg-body-secondary fw-bold letter-spacing-md">
                ${resumen.palabra}
              </h2>
              <p class="small text-secondary mt-1">Categoría: <strong>${resumen.categoria}</strong> | Pista: <em>"${resumen.pista}"</em></p>
            </div>

            <div class="row g-3 mb-4 text-center">
              <div class="col-6 col-md-3">
                <div class="stat-box p-3 rounded-3 bg-body-tertiary border">
                  <span class="d-block text-muted small">PUNTUACIÓN</span>
                  <strong class="fs-4 text-primary">${resumen.puntos}</strong>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="stat-box p-3 rounded-3 bg-body-tertiary border">
                  <span class="d-block text-muted small">TIEMPO</span>
                  <strong class="fs-4 text-info">${resumen.tiempo}s</strong>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="stat-box p-3 rounded-3 bg-body-tertiary border">
                  <span class="d-block text-muted small">ACIERTOS</span>
                  <strong class="fs-4 text-success">${resumen.letrasAcertadas.length}</strong>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="stat-box p-3 rounded-3 bg-body-tertiary border">
                  <span class="d-block text-muted small">ERRORES</span>
                  <strong class="fs-4 text-danger">${resumen.erroresCometidos}/6</strong>
                </div>
              </div>
            </div>

            <!-- Botón directo de descarga de PDF solicitado sin alertas ni confirms -->
            <div class="my-3 text-center">
              <button type="button" id="btn-descargar-pdf-actual" class="btn btn-warning btn-lg px-4 py-2 fw-bold d-inline-flex align-items-center gap-2 rounded-pill shadow">
                <i data-lucide="file-down"></i> Descargar PDF con el Score Actual (${resumen.puntos} pts)
              </button>
            </div>

            ${esGanado ? `
              <div class="card bg-primary-subtle border-primary-subtle rounded-3 p-3 mb-3">
                <h5 class="fw-bold mb-2 d-flex align-items-center gap-2">
                  <i data-lucide="award"></i> Registrar Puntuación en MySQL
                </h5>
                <p class="small text-body-secondary mb-3">Ingresa tu nombre para guardar tu score y competir en la tabla de posiciones general.</p>
                
                <form id="form-guardar-score" class="needs-validation" novalidate>
                  <div class="mb-3 text-start">
                    <label for="input-nombre-jugador" class="form-label fw-semibold">Nombre del Jugador <span class="text-danger">*</span></label>
                    <div class="input-group">
                      <span class="input-group-text"><i data-lucide="user"></i></span>
                      <input 
                        type="text" 
                        class="form-control form-control-lg" 
                        id="input-nombre-jugador" 
                        name="nombre"
                        placeholder="Ej: Salvador Senior Dev" 
                        required 
                        minlength="3" 
                        maxlength="30"
                        pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\\s\\-_0-9]+$"
                        autocomplete="off"
                      >
                      <button type="submit" class="btn btn-primary px-4 fw-bold d-flex align-items-center gap-2">
                        <i data-lucide="save"></i> Guardar en MySQL
                      </button>
                    </div>
                    <!-- Feedback visual de error para Nivel 2 JS -->
                    <div class="invalid-feedback id-error-feedback">
                      Por favor ingresa un nombre válido entre 3 y 30 caracteres (sin símbolos extraños).
                    </div>
                    <div class="valid-feedback">
                      ¡Nombre válido y listo para el ranking!
                    </div>
                  </div>
                </form>
              </div>
            ` : `
              <div class="alert alert-secondary text-center p-3 mb-3">
                <i data-lucide="info" class="me-1"></i> Puedes volver a intentarlo con una nueva palabra. ¡No te rindas!
              </div>
            `}
          </div>
          <div class="modal-footer bg-body-tertiary p-3 d-flex justify-content-between align-items-center">
            <a href="/ranking" class="btn btn-outline-secondary d-flex align-items-center gap-2">
              <i data-lucide="list-ordered"></i> Ver Ranking Top
            </a>
            <button type="button" id="btn-modal-jugar-de-nuevo" class="btn btn-success btn-lg px-4 fw-bold d-flex align-items-center gap-2">
              <i data-lucide="rotate-ccw"></i> Jugar Otra Partida
            </button>
          </div>
        </div>
      </div>
    `;

    // Renderizar iconos de Lucide
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    // Instanciar y mostrar el modal
    if (window.bootstrap && window.bootstrap.Modal) {
      const bsModal = new window.bootstrap.Modal(modalElement);
      bsModal.show();

      // Evento para el botón de jugar de nuevo
      const btnReiniciarModal = document.getElementById('btn-modal-jugar-de-nuevo');
      if (btnReiniciarModal) {
        btnReiniciarModal.addEventListener('click', () => {
          bsModal.hide();
          if (typeof onJugarDeNuevo === 'function') onJugarDeNuevo();
        });
      }

      // Evento para el botón de descarga directa del PDF del score actual
      const btnDescargarPdf = document.getElementById('btn-descargar-pdf-actual');
      if (btnDescargarPdf) {
        btnDescargarPdf.addEventListener('click', () => {
          const inputNombre = document.getElementById('input-nombre-jugador');
          const nombreElegido = inputNombre && inputNombre.value.trim().length >= 3 ? inputNombre.value.trim() : 'Jugador';
          GeneradorPDF.descargarDiplomaPartida({
            nombre: nombreElegido,
            puntos: resumen.puntos,
            tiempo: resumen.tiempo,
            palabra: resumen.palabra,
            categoria: resumen.categoria
          });
          this.mostrarToast('📄 Generando y descargando PDF con tu score actual...', 'info');
        });
      }

      // Evento para el formulario de guardar score (si es partida ganada)
      const formScore = document.getElementById('form-guardar-score');
      if (formScore && esGanado) {
        const inputNombre = document.getElementById('input-nombre-jugador');
        
        // Nivel 2 Validación en tiempo real con bordes y feedback
        inputNombre.addEventListener('input', (e) => {
          const val = e.target.value.trim();
          const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-_0-9]+$/;
          if (val.length >= 3 && val.length <= 30 && regex.test(val)) {
            inputNombre.classList.remove('is-invalid');
            inputNombre.classList.add('is-valid');
          } else {
            inputNombre.classList.remove('is-valid');
            inputNombre.classList.add('is-invalid');
          }
        });

        formScore.addEventListener('submit', (e) => {
          e.preventDefault();
          const val = inputNombre.value.trim();
          const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-_0-9]+$/;

          if (val.length < 3 || val.length > 30 || !regex.test(val)) {
            inputNombre.classList.add('is-invalid');
            return;
          }

          // Invocamos callback de guardado si es válido
          if (typeof onSubmitScore === 'function') {
            const btnSubmit = formScore.querySelector('button[type="submit"]');
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Guardando...`;
            
            onSubmitScore(val, resumen.puntos, resumen.tiempo, () => {
              bsModal.hide();
            });
          }
        });
      }
    }
  }
}

export default UI;
