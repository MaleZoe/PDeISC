// el cerebro del filtrado - proyecto 2
import { Estado } from '../modules/estado.js';
import { Renderizador } from '../modules/renderizador.js';

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const btnExportar = document.getElementById('btnExportar');
  const zonaCarga = document.getElementById('zonaCarga');

  // cuando eligen un archivo
  fileInput.addEventListener('change', manejarCargaArchivo);

  // por si quieren arrastrar el archivo 
  zonaCarga.addEventListener('dragover', (e) => {
    e.preventDefault();
    zonaCarga.classList.add('dragover');
  });

  zonaCarga.addEventListener('dragleave', () => {
    zonaCarga.classList.remove('dragover');
  });

  zonaCarga.addEventListener('drop', (e) => {
    e.preventDefault();
    zonaCarga.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      procesarArchivo(e.dataTransfer.files[0]);
    }
  });

  // cuando quieren bajar el txt con el resultado
  btnExportar.addEventListener('click', manejarExportacion);

  function manejarCargaArchivo(e) {
    if (e.target.files.length > 0) {
      procesarArchivo(e.target.files[0]);
    }
  }

  // aca mando el archivo al server 
  async function procesarArchivo(archivo) {
    // valido que sea txt como dice el profe
    if (!archivo.name.endsWith('.txt')) {
      Renderizador.mostrarToast("mandame un .txt flaco, no adivino", "error");
      return;
    }

    Renderizador.mostrarToast("subiendo y procesando...", "info");

    const formData = new FormData();
    formData.append('archivo', archivo);

    try {
      const respuesta = await fetch('/procesar', {
        method: 'POST',
        body: formData
      });

      if (!respuesta.ok || !respuesta.headers.get('content-type')?.includes('application/json')) {
        const text = await respuesta.text();
        console.error("Respuesta no JSON:", text);
        throw new Error("Error en el servidor (no devolvió JSON)");
      }

      const data = await respuesta.json();

      if (data.ok) {
        // guardo los resultados que me mando el server
        Estado.setResultado({
          archivo: data.archivoOrigen,
          total: data.totalLeidos,
          utiles: data.numerosUtiles,
          descartados: data.numerosDescartados,
          factoriales: data.numerosFactoriales
        });

        // dibujo todo
        Renderizador.actualizarInfoArchivo(data.archivoOrigen);
        Renderizador.actualizarEstadisticas(Estado);
        Renderizador.llenarListaUtiles(Estado.numerosUtiles);
        Renderizador.mostrarFactoriales(Estado.numerosFactoriales);
        Renderizador.mostrarToast("procesado en el backend con exito!", "exito");
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      Renderizador.mostrarToast(err.message || "se cayo el server procesando", "error");
    }
  }

  // mando al server para guardar el reporte final
  async function manejarExportacion() {
    if (!Estado.tieneDatos()) return;

    btnExportar.disabled = true;
    btnExportar.textContent = "guardando...";

    try {
      const respuesta = await fetch('/guardar-resultado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            numerosUtiles: Estado.numerosUtiles,
            stats: {
                archivoOrigen: Estado.archivoOrigen,
                totalLeidos: Estado.totalLeidos,
                totalUtiles: Estado.totalUtiles,
                porcentajeUtiles: Estado.porcentajeUtiles
            }
        })
      });

      const data = await respuesta.json();
      if (data.ok) {
        Renderizador.mostrarToast("se guardo en el servidor: " + data.archivo, "exito");
        
        // TAMBIEN disparar descarga en el navegador por las dudas
        const contenido = `=== REPORTE DE FILTRADO (ESTANGA) ===\n` +
                        `Archivo Origen: ${Estado.archivoOrigen}\n` +
                        `Total Leidos: ${Estado.totalLeidos}\n` +
                        `Utiles: ${Estado.totalUtiles} (${Estado.porcentajeUtiles}%)\n` +
                        `------------------------------------\n` +
                        Estado.numerosUtiles.join('\n');
        
        const blob = new Blob([contenido], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = data.archivo;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      Renderizador.mostrarToast("error al guardar en el server", "error");
    } finally {
      btnExportar.disabled = false;
      btnExportar.textContent = "Exportar Resultados";
    }
  }

  // --- ESCUCHO AL PROYECTO 1 ---
  window.addEventListener('procesarP1', async (e) => {
    const { nombre } = e.detail;
    Renderizador.mostrarToast(`Cargando ${nombre} desde P1...`, "info");

    try {
      const res = await fetch('/procesar-p1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre })
      });
      
      if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
        throw new Error("Error en el servidor o archivo no encontrado");
      }

      const data = await res.json();

      if (data.ok) {
        Estado.setResultado({
          archivo: data.archivoOrigen,
          total: data.totalLeidos,
          utiles: data.numerosUtiles,
          descartados: data.numerosDescartados,
          factoriales: data.numerosFactoriales
        });

        Renderizador.actualizarInfoArchivo("(Servidor P1) " + data.archivoOrigen);
        Renderizador.actualizarEstadisticas(Estado);
        Renderizador.llenarListaUtiles(Estado.numerosUtiles);
        Renderizador.mostrarFactoriales(Estado.numerosFactoriales);
        Renderizador.mostrarToast("Archivo de P1 procesado!", "exito");
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      Renderizador.mostrarToast(err.message || "Error al procesar desde P1", "error");
    }
  });
});
