// aca limpio el texto del archivo para sacar los numeros
export const Parser = {
  // agarro el choclo de texto y devuelvo un array de numeros
  parsear(texto) {
    if (!texto) return [];
    
    // rompo por espacios, comas o saltos de linea
    const partes = texto.split(/[\s,\n\r]+/);
    const numeros = [];

    partes.forEach(p => {
      const limpio = p.trim();
      if (limpio === '') return;
      
      const n = parseFloat(limpio);
      // solo si es un numero de verdad lo guardo
      if (!isNaN(n) && isFinite(n)) {
        numeros.push(n);
      }
    });

    return numeros;
  }
};
