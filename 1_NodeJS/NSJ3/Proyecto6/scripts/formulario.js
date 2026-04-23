const formulario = document.getElementById('formularioRegistro');
const btnEnviar = document.getElementById('btnEnviar');

function actualizarBotonEnvio() {
  const hayErrores = formulario.querySelectorAll('.campo-error').length > 0;
  btnEnviar.disabled = hayErrores;
}

const inputsValidables = formulario.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), select, textarea');
inputsValidables.forEach(input => {
  input.addEventListener('blur', () => {
    window.Validador.validarCampo(input.id);
    actualizarBotonEnvio();
  });
});

document.querySelectorAll('input[type="radio"]').forEach(r => {
  r.addEventListener('change', () => {
    window.Validador.validarGrupoRadio(r.name, `error-radio-${r.name}`);
    actualizarBotonEnvio();
  });
});

function recopilarDatos() {
  return {
    nombre:            document.getElementById('inp-nombre').value.trim(),
    apellido:          document.getElementById('inp-apellido').value.trim(),
    fechaNacimiento:   document.getElementById('inp-fecha').value,
    genero:            document.querySelector('input[name="genero"]:checked')?.value || '',
    telefono:          document.getElementById('inp-telefono').value.trim()
  };
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault(); 

  const esValido = window.Validador.validarFormulario();

  if (!esValido) {
    const primerError = formulario.querySelector('.campo-error, .error-visible');
    if (primerError) {
      const target = primerError.tagName === 'SPAN' ? primerError.parentElement : primerError;
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  const datos = recopilarDatos();
  window.Perfil.mostrar(datos);
});

function mostrarToast(mensaje) {
  const toast = document.getElementById('toastNotificacion');
  toast.textContent = mensaje;
  toast.classList.remove('oculto');
  toast.classList.add('mostrar');
  
  setTimeout(() => {
    toast.classList.remove('mostrar');
    setTimeout(() => toast.classList.add('oculto'), 400); 
  }, 3000);
}

formulario.addEventListener('reset', () => {
  setTimeout(() => {
    window.Validador.resetearValidacion();
    window.Perfil.ocultar();
    
    btnEnviar.disabled = true;

    mostrarToast('Formulario limpiado correctamente');
  }, 0); 
});

const secciones = document.querySelectorAll('fieldset');
const pasos = document.querySelectorAll('.paso');

const observerStepper = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      const idSeccion = entrada.target.id;
      pasos.forEach(paso => {
        if (paso.dataset.seccion === idSeccion) {
          paso.classList.add('paso-activo');
        } else {
          paso.classList.remove('paso-activo');
        }
      });
    }
  });
}, { threshold: 0.3 }); 

secciones.forEach(sec => observerStepper.observe(sec));
