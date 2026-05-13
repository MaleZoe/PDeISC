window.Filtro = {
  // Verifica si el primer digito de un numero coincide con su ultimo digito
  esPalindromicoPorDigitos(numero) {
    // Si no es un numero finito, retornar falso en lugar de arrojar error
    if (!isFinite(numero)) return false;

    // Tomar valor absoluto y quedarse unicamente con la parte entera (truncando decimales)
    const absStr = String(Math.floor(Math.abs(numero)));

    // Si tiene un solo digito, siempre cumple la condicion
    if (absStr.length === 1) return true;

    // Retorna verdadero si el primer caracter es igual al ultimo
    return absStr[0] === absStr[absStr.length - 1];
  },

  // Aplica la condicion de filtrado a un listado entero de numeros
  aplicarFiltro(numeros) {
    const utiles = [];
    const descartados = [];
    const invalidos = [];

    for (const num of numeros) {
      // Filtrar posibles errores silenciosos o valores matematicos invalidos
      if (!isFinite(num)) {
        invalidos.push(num);
        continue;
      }

      // Aplicar regla de negocio
      if (this.esPalindromicoPorDigitos(num)) {
        utiles.push(num);
      } else {
        descartados.push(num);
      }
    }

    return { utiles, descartados, invalidos };
  },

  // Retorna una nueva copia del arreglo ordenada matematicamente de menor a mayor
  ordenarAscendente(numeros) {
    return [...numeros].sort((a, b) => a - b);
  }
};
