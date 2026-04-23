document.addEventListener('DOMContentLoaded', () => {
  const panelLog = document.getElementById('panelLog');
  const btnLimpiar = document.getElementById('btnLimpiar');
  const barraProgreso = document.getElementById('barraProgreso');
  const fabBtn = document.getElementById('fabBtn');
  const viewportBadge = document.getElementById('badgeViewport');
  
  function registrarEvento(mensaje) {
    const entrada = document.createElement('div');
    const hora = new Date().toLocaleTimeString('es-ES', { hour12: false });
    entrada.className = 'd-flex mb-1 align-items-start';
    entrada.innerHTML = `<span class="text-muted me-2 font-mono">>[${hora}]</span> <span>${mensaje}</span>`;
    panelLog.prepend(entrada);
  }

  btnLimpiar.addEventListener('click', () => panelLog.innerHTML = '');

  // Log en Load
  window.addEventListener('load', () => {
    const toastHtml = `
    <div class="toast align-items-center text-bg-primario border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body fw-bold text-dark">Bienvenido, la exploración está lista.</div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>`;
    document.getElementById('contenedorToasts').innerHTML = toastHtml;
    setTimeout(() => { document.getElementById('contenedorToasts').innerHTML = '' }, 3000);
    registrarEvento(`load → página cargada completamente`);
  });

  // Resize en vivo
  function actualizaResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    viewportBadge.textContent = `${w}px × ${h}px`;
    registrarEvento(`resize → ${w}px × ${h}px`);
  }
  window.addEventListener('resize', actualizaResize);
  actualizaResize(); // Invocar inicio

  // Evento Scroll Progress y Mostrar FAB
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // Evitar porcentaje NaN en caso no sea scrolleable (poco probable dado dummy blocks)
    let p = height > 0 ? (winScroll / height) * 100 : 0; 
    barraProgreso.style.width = p + "%";
    registrarEvento(`scroll → ${Math.round(p)}% del documento`);

    if (winScroll > 200) {
      fabBtn.classList.remove('d-none');
    } else {
      fabBtn.classList.add('d-none');
    }
  });

  fabBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // VisibilityChange Documento Pestaña
  document.addEventListener('visibilitychange', () => {
    const estado = document.hidden ? 'oculta' : 'visible';
    registrarEvento(`visibilitychange → pestaña ${estado}`);
  });
});
