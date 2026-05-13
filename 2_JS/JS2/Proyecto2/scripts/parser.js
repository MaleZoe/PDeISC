window.Parser = {
  // Recibe el contenido completo de un archivo .txt como string.
  // Devuelve un array de numeros extraidos del texto.
  extraerNumeros(textoPlano) {
    const lineas = textoPlano.split(/\r?\n/);
    const numerosEncontrados = [];

    // Definir etiquetas descriptivas comunes a ignorar al leer palabras sueltas
    const etiquetasIgnoradas = [
      "Promedio:", "Minimo:", "Maximo:", "Suma", "Total:",
      "Fecha:", "Archivo", "Leidos", "Utiles", "Descartados", "Procesado"
    ];

    for (const linea of lineas) {
      // Ignorar lineas separadoras completas
      if (this.esLineaEncabezado(linea)) continue;

      // Dividir la linea por espacios, comas o tabulaciones
      const fragmentos = linea.split(/[\s,\t]+/);

      for (const fragmento of fragmentos) {
        if (!fragmento) continue; // Evitar strings vacios
        
        // Si el fragmento es estrictamente una etiqueta de ignorar, saltarlo
        if (etiquetasIgnoradas.some(etiqueta => fragmento.includes(etiqueta))) {
          continue;
        }

        // Limpiar el fragmento para que solo queden caracteres validos numericos
        const tokenLimpio = this.limpiarToken(fragmento);
        if (!tokenLimpio) continue;

        // Intentar conversion a numero flotante
        const posibleNumero = parseFloat(tokenLimpio);

        // Validar que realmente sea un numero finito
        if (this.esNumeroValido(posibleNumero)) {
          numerosEncontrados.push(posibleNumero);
        }
      }
    }

    return numerosEncontrados;
  },

  // Limpia un token eliminando comas y caracteres invalidos
  limpiarToken(token) {
    // Reemplaza comas que puedan ser usadas como separador de miles
    let procesado = token.replace(/,/g, '');
    
    // Mantiene solo un guion al inicio, digitos y el primer punto que encuentre
    // Eliminando cualquier caracter extrano o letras pegadas
    procesado = procesado.replace(/[^0-9.-]/g, '');
    
    // Si hay multiples puntos o guiones mal posicionados, el parseFloat arrojara NaN
    return procesado;
  },

  // Verifica si el valor procesado es realmente un numero matematico valido
  esNumeroValido(token) {
    return isFinite(token) && !isNaN(token);
  },

  // Identifica si una linea es de formato/diseño
  esLineaEncabezado(linea) {
    const lineaRecortada = linea.trim();
    // Saltarse lineas que empiezan con separadores comunes
    if (lineaRecortada.startsWith('===') || 
        lineaRecortada.startsWith('---') || 
        lineaRecortada.startsWith('+++') || 
        lineaRecortada.startsWith('|||')) {
      return true;
    }
    
    // Saltarse lineas compuestas unicamente por caracteres de dibujado
    // ^ = inicio, $ = fin, permite los caracteres listados 1 o mas veces
    if (/^[+\-=| ]+$/.test(lineaRecortada) && lineaRecortada.length > 0) {
      return true;
    }

    return false;
  }
};
