
// busca perro con indexOf
export function buscarPerro(animales) {
    return animales.indexOf('perro');
}

// busca 50 con indexOf
export function buscarCincuenta(numeros) {
    return numeros.indexOf(50);
}

// busca madrid con indexOf y maneja el -1
export function buscarMadrid(ciudades) {
    const idx = ciudades.indexOf('Madrid');
    if (idx === -1) return 'Madrid no esta en la lista';
    return idx;
}
