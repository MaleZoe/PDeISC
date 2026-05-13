window.Renderizador = {
  // Operaciones de UI - Zona de carga
  mostrarArchivoSeleccionado(nombre, tamanioBytes) {
    const badge = document.getElementById('nombreArchivoSeleccionado');
    const pesoMb = (tamanioBytes / (1024 * 1024)).toFixed(2);
    badge.textContent = `${nombre} (${pesoMb} MB)`;
    badge.classList.remove('oculto');
  },
  
  mostrarErrorArchivo(mensaje) {
    this.mostrarToast(mensaje, 'error');
  },

  limpiarZonaCarga() {
    const badge = document.getElementById('nombreArchivoSeleccionado');
    badge.classList.add('oculto');
    badge.textContent = '';
    document.getElementById('inputArchivo').value = '';
  },

  // Visibilidad del panel
  mostrarPanelResultados() {
    document.getElementById('seccionCarga').classList.add('oculto');
    document.getElementById('seccionResultados').classList.remove('oculto');
  },

  ocultarPanelResultados() {
    document.getElementById('seccionResultados').classList.add('oculto');
    document.getElementById('seccionCarga').classList.remove('oculto');
  },

  // Metricas globales
  actualizarMetricas(estado) {
    document.getElementById('nombreArchivoResultado').textContent = estado.nombreArchivo;
    
    // Totales
    document.getElementById('metricaTotalLeidos').textContent = estado.totalLeidos();
    
    // Utiles con animacion
    const metricaUtiles = document.getElementById('metricaUtiles');
    metricaUtiles.textContent = estado.totalUtiles();
    metricaUtiles.style.animation = 'none';
    setTimeout(() => metricaUtiles.style.animation = 'pulsarMetrica 0.4s ease', 10);
    
    // Descartados
    document.getElementById('metricaDescartados').textContent = estado.totalDescartados();
    
    // Porcentaje de interfaz
    const porcentajeNum = parseFloat(estado.porcentajeUtiles());
    const elementoPorcentaje = document.getElementById('metricaPorcentaje');
    elementoPorcentaje.textContent = `${porcentajeNum.toFixed(2)}%`;
    
    // Aplicacion de colores semanticos
    elementoPorcentaje.style.color = porcentajeNum >= 61 ? 'var(--color-exito)' : 
                                     (porcentajeNum >= 31 ? 'var(--color-advertencia)' : 'var(--color-peligro)');
  },

  // Lista de utiles con estatus e iconos
  renderizarListaUtiles(numeros) {
    const lista = document.getElementById('listaUtiles');
    lista.innerHTML = '';

    if (numeros.length === 0) {
      lista.innerHTML = '<li id="estadoVacioUtiles" class="estado-vacio">No se encontraron numeros que cumplan la condicion.</li>';
      return;
    }

    numeros.forEach((numero, indice) => {
      // Determinar condicion matematica para mostrar la chapa
      const stringNumerico = String(Math.floor(Math.abs(numero)));
      const primeraLetra = stringNumerico[0];
      const ultimaLetra = stringNumerico[stringNumerico.length - 1];

      const item = document.createElement('li');
      item.className = 'item-util';
      
      // Controlar el limite de animacion para no alargar tiempos de interfaz (maximo 800ms)
      const retrasoMs = Math.min(indice * 40, 800);
      item.style.animation = `entradaItem 0.25s ease both`;
      item.style.animationDelay = `${retrasoMs}ms`;

      item.innerHTML = `
        <span class="posicion-util">#${indice + 1}</span>
        <span class="valor-util">${numero}</span>
        <span class="badge-palindromico" title="Primer digito igual a ultimo digito">${primeraLetra} = ${ultimaLetra}</span>
      `;
      lista.appendChild(item);
    });
  },

  limpiarListaUtiles() {
    document.getElementById('listaUtiles').innerHTML = '';
  },

  // Lista de descartados con justificacion
  renderizarListaDescartados(numeros) {
    const lista = document.getElementById('listaDescartados');
    lista.innerHTML = '';

    // Cambiar la etiqueta del boton para mostrar cantidad exacta
    const botonToggle = document.getElementById('btnToggleDescartados');
    botonToggle.textContent = `Ver numeros descartados (${numeros.length})`;

    if (numeros.length === 0) {
      lista.innerHTML = '<li class="estado-vacio">No hubo descartes.</li>';
      return;
    }

    numeros.forEach((numero, indice) => {
      const stringNumerico = String(Math.floor(Math.abs(numero)));
      const primeraLetra = stringNumerico[0] || '?';
      const ultimaLetra = stringNumerico[stringNumerico.length - 1] || '?';

      const item = document.createElement('li');
      item.className = 'item-descartado';
      item.innerHTML = `
        <span class="posicion-descartado">#${indice + 1}</span>
        <span class="valor-descartado">${numero}</span>
        <span class="razon-descarte" title="Primer digito distinto al ultimo">${primeraLetra} ≠ ${ultimaLetra}</span>
      `;
      lista.appendChild(item);
    });
  },

  limpiarListaDescartados() {
    document.getElementById('listaDescartados').innerHTML = '';
  },

  // Modificador visual de la barra progresiva
  actualizarBarraPorcentaje(porcentaje) {
    const barra = document.getElementById('barraProgresoPorcentaje');
    const textoBarra = document.getElementById('textoPorcentaje');
    
    barra.style.width = `${porcentaje}%`;
    textoBarra.textContent = `${porcentaje.toFixed(2)}% utiles`;

    let colorFondo = 'var(--color-peligro)';
    if (porcentaje >= 61) colorFondo = 'var(--color-exito)';
    else if (porcentaje >= 31) colorFondo = 'var(--color-advertencia)';
    
    barra.style.backgroundColor = colorFondo;
  },

  // Administracion del boton de red/exportar
  habilitarBotonExportar() {
    const btn = document.getElementById('btnExportar');
    btn.disabled = false;
    btn.textContent = 'Guardar resultado como .txt';
    btn.title = '';
  },

  deshabilitarBotonExportar(razon) {
    const btn = document.getElementById('btnExportar');
    btn.disabled = true;
    btn.title = razon;
  },

  mostrarEstadoCargandoExportar() {
    const btn = document.getElementById('btnExportar');
    btn.disabled = true;
    btn.textContent = 'Guardando...';
  },

  restaurarBotonExportar() {
    // Dependera del estado interno pero asumiendo exito, re-habilita
    this.habilitarBotonExportar();
  },

  // Generador dinamico de alertas flotantes
  mostrarToast(mensaje, tipo = 'info') {
    const contenedor = document.getElementById('contenedorToast');
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${tipo}`;
    toast.textContent = mensaje;

    contenedor.appendChild(toast);

    // Auto-destruccion limpia luego de 4 segundos
    setTimeout(() => {
      toast.style.animation = 'slideInToast 0.3s ease reverse both';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // Reinicia absolutamente toda la pantalla a condiciones de fabrica
  resetearUI() {
    this.ocultarPanelResultados();
    this.limpiarZonaCarga();
    this.limpiarListaUtiles();
    this.limpiarListaDescartados();
    document.getElementById('seccionDescartados').classList.add('oculto');
    this.actualizarBarraPorcentaje(0);
  }
};
