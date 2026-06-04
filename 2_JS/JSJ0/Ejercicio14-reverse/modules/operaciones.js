
// invierte letras con reverse
export function invertirLetras(letras) {
    return [...letras].reverse();
}

// invierte numeros con reverse
export function invertirNumeros(numeros) {
    return [...numeros].reverse();
}

// invierte texto (string -> array -> reverse -> join)
export function invertirTexto(texto) {
    return texto.split('').reverse().join('');
}
