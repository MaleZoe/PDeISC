document.addEventListener('DOMContentLoaded', () => {
  const panelLog = document.getElementById('panelLog');
  const btnLimpiar = document.getElementById('btnLimpiar');
  const areaTxt = document.getElementById('entradaTexto');
  
  const bKey = document.getElementById('badgeKey');
  const bCode = document.getElementById('badgeCode');
  const bCtrl = document.getElementById('badgeCtrl');
  const bAlt = document.getElementById('badgeAlt');
  const bShift = document.getElementById('badgeShift');
  const contador = document.getElementById('contador');

  function registrarEvento(mensaje) {
    const entrada = document.createElement('div');
    const hora = new Date().toLocaleTimeString('es-ES', { hour12: false });
    entrada.className = 'd-flex mb-1 align-items-start';
    entrada.innerHTML = `<span class="text-muted me-2 font-mono">>[${hora}]</span> <span>${mensaje}</span>`;
    panelLog.prepend(entrada);
  }

  btnLimpiar.addEventListener('click', () => panelLog.innerHTML = '');

  function mostrarModificador(estado, badge) {
    if (estado) {
      badge.classList.remove('opacity-30', 'bg-neutral');
      badge.classList.add('bg-warning', 'text-dark', 'fw-bold');
    } else {
      badge.classList.add('opacity-30', 'bg-neutral');
      badge.classList.remove('bg-warning', 'text-dark', 'fw-bold');
    }
  }

  function lanzaToast(msg) {
    const contenedor = document.getElementById('contenedorToasts');
    const html = `
      <div class="toast align-items-center text-bg-success border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body fw-bold text-dark">${msg}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>`;
    contenedor.innerHTML = html;
    setTimeout(() => { contenedor.innerHTML = ''; }, 3000);
  }

  areaTxt.addEventListener('keydown', (e) => {
    bKey.textContent = `Tecla: ${e.key === ' ' ? 'Space' : e.key}`;
    bCode.textContent = `Código: ${e.code}`;
    mostrarModificador(e.ctrlKey, bCtrl);
    mostrarModificador(e.altKey, bAlt);
    mostrarModificador(e.shiftKey, bShift);

    if (e.key === 's' && e.ctrlKey) {
      e.preventDefault();
      lanzaToast("¡Guardado simulado! ✓");
      registrarEvento(`Ctrl+S → guardado simulado`);
    } else if (e.key === 'Escape') {
      areaTxt.value = '';
      contador.textContent = '0 caracteres, 0 palabras';
      registrarEvento(`Escape → área limpiada`);
    } else {
      registrarEvento(`keydown → '${e.key}' (Código: ${e.code})`);
    }
  });

  areaTxt.addEventListener('keyup', () => {
    bKey.textContent = `Tecla: -`;
    bCode.textContent = `Código: -`;
    mostrarModificador(false, bCtrl);
    mostrarModificador(false, bAlt);
    mostrarModificador(false, bShift);
    registrarEvento(`keyup → tecla liberada`);
  });

  // Se prefiere "input" para contar porque registra cualquier texto introducido
  // de forma efectiva sin importar si fue tecleado, pegado con el mouse, o dictado por voz, 
  // contrariamente a keydown que solo registra pulsaciones físicas directas.
  areaTxt.addEventListener('input', () => {
    const val = areaTxt.value;
    const caracteres = val.length;
    const palabras = val.trim() === '' ? 0 : val.trim().split(/\s+/).length;
    contador.textContent = `${caracteres} caracteres, ${palabras} palabras`;
    registrarEvento(`input → ${caracteres} caracteres, ${palabras} palabras`);
  });
});
