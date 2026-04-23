document.addEventListener('DOMContentLoaded', () => {
  const panelLog = document.getElementById('panelLog');
  const btnLimpiar = document.getElementById('btnLimpiar');

  function registrarEvento(mensaje) {
    const entrada = document.createElement('div');
    const hora = new Date().toLocaleTimeString('es-ES', { hour12: false });
    entrada.className = 'd-flex mb-1 mt-1 font-mono align-items-start';
    entrada.innerHTML = `<span class="text-muted me-2">>[${hora}]</span> <span>${mensaje}</span>`;
    panelLog.prepend(entrada);
  }
  btnLimpiar.addEventListener('click', () => panelLog.innerHTML = '');

  // ---------------------------------
  // DEMO A: CRONÓMETRO CON SETINTERVAL
  // ---------------------------------
  let tempInterval = null;
  let tTranscurrido = 0; // ms
  const dCrono = document.getElementById('displayCrono');
  const lVueltas = document.getElementById('listaVueltas');
  const btnIn = document.getElementById('btnCronoIniciar');
  const btnPa = document.getElementById('btnCronoPausa');
  const btnRe = document.getElementById('btnCronoReset');
  const btnVu = document.getElementById('btnCronoVuelta');

  function txtFormato(ms) {
    const d = new Date(ms);
    const m = String(d.getUTCMinutes()).padStart(2, '0');
    const s = String(d.getUTCSeconds()).padStart(2, '0');
    const ml = String(Math.floor(d.getUTCMilliseconds()/10)).padStart(2, '0');
    return `${m}:${s}:${ml}`;
  }

  btnIn.addEventListener('click', () => {
    if (!tempInterval) {
      const startT = Date.now() - tTranscurrido;
      tempInterval = setInterval(() => {
        tTranscurrido = Date.now() - startT;
        dCrono.textContent = txtFormato(tTranscurrido);
      }, 10);
      btnVu.disabled = false;
      registrarEvento("setInterval → cronómetro iniciado");
    }
  });

  btnPa.addEventListener('click', () => {
    if (tempInterval) { clearInterval(tempInterval); tempInterval = null; }
    btnVu.disabled = true;
    registrarEvento("setInterval → cronómetro pausado");
  });

  btnRe.addEventListener('click', () => {
    if (tempInterval) { clearInterval(tempInterval); tempInterval = null; }
    tTranscurrido = 0;
    dCrono.textContent = txtFormato(tTranscurrido);
    lVueltas.innerHTML = '';
    btnVu.disabled = true;
    registrarEvento("setInterval → cronómetro reiniciado");
  });

  btnVu.addEventListener('click', () => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `V. ${lVueltas.children.length + 1} - ${dCrono.textContent}`;
    lVueltas.prepend(li);
    registrarEvento(`Cronómetro → Vuelta guardada`);
  });

  // ---------------------------------
  // DEMO B: CUENTA REGRESIVA SETTIMEOUT
  // ---------------------------------
  let qSegundos = 0;
  let qTotal = 0;
  let tActivo = false;
  const inSeg = document.getElementById('inputSegundos');
  const dAnillo = document.getElementById('anilloCuenta');
  const tAnillo = document.getElementById('textoCuenta');
  const bInC = document.getElementById('btnCuentaInicia');

  function recursivoTimeout() {
    if (!tActivo) return;
    if (qSegundos > 0) {
      qSegundos--;
      tAnillo.textContent = qSegundos;
      
      const conic = `conic-gradient(var(--color-secundario) ${(qSegundos/qTotal)*360}deg, transparent 0deg)`;
      dAnillo.style.background = conic;
      
      setTimeout(recursivoTimeout, 1000);
    } else {
      tAnillo.innerHTML = '<small class="fs-4">¡Tiempo! ⏰</small>';
      dAnillo.classList.add('flash-tiempo');
      setTimeout(()=> dAnillo.classList.remove('flash-tiempo'), 1600);
      bInC.disabled = false;
      tActivo = false;
      registrarEvento("setTimeout → Cuenta finalizada");
    }
  }

  bInC.addEventListener('click', () => {
    let v = parseInt(inSeg.value);
    if (isNaN(v) || v < 5) v = 5; if (v > 60) v = 60;
    inSeg.value = v; qSegundos = v; qTotal = v; tActivo = true;
    bInC.disabled = true;
    tAnillo.textContent = qSegundos;
    dAnillo.style.background = `conic-gradient(var(--color-secundario) 360deg, transparent 0deg)`;
    registrarEvento(`setTimeout → cuenta iniciada desde ${qSegundos}s`);
    setTimeout(recursivoTimeout, 1000); // Call async
  });

  // ---------------------------------
  // DEMO C: AUTO-GUARDADO (SETINTERVAL CADA 5S)
  // ---------------------------------
  const tAutosave = document.getElementById('textoAutosave');
  const bgSave = document.getElementById('badgeGuardado');
  let cacheSave = tAutosave.value;
  let hubocambios = false;

  tAutosave.addEventListener('input', () => {
    if(!hubocambios && tAutosave.value !== cacheSave) {
      hubocambios = true;
      bgSave.textContent = 'Modificado ✏️';
      bgSave.className = 'badge bg-warning text-dark font-mono';
    }
  });

  setInterval(() => {
    if (hubocambios && tAutosave.value !== cacheSave) {
      cacheSave = tAutosave.value;
      hubocambios = false;
      bgSave.textContent = 'Guardado ✓';
      bgSave.className = 'badge bg-success font-mono';
      registrarEvento("setInterval → auto-guardado ejecutado");
      setTimeout(()=> { if(!hubocambios){ bgSave.textContent='Sin cambios'; bgSave.className='badge bg-secondary font-mono';}}, 2000);
    } else {
      registrarEvento("setInterval → Sin cambios para guardar");
    }
  }, 5000);
});
