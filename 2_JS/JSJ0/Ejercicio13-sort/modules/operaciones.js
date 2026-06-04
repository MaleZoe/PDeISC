
// ordena numeros con sort
export function ordenarNumeros(numeros) {
    return [...numeros].sort((a, b) => a - b);
}

// ordena palabras con sort
export function ordenarPalabras(palabras) {
    return [...palabras].sort();
}

// ordena por edad con sort
export function ordenarPorEdad(personas) {
    return [...personas].sort((a, b) => a.edad - b.edad);
}
