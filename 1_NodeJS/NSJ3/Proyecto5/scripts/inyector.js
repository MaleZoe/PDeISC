// scripts/inyector.js
// Lógica simplificada de inyección vía innerHTML

// Contador total de inyecciones realizadas
let contadorInyecciones = 0;

window.Inyector = {
  inyectar,
  limpiarCanvas,
  manejarEnvio
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnLimpiarCanvas').addEventListener('click', limpiarCanvas);
});

// Inyecta el HTML de una plantilla en el canvas usando += (acumulación)
function inyectar(nombrePlantilla, opciones = {}) {
  const canvas = document.getElementById('canvasInyeccion');
  const plantillaFn = window.PLANTILLAS[nombrePlantilla];

  if (!plantillaFn) {
    console.error(`Plantilla no encontrada: ${nombrePlantilla}`);
    return;
  }

  // Obtener el string HTML de la plantilla
  const htmlString = plantillaFn(opciones);

  // Inyección via innerHTML — Método central solicitado
  canvas.innerHTML += htmlString;

  // Actualizar estado
  contadorInyecciones++;
  actualizarContador();
  verificarPlaceholder();

  // Aplicar animación solo al último hijo
  const ultimoHijo = canvas.lastElementChild;
  if (ultimoHijo && ultimoHijo.id !== 'placeholderCanvas') {
    ultimoHijo.classList.add('entrada-objeto');
    // Scroll suave hacia el nuevo elemento
    ultimoHijo.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  // Notificar al visor para que actualice el código mostrado
  window.Visor.actualizar(canvas.innerHTML);
}

// Maneja el envío del formulario inyectado
function manejarEnvio(evento) {
  evento.preventDefault();
  
  const form = evento.target;
  const nombre = form.querySelector('#inputNombre')?.value || 'Usuario';
  
  // Ocultar el formulario con una pequeña animación
  form.style.opacity = '0.5';
  form.style.pointerEvents = 'none';

  // Inyectar una alerta de éxito usando el sistema de plantillas
  inyectar('alerta', { 
    tipo: 'exito', 
    mensaje: `¡Gracias ${nombre}! Tu mensaje ha sido enviado correctamente.` 
  });

  // Limpiar el formulario después de un momento
  setTimeout(() => {
    form.reset();
    form.style.opacity = '1';
    form.style.pointerEvents = 'all';
  }, 1000);
}

// Actualiza el contador visual
function actualizarContador() {
  document.getElementById('contadorInyecciones').textContent = contadorInyecciones;
}

// Verifica si el canvas tiene contenido (para mostrar/ocultar placeholder)
function verificarPlaceholder() {
  const canvas = document.getElementById('canvasInyeccion');
  let placeholder = document.getElementById('placeholderCanvas');
  
  // Si se borró accidentalmente, lo recreamos
  if (!placeholder) {
    canvas.insertAdjacentHTML('afterbegin', `
      <div id="placeholderCanvas" class="placeholder-canvas">
        <span class="placeholder-icono">🎨</span>
        <p>El canvas está vacío.</p>
        <p>Seleccioná un objeto del panel izquierdo para inyectarlo vía <code>innerHTML</code>.</p>
      </div>
    `);
    placeholder = document.getElementById('placeholderCanvas');
  }

  const elementos = Array.from(canvas.children).filter(el => el.id !== 'placeholderCanvas');
  
  if (elementos.length > 0) {
    placeholder.classList.add('oculto');
  } else {
    placeholder.classList.remove('oculto');
  }
}

// Limpia el canvas
function limpiarCanvas() {
  document.getElementById('canvasInyeccion').innerHTML = '';
  window.Visor.actualizar('');
  verificarPlaceholder();
  contadorInyecciones = 0;
  actualizarContador();
}
