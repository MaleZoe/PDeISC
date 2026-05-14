// aca dibujo todo lo del filtro
export const Renderizador = {
  // elementos del dom (se inicializan al primer uso)
  get elementos() {
    if (!this._elementos) {
      this._elementos = {
        zonaCarga: document.getElementById('zonaCarga'),
        fileInput: document.getElementById('fileInput'),
        stats: {
          total: document.getElementById('statTotal'),
          utiles: document.getElementById('statUtiles'),
          descartados: document.getElementById('statDescartados'),
          porcentaje: document.getElementById('statPorcentaje')
        },
        listaUtiles: document.getElementById('listaUtiles'),
        btnExportar: document.getElementById('btnExportar'),
        contenedorToast: document.getElementById('contenedorToast'),
        nombreArchivo: document.getElementById('nombreArchivo'),
        contenedorFactoriales: document.getElementById('contenedorFactoriales')
      };
    }
    return this._elementos;
  },

  // para mostrar que archivo cargaron
  actualizarInfoArchivo(nombre) {
    this.elementos.nombreArchivo.textContent = nombre || 'Ninguno';
  },

  // dibujo las estadisticas en los cuadraditos
  actualizarEstadisticas(datos) {
    this.elementos.stats.total.textContent = datos.totalLeidos;
    this.elementos.stats.utiles.textContent = datos.totalUtiles;
    this.elementos.stats.descartados.textContent = datos.totalDescartados;
    this.elementos.stats.porcentaje.textContent = datos.porcentajeUtiles + '%';
    
    // prendo el boton de guardar si hay algo
    this.elementos.btnExportar.disabled = datos.totalLeidos === 0;
  },

  // pongo los numeros utiles en la lista de la derecha
  llenarListaUtiles(numeros) {
    this.elementos.listaUtiles.innerHTML = '';
    
    if (numeros.length === 0) {
      this.elementos.listaUtiles.innerHTML = '<li class="text-muted text-center py-4">No hay numeros utiles</li>';
      return;
    }

    numeros.forEach((num, i) => {
      const li = document.createElement('li');
      li.className = 'item-numero-util';
      li.innerHTML = `<span>#${i + 1}</span> <strong>${num}</strong>`;
      this.elementos.listaUtiles.appendChild(li);
    });
  },

  // dibujo los factoriales en su cajita
  mostrarFactoriales(numeros) {
    this.elementos.contenedorFactoriales.innerHTML = '';
    
    if (numeros.length === 0) {
      this.elementos.contenedorFactoriales.innerHTML = '<p class="text-muted text-center py-3">No se detectaron factoriales</p>';
      return;
    }

    const div = document.createElement('div');
    div.className = 'd-flex flex-wrap gap-2 justify-content-center';
    
    numeros.forEach(num => {
      const span = document.createElement('span');
      span.className = 'badge bg-accent p-2';
      span.innerHTML = `${num} &rarr; factorial`;
      div.appendChild(span);
    });

    this.elementos.contenedorFactoriales.appendChild(div);
  },

  // aviso cosas con los toast
  mostrarToast(mensaje, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${tipo}`;
    toast.textContent = mensaje;
    this.elementos.contenedorToast.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }
};
