document.addEventListener('DOMContentLoaded', () => {
  // Referencias a los elementos interactivos
  const inputArchivo = document.getElementById('inputArchivo');
  const zonaArrastre = document.getElementById('zonaArrastre');
  const btnSeleccionarArchivo = document.getElementById('btnSeleccionarArchivo');
  const btnExportar = document.getElementById('btnExportar');
  const btnNuevoArchivo = document.getElementById('btnNuevoArchivo');
  const btnToggleDescartados = document.getElementById('btnToggleDescartados');
  const seccionDescartados = document.getElementById('seccionDescartados');

  // Constante requerida: maximo 5MB por carga
  const MAXIMO_BYTES = 5 * 1024 * 1024;

  // Lógica principal de procesamiento asincrono de archivos de cliente
  const procesarArchivoDeUsuario = (archivo) => {
    // 1. Verificar existencia de extension correcta
    if (!archivo.name.endsWith('.txt')) {
      window.Renderizador.mostrarErrorArchivo('El archivo debe tener extension .txt');
      return;
    }

    // 2. Control estricto de limite de peso
    if (archivo.size > MAXIMO_BYTES) {
      window.Renderizador.mostrarErrorArchivo('El archivo excede el limite maximo de 5MB');
      return;
    }

    // Actualizar visual en la zona de drop
    window.Renderizador.mostrarArchivoSeleccionado(archivo.name, archivo.size);

    // 3. Comenzar lectura del blob como cadena de texto
    const lector = new FileReader();

    lector.onload = (evento) => {
      const contenidoTexto = evento.target.result;
      
      // a. Cargar al estado
      window.Estado.cargarDesdeTexto(archivo.name, contenidoTexto);
      
      // b. Actualizar marcadores estaticos
      window.Renderizador.actualizarMetricas(window.Estado);
      
      // c. Construir DOM de arreglos
      window.Renderizador.renderizarListaUtiles(window.Estado.numerosUtiles);
      
      // d. Construir DOM de listados secundarios
      window.Renderizador.renderizarListaDescartados(window.Estado.numerosDescartados);
      
      // e. Animacion progresiva
      window.Renderizador.actualizarBarraPorcentaje(parseFloat(window.Estado.porcentajeUtiles()));
      
      // f. Transicionar vistas
      window.Renderizador.mostrarPanelResultados();

      // g. Validaciones criticas de exportacion post-carga
      if (window.Estado.totalLeidos() === 0) {
        window.Renderizador.mostrarToast("No se encontraron numeros validos en el archivo.", "advertencia");
        window.Renderizador.deshabilitarBotonExportar("No hay informacion numerica");
      } else if (window.Estado.totalUtiles() === 0) {
        window.Renderizador.deshabilitarBotonExportar("No hay numeros utiles para exportar.");
      } else {
        window.Renderizador.habilitarBotonExportar();
      }
    };

    lector.onerror = () => {
      window.Renderizador.mostrarErrorArchivo("Error de lectura interno del navegador.");
    };

    lector.readAsText(archivo, 'utf-8');
  };

  // Evento estandar por boton de buscar
  btnSeleccionarArchivo.addEventListener('click', () => {
    inputArchivo.click();
  });

  // Evento cuando el sistema de carpetas emite una carga
  inputArchivo.addEventListener('change', (evento) => {
    if (evento.target.files.length > 0) {
      procesarArchivoDeUsuario(evento.target.files[0]);
    }
  });

  // Optimizacion visual de drag and drop interactivo
  zonaArrastre.addEventListener('dragover', (evento) => {
    evento.preventDefault();
    zonaArrastre.classList.add('drag-activo');
  });

  zonaArrastre.addEventListener('dragleave', () => {
    zonaArrastre.classList.remove('drag-activo');
  });

  zonaArrastre.addEventListener('drop', (evento) => {
    evento.preventDefault();
    zonaArrastre.classList.remove('drag-activo');
    
    if (evento.dataTransfer.files.length > 0) {
      procesarArchivoDeUsuario(evento.dataTransfer.files[0]);
    }
  });

  // Peticion asincrona para guardar los datos localmente en backend
  btnExportar.addEventListener('click', async () => {
    // Prevencion segura contra envios vacios
    if (window.Estado.totalLeidos() === 0) {
      window.Renderizador.mostrarToast("No hay registros disponibles para exportar.", "advertencia");
      return;
    }

    // Feedback inmediato de proceso pendiente
    window.Renderizador.mostrarEstadoCargandoExportar();

    try {
      const peticion = await fetch('/exportar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(window.Estado.generarPayload())
      });

      const respuesta = await peticion.json();

      if (respuesta.ok === true) {
        window.Renderizador.mostrarToast('Archivo guardado: filtrado_resultado.txt', 'exito');
      } else {
        window.Renderizador.mostrarToast(respuesta.error || 'Ocurrio un error desconocido al exportar.', 'error');
      }
    } catch (error) {
      window.Renderizador.mostrarToast("Error de comunicacion con el servidor Express.", "error");
    } finally {
      // Restablecer interfaz tras accion de red independientemente del exito
      window.Renderizador.restaurarBotonExportar();
    }
  });

  // Limpiar memoria y vista
  btnNuevoArchivo.addEventListener('click', () => {
    window.Estado.resetear();
    window.Renderizador.resetearUI();
  });

  // Comportamiento del desplegable de elementos de descarte
  btnToggleDescartados.addEventListener('click', () => {
    seccionDescartados.classList.toggle('oculto');
  });
});
