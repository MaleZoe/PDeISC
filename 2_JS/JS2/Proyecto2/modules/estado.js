// aca guardo como viene la mano con el filtrado
export const Estado = {
  archivoOrigen: null,
  totalLeidos: 0,
  totalUtiles: 0,
  totalDescartados: 0,
  porcentajeUtiles: 0,
  numerosUtiles: [],
  numerosDescartados: [],
  numerosFactoriales: [],

  // para resetear cuando cargan uno nuevo
  reiniciar() {
    this.archivoOrigen = null;
    this.totalLeidos = 0;
    this.totalUtiles = 0;
    this.totalDescartados = 0;
    this.porcentajeUtiles = 0;
    this.numerosUtiles = [];
    this.numerosDescartados = [];
    this.numerosFactoriales = [];
  },

  // aca guardo el resultado que tiro el filtro
  setResultado(resultado) {
    this.archivoOrigen = resultado.archivo;
    this.totalLeidos = resultado.total;
    this.totalUtiles = resultado.utiles.length;
    this.totalDescartados = resultado.descartados.length;
    this.numerosUtiles = resultado.utiles;
    this.numerosDescartados = resultado.descartados;
    this.numerosFactoriales = resultado.factoriales || [];
    
    // calculo el porcentaje para la vista
    if (this.totalLeidos > 0) {
      this.porcentajeUtiles = ((this.totalUtiles / this.totalLeidos) * 100).toFixed(1);
    } else {
      this.porcentajeUtiles = 0;
    }
  },

  // para saber si hay algo para mandar al server
  tieneDatos() {
    return this.totalLeidos > 0;
  }
};
