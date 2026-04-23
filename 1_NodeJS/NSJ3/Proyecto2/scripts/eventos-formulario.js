// Este script maneja los eventos de un formulario, como escribir en los campos,
// validarlos y enviarlos. También cambia el color de las etiquetas al hacer clic.

document.addEventListener('DOMContentLoaded', () => {
  // Traemos los elementos del HTML
  const panelLog = document.getElementById('panelLog');
  const btnLimpiar = document.getElementById('btnLimpiar');
  const form = document.getElementById('miFormulario');
  const inputs = form.querySelectorAll('input, select');
  const banner = document.getElementById('bannerExito');
  const medidor = document.getElementById('medidorFuerza');
  
  // Reglas simples para saber si un campo está bien escrito
  const rules = {
    campoNombre: (v) => v.trim().length >= 2, // Mínimo 2 letras
    campoCorreo: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), // Formato de email
    campoClave: (v) => v.length >= 6, // Mínimo 6 caracteres
    campoPais: (v) => v !== '', // Debe elegir uno
    campoTerminos: (v, el) => el.checked // Debe marcar el checkbox
  };

  // Escribe en el historial de la derecha
  function registrarEvento(mensaje) {
    const entrada = document.createElement('div');
    entrada.className = 'd-flex mb-1 mt-1 font-mono align-items-start';
    const hora = new Date().toLocaleTimeString('es-ES', { hour12: false });
    entrada.innerHTML = `<span class="text-muted me-2">>[${hora}]</span> <span>${mensaje}</span>`;
    panelLog.prepend(entrada);
  }

  btnLimpiar.addEventListener('click', () => panelLog.innerHTML = '');

  // Configuramos cada campo (input) del formulario
  inputs.forEach(el => {
    // Cuando entramos al campo (hacemos clic para escribir)
    el.addEventListener('focus', () => {
      const lbl = form.querySelector(`label[for="${el.id}"]`);
      if(lbl) lbl.classList.add('foco-activo'); // Ponemos la etiqueta en negrita o color
    });

    // Cuando salimos del campo
    el.addEventListener('blur', () => {
      const lbl = form.querySelector(`label[for="${el.id}"]`);
      if(lbl) lbl.classList.remove('foco-activo');
      validarCampo(el, true); // Lo validamos al salir
    });

    // Si es el campo de nombre, avisamos cada vez que se escribe algo
    if (el.id === 'campoNombre') {
      el.addEventListener('input', () => registrarEvento(`input (Nombre) → ${el.value.length} caracteres`));
    }
    
    // Si es el de contraseña, calculamos la "fuerza" de la clave
    if (el.id === 'campoClave') {
      el.addEventListener('input', () => {
        const val = el.value;
        let p = 0, color = '';
        if (val.length === 0) { p = 0; }
        else if (val.length < 6) { p = 33; color = 'bg-danger'; } // Muy corta
        else if (val.length >= 6 && !/\d/.test(val)) { p = 66; color = 'bg-warning'; } // Falta un número
        else { p = 100; color = 'bg-success'; } // ¡Perfecta!
        medidor.style.width = p + '%';
        medidor.className = `progress-bar ${color}`;
      });
    }

    // Si cambia el país o los términos
    if (el.id === 'campoPais' || el.id === 'campoTerminos') {
      el.addEventListener('change', () => registrarEvento(`change → ${el.id} modificado a ${el.value || el.checked}`));
    }
  });

  // Función que chequea si un campo cumple con las reglas de arriba
  function validarCampo(el, pintarRes = false) {
    const valido = rules[el.id](el.value, el);
    const msjError = el.parentElement.querySelector('.eval-msg');
    
    if (pintarRes) {
      if (valido) {
        el.classList.remove('campo-error');
        el.classList.add('campo-valido');
        if(msjError) msjError.classList.add('d-none');
      } else {
        el.classList.remove('campo-valido');
        el.classList.add('campo-error');
        // Un pequeño truco para que el campo "tiemble" si está mal
        setTimeout(() => el.classList.remove('campo-error'), 500); 
        if(msjError) msjError.classList.remove('d-none');
      }
    }
    return valido;
  }

  // Cuando intentamos enviar el formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se recargue
    let formValido = true;
    
    // Validamos todos los campos antes de dejar pasar
    inputs.forEach(el => {
      const subValido = validarCampo(el, true);
      if (!subValido) formValido = false;
    });

    if (formValido) {
      banner.classList.remove('d-none'); // Mostramos mensaje de éxito
      setTimeout(() => banner.classList.add('d-none'), 4000);
      registrarEvento("submit → Envío válido completado");
    } else {
      registrarEvento("submit → Fallo de validaciones previas");
      banner.classList.add('d-none');
    }
  });

  form.addEventListener('reset', () => {
    inputs.forEach(el => {
      el.classList.remove('campo-valido', 'campo-error');
      const msg = el.parentElement.querySelector('.eval-msg');
      if (msg) msg.classList.add('d-none');
    });
    medidor.style.width = '0%';
    banner.classList.add('d-none');
    registrarEvento("reset → limpiando formulario por defecto");
  });
});
