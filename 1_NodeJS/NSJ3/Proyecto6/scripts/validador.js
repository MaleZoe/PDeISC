const REGLAS = {
  'inp-nombre':       { requerido: true,  minLen: 2,  patron: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/,  mensajePatron: 'Solo se permiten letras y espacios' },
  'inp-apellido':     { requerido: true,  minLen: 2,  patron: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/,  mensajePatron: 'Solo se permiten letras y espacios' },
  'inp-fecha':        { requerido: true,  tipo: 'fecha', edadMin: 5, edadMax: 120 },
  'inp-telefono':     { requerido: false, patron: /^\d{7,15}$/,  mensajePatron: 'Solo dígitos, entre 7 y 15 caracteres' }
};

function validarFecha(fechaString, min, max) {
  if (!fechaString) return { valido: false, mensaje: 'Fecha inválida' };
  const fecha = new Date(fechaString);
  if (isNaN(fecha.getTime())) return { valido: false, mensaje: 'Fecha inválida' };
  
  const hoy = new Date();
  if (fecha > hoy) return { valido: false, mensaje: 'La fecha no puede ser futura' };

  let edad = hoy.getFullYear() - fecha.getFullYear();
  const m = hoy.getMonth() - fecha.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
    edad--;
  }

  if (edad < min) return { valido: false, mensaje: `Debés tener al menos ${min} años` };
  if (edad > max) return { valido: false, mensaje: `La edad máxima es ${max} años` };

  return { valido: true };
}

function mostrarError(id, mensaje) {
  const campo = document.getElementById(id);
  const errorSpan = document.getElementById(`error-${id}`);
  campo?.classList.add('campo-error');
  campo?.classList.remove('campo-valido');
  if (errorSpan) {
    errorSpan.textContent = mensaje;
    errorSpan.classList.add('error-visible');
    errorSpan.classList.remove('exito-visible');
  }
}

function mostrarExito(id) {
  const campo = document.getElementById(id);
  const errorSpan = document.getElementById(`error-${id}`);
  campo?.classList.add('campo-valido');
  campo?.classList.remove('campo-error');
  if (errorSpan) {
    errorSpan.textContent = '✓';
    errorSpan.classList.add('exito-visible');
    errorSpan.classList.remove('error-visible');
  }
}

function limpiarError(id) {
  const campo = document.getElementById(id);
  const errorSpan = document.getElementById(`error-${id}`);
  campo?.classList.remove('campo-error', 'campo-valido');
  if (errorSpan) {
    errorSpan.textContent = '';
    errorSpan.classList.remove('error-visible', 'exito-visible');
  }
}

function validarCampo(id) {
  const regla = REGLAS[id];
  if (!regla) return true;

  const campo = document.getElementById(id);
  if (!campo) return true;

  const valor = campo.value.trim();

  if (regla.requerido && valor === '') {
    mostrarError(id, 'Este campo es obligatorio');
    return false;
  }

  if (!regla.requerido && valor === '') {
    limpiarError(id);
    return true;
  }

  if (regla.minLen && valor.length < regla.minLen) {
    mostrarError(id, `Mínimo ${regla.minLen} caracteres`);
    return false;
  }

  if (regla.maxLen && valor.length > regla.maxLen) {
    mostrarError(id, `Máximo ${regla.maxLen} caracteres`);
    return false;
  }

  if (regla.patron && !regla.patron.test(valor)) {
    mostrarError(id, regla.mensajePatron);
    return false;
  }

  if (regla.tipo === 'fecha') {
    const resultado = validarFecha(valor, regla.edadMin, regla.edadMax);
    if (!resultado.valido) { mostrarError(id, resultado.mensaje); return false; }
  }

  mostrarExito(id);
  return true;
}

function validarGrupoRadio(name, errorId) {
  const radios = document.querySelectorAll(`input[name="${name}"]`);
  const seleccionado = Array.from(radios).some(radio => radio.checked);
  const errorSpan = document.getElementById(errorId);
  
  if (!seleccionado) {
    if (errorSpan) {
      errorSpan.textContent = 'Seleccioná una opción';
      errorSpan.classList.add('error-visible');
      errorSpan.classList.remove('exito-visible');
    }
    return false;
  } else {
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.classList.remove('error-visible');
    }
    return true;
  }
}

function validarFormulario() {
  let todoValido = true;

  Object.keys(REGLAS).forEach(id => {
    if (!validarCampo(id)) todoValido = false;
  });

  if (!validarGrupoRadio('genero', 'error-radio-genero')) todoValido = false;

  return todoValido;
}

function resetearValidacion() {
  Object.keys(REGLAS).forEach(id => limpiarError(id));
  const errorRadio = document.getElementById('error-radio-genero');
  if (errorRadio) { errorRadio.textContent = ''; errorRadio.classList.remove('error-visible'); }
}

window.Validador = {
  validarCampo,
  validarFormulario,
  validarGrupoRadio,
  mostrarError,
  mostrarExito,
  limpiarError,
  resetearValidacion
};
