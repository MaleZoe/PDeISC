// aca esta la posta de como se filtran los numeros
export const Filtro = {
  // me fijo si empieza y termina con el mismo numero (ignorando signo y punto)
  esCapicuaExtremo(numero) {
    const s = numero.toString().replace("-", "").replace(".", "");
    if (s.length < 2) {
        return s.length === 1; 
    }
    return s[0] === s[s.length - 1];
  },

  // me fijo si el numero ya es el resultado de un factorial (ej: 24 es 4!)
  esFactorial(n) {
    // los factoriales son enteros positivos
    if (!Number.isInteger(n) || n < 1) return false;
    
    let acumulador = 1;
    let contador = 1;
    
    while (acumulador < n) {
        contador++;
        acumulador *= contador;
    }
    
    return acumulador === n;
  },

  // proceso toda la bolsa de numeros
  filtrar(numeros) {
    const utiles = [];
    const descartados = [];
    const factoriales = [];

    numeros.forEach(num => {
      // 1. chequeo si es util para el profe (extremos iguales)
      if (this.esCapicuaExtremo(num)) {
        utiles.push(num);
      } else {
        descartados.push(num);
      }

      // 2. chequeo si es factorial (independiente de si es util o no)
      if (this.esFactorial(num)) {
        factoriales.push(num);
      }
    });

    // ordeno los utiles de menor a mayor
    utiles.sort((a, b) => a - b);

    return { utiles, descartados, factoriales };
  }
};
