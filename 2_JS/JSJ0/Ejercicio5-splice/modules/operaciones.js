
// elimina dos elementos desde pos 1 con splice
export function eliminarDosDesdePos1(letras) {
    const copia = [...letras];
    copia.splice(1, 2);
    return copia;
}

// inserta en pos 1 sin borrar nada con splice
export function insertarEnSegundaPosicion(nombre, nombres) {
    const copia = [...nombres];
    copia.splice(1, 0, nombre);
    return copia;
}

// reemplaza dos elementos con splice
export function reemplazarDosElementos(indice, valores, lista) {
    const copia = [...lista];
    const partes = valores.split(',').map(v => v.trim());
    copia.splice(indice, 2, partes[0], partes[1]);
    return copia;
}
