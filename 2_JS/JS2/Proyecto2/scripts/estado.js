window.Estado = {
  // Propiedades globales para identificar el lote actual
  nombreArchivo: null,
  textoOriginal: '',

  // Estructuras de almacenamiento de numeros
  numerosLeidos: [],
  numerosUtiles: [],
  numerosDescartados: [],

  // Funciones estadisticas (calculadas al vuelo)
  totalLeidos() {
    return this.numerosLeidos.length;
  },
  totalUtiles() {
    return this.numerosUtiles.length;
  },
  totalDescartados() {
    return this.numerosDescartados.length;
  },
  porcentajeUtiles() {
    if (this.totalLeidos() === 0) return "0.00";
    return ((this.totalUtiles() / this.totalLeidos()) * 100).toFixed(2);
  },
  porcentajeDescartados() {
    if (this.totalLeidos() === 0) return "0.00";
    return ((this.totalDescartados() / this.totalLeidos()) * 100).toFixed(2);
  },

  // Flujo principal de procesamiento
  cargarDesdeTexto(nombreArchivo, texto) {
    // 1. Guardar referencia original
    this.nombreArchivo = nombreArchivo;
    this.textoOriginal = texto;

    // 2. Extraer datos en crudo
    const extraidos = window.Parser.extraerNumeros(texto);

    // 3. Eliminar duplicados matematicos manteniendo el orden
    // Utilizando Set basado en los numeros reales para evitar fallos con ceros
    const deduplicados = [...new Set(extraidos)];

    // 4. Filtrar numeros segun requerimiento de digitos
    const resultados = window.Filtro.aplicarFiltro(deduplicados);

    // 5. Ordenar ascendente y almacenar utiles
    this.numerosUtiles = window.Filtro.ordenarAscendente(resultados.utiles);

    // 6. Almacenar descartados preservando orden original
    this.numerosDescartados = resultados.descartados;

    // 7. Almacenar todos los validos en registro global
    this.numerosLeidos = deduplicados;
  },

  // Limpia completamente el estado en memoria
  resetear() {
    this.nombreArchivo = null;
    this.textoOriginal = '';
    this.numerosLeidos = [];
    this.numerosUtiles = [];
    this.numerosDescartados = [];
  },

  // Prepara el paquete exacto requerido por el endpoint POST /exportar
  generarPayload() {
    return {
      archivoOrigen: this.nombreArchivo,
      totalLeidos: this.totalLeidos(),
      totalUtiles: this.totalUtiles(),
      totalDescartados: this.totalDescartados(),
      porcentajeUtiles: parseFloat(this.porcentajeUtiles()),
      numerosUtiles: this.numerosUtiles,
      numerosDescartados: this.numerosDescartados
    };
  }
};
