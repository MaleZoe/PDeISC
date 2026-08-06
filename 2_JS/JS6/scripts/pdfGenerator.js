/**
 * ============================================================================
 * GENERADOR DE REPORTES Y DIPLOMAS EN PDF (/scripts/pdfGenerator.js)
 * ============================================================================
 * Explicación didáctica:
 * Módulo encargado de cumplir el requisito de exportación a PDF usando la librería
 * `jsPDF` (cargada externamente desde CDN para no requerir bundlers pesados).
 * 
 * Diseñamos dos tipos de documentos profesionales:
 * 1. Diploma Individual de Partida Ganada (Certificado de Rendimiento).
 * 2. Reporte General de la Tabla de Posiciones (Ranking Oficial).
 */

export class GeneradorPDF {
  /**
   * Comprueba si la librería jsPDF está disponible en el ámbito global del navegador.
   * @returns {boolean}
   */
  static verificarLibreria() {
    if (typeof window !== 'undefined' && window.jspdf && window.jspdf.jsPDF) {
      return true;
    }
    console.error('❌ Error: La librería jsPDF no está cargada o no se encuentra en window.jspdf.');
    return false;
  }

  /**
   * Genera y descarga un Diploma Oficial de Partida Ganada.
   * @param {Object} datos - { nombre, puntos, tiempo, palabra, categoria }
   */
  static descargarDiplomaPartida(datos) {
    if (!this.verificarLibreria()) {
      console.error('Error: La librería jsPDF no ha terminado de cargar. Por favor intente de nuevo en unos segundos.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const ancho = doc.internal.pageSize.getWidth();
    const alto = doc.internal.pageSize.getHeight();

    // 1. Marco perimetral decorativo del certificado
    doc.setLineWidth(2.5);
    doc.setDrawColor(33, 37, 41); // Gris oscuro elegante
    doc.rect(10, 10, ancho - 20, alto - 20);

    doc.setLineWidth(0.8);
    doc.setDrawColor(13, 110, 253); // Azul primario Bootstrap
    doc.rect(13, 13, ancho - 26, alto - 26);

    // 2. Cabecera académica institucional
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(108, 117, 125);
    doc.text('UNIVERSIDAD / INSTITUTO TECNOLÓGICO ACADÉMICO', ancho / 2, 28, { align: 'center' });

    doc.setFontSize(12);
    doc.text('Trabajo Práctico Profesional - Especialización Full Stack Node.js & Express', ancho / 2, 35, { align: 'center' });

    // 3. Título del Diploma
    doc.setFontSize(28);
    doc.setTextColor(13, 110, 253);
    doc.text('CERTIFICADO DE EXCELENCIA Y LOGRO', ancho / 2, 55, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(33, 37, 41);
    doc.text('Por medio del presente documento se certifica formalmente que:', ancho / 2, 70, { align: 'center' });

    // 4. Nombre del Jugador
    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(32);
    doc.setTextColor(25, 135, 84); // Verde éxito
    doc.text(datos.nombre || 'Jugador Anónimo', ancho / 2, 90, { align: 'center' });

    // Línea de subrayado debajo del nombre
    doc.setLineWidth(0.5);
    doc.setDrawColor(25, 135, 84);
    doc.line(ancho / 2 - 70, 93, ancho / 2 + 70, 93);

    // 5. Cuerpo y descripción del logro
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(33, 37, 41);
    doc.text(
      `Ha superado con éxito el desafío lógico del "Juego del Ahorcado" en el servidor oficial,`,
      ancho / 2,
      108,
      { align: 'center' }
    );
    doc.text(
      `descubriendo la palabra oculta "${datos.palabra || 'DESARROLLO'}" (${datos.categoria || 'General'}).`,
      ancho / 2,
      116,
      { align: 'center' }
    );

    // 6. Caja de Estadísticas / Cuadro de Honor
    const boxX = ancho / 2 - 90;
    const boxY = 128;
    const boxW = 180;
    const boxH = 30;

    doc.setFillColor(248, 249, 250);
    doc.setDrawColor(222, 226, 230);
    doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(13, 110, 253);
    doc.text('PUNTUACIÓN TOTAL:', boxX + 25, boxY + 13);
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41);
    doc.text(`${datos.puntos || 0} PTS`, boxX + 25, boxY + 23);

    doc.setFontSize(13);
    doc.setTextColor(13, 110, 253);
    doc.text('TIEMPO DE PARTIDA:', boxX + 115, boxY + 13);
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41);
    doc.text(`${datos.tiempo || 0} SEGUNDOS`, boxX + 115, boxY + 23);

    // 7. Pie y fecha oficial
    const fechaActual = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(108, 117, 125);
    doc.text(`Emitido automáticamente por el Sistema API REST en fecha: ${fechaActual}`, ancho / 2, 175, { align: 'center' });
    doc.text('Firma Digital y Sello de Calidad del Proyecto Full Stack Node.js + MySQL', ancho / 2, 182, { align: 'center' });

    // Descargar el archivo
    const nombreArchivo = `Diploma_Ahorcado_${(datos.nombre || 'Jugador').replace(/\s+/g, '_')}.pdf`;
    doc.save(nombreArchivo);
  }

  /**
   * Genera un reporte PDF con la tabla completa de posiciones y ranking general.
   * @param {Array} scores - Arreglo de objetos del Top Ranking
   */
  static descargarReporteRanking(scores) {
    if (!this.verificarLibreria()) {
      console.error('Error: La librería jsPDF no ha terminado de cargar.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const ancho = doc.internal.pageSize.getWidth();

    // 1. Cabecera del Reporte
    doc.setFillColor(13, 110, 253);
    doc.rect(0, 0, ancho, 35, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('TABLA DE POSICIONES OFICIAL', 15, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Trabajo Práctico Profesional: Juego del Ahorcado Full Stack (MySQL + Node.js)', 15, 27);

    // 2. Información General
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(108, 117, 125);
    const fechaActual = new Date().toLocaleString('es-ES');
    doc.text(`Reporte generado el: ${fechaActual} | Total de registros evaluados: ${scores.length}`, 15, 45);

    // 3. Encabezados de la Tabla Manual / Estructurada en Canvas
    let y = 55;
    const hRow = 10;

    // Encabezado de columnas
    doc.setFillColor(33, 37, 41);
    doc.rect(15, y, ancho - 30, hRow, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('#', 20, y + 6.5);
    doc.text('JUGADOR', 35, y + 6.5);
    doc.text('PUNTOS', 115, y + 6.5);
    doc.text('TIEMPO', 145, y + 6.5);
    doc.text('FECHA REGISTRO', 170, y + 6.5);

    y += hRow;

    // 4. Filas de datos
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    if (!scores || scores.length === 0) {
      doc.setTextColor(108, 117, 125);
      doc.text('No hay puntuaciones registradas en la base de datos aún.', 20, y + 10);
    } else {
      scores.forEach((item, index) => {
        // Alternar colores de fondo para legibilidad (Zebra striping)
        if (index % 2 === 0) {
          doc.setFillColor(248, 249, 250);
          doc.rect(15, y, ancho - 30, hRow, 'F');
        }

        doc.setTextColor(33, 37, 41);
        doc.setFont('helvetica', index < 3 ? 'bold' : 'normal'); // Destacar Top 3

        doc.text(`${index + 1}º`, 20, y + 6.5);
        doc.text(item.nombre || 'Anónimo', 35, y + 6.5);
        
        doc.setTextColor(13, 110, 253);
        doc.text(`${item.puntos} pts`, 115, y + 6.5);
        
        doc.setTextColor(33, 37, 41);
        doc.text(`${item.tiempo}s`, 145, y + 6.5);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(item.fecha_formateada || item.fecha || '-', 170, y + 6.5);
        doc.setFontSize(10);

        y += hRow;

        // Si se supera la página, crear nueva (paginación básica)
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    }

    // 5. Pie del Documento
    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${totalPaginas} - Sistema Académico de Evaluación Profesional`,
        ancho / 2,
        287,
        { align: 'center' }
      );
    }

    doc.save('Reporte_Ranking_Ahorcado_MySQL.pdf');
  }
}

export default GeneradorPDF;
