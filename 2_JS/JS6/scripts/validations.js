/**
 * ============================================================================
 * MÓDULO DE VALIDACIONES EN TIEMPO REAL (/scripts/validations.js)
 * ============================================================================
 * Explicación didáctica:
 * Implementa el Nivel 2 de validaciones (JavaScript en el cliente).
 * Se encarga de evaluar en tiempo real (`oninput`, `onblur`, `onsubmit`) las reglas
 * establecidas en los inputs, aplicando estilos de borde rojo/verde (`is-invalid` / `is-valid`)
 * y mostrando mensajes explicativos en los elementos `.invalid-feedback` debajo
 * de cada campo para garantizar una experiencia de usuario (UX) clara e impidiendo
 * envíos de datos erróneos al servidor.
 */

export class ValidadorFormularios {
  /**
   * Valida un campo de texto en tiempo real.
   * @param {HTMLInputElement} inputElement 
   * @param {Object} reglas { minLength, maxLength, regex, mensajeError }
   * @returns {boolean} true si es válido, false en caso contrario
   */
  static validarCampo(inputElement, reglas = {}) {
    if (!inputElement) return false;

    const valor = inputElement.value.trim();
    let esValido = true;
    let mensaje = '';

    // 1. Validar requerido
    if (reglas.requerido && valor.length === 0) {
      esValido = false;
      mensaje = 'Este campo es obligatorio y no puede estar vacío.';
    }
    // 2. Validar longitud mínima
    else if (reglas.minLength && valor.length < reglas.minLength) {
      esValido = false;
      mensaje = `Debe tener al menos ${reglas.minLength} caracteres.`;
    }
    // 3. Validar longitud máxima
    else if (reglas.maxLength && valor.length > reglas.maxLength) {
      esValido = false;
      mensaje = `No puede superar los ${reglas.maxLength} caracteres.`;
    }
    // 4. Validar patrón Regex
    else if (reglas.regex && !reglas.regex.test(valor)) {
      esValido = false;
      mensaje = reglas.mensajeError || 'El formato ingresado contiene caracteres inválidos.';
    }

    // Aplicar feedback visual de Bootstrap
    const feedbackElem = inputElement.parentElement.querySelector('.invalid-feedback') || 
                         inputElement.closest('.form-group, .mb-3, .input-group')?.querySelector('.invalid-feedback');

    if (esValido) {
      inputElement.classList.remove('is-invalid');
      inputElement.classList.add('is-valid');
      if (feedbackElem) feedbackElem.textContent = '';
    } else {
      inputElement.classList.remove('is-valid');
      inputElement.classList.add('is-invalid');
      if (feedbackElem) feedbackElem.textContent = mensaje;
    }

    return esValido;
  }

  /**
   * Conecta oyentes de eventos a un formulario para validar en tiempo real e impedir el envío incorrecto.
   * @param {HTMLFormElement} formularioElement 
   * @param {Object} mapaReglas Objeto cuyas claves son los ID de los inputs y sus valores son las reglas
   * @param {Function} onSubmitValido Callback si todo el formulario es válido
   */
  static vincularFormulario(formularioElement, mapaReglas, onSubmitValido) {
    if (!formularioElement) return;

    // Conectar eventos input y blur en tiempo real para cada input
    Object.keys(mapaReglas).forEach((idInput) => {
      const input = document.getElementById(idInput) || formularioElement.querySelector(`[name="${idInput}"]`);
      if (input) {
        input.addEventListener('input', () => {
          ValidadorFormularios.validarCampo(input, mapaReglas[idInput]);
        });
        input.addEventListener('blur', () => {
          ValidadorFormularios.validarCampo(input, mapaReglas[idInput]);
        });
      }
    });

    // Interceptar submit
    formularioElement.addEventListener('submit', (evento) => {
      evento.preventDefault();
      let formularioEsValido = true;

      Object.keys(mapaReglas).forEach((idInput) => {
        const input = document.getElementById(idInput) || formularioElement.querySelector(`[name="${idInput}"]`);
        if (input) {
          const campoValido = ValidadorFormularios.validarCampo(input, mapaReglas[idInput]);
          if (!campoValido) formularioEsValido = false;
        }
      });

      if (formularioEsValido && typeof onSubmitValido === 'function') {
        onSubmitValido();
      }
    });
  }
}

export default ValidadorFormularios;
