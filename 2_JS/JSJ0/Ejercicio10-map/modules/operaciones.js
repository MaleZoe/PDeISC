
// triplica con map
export function triplicarNumeros(numeros) {
    return numeros.map(n => n * 3);
}

// pasa a mayusculas con map
export function nombresAMayusculas(nombres) {
    return nombres.map(n => n.toUpperCase());
}

// agrega iva con map
export function aplicarIVA(precios) {
    return precios.map(p => (p * 1.21).toFixed(2));
}
