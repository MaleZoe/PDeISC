
// quita el ultimo animal del array
export function quitarUltimoAnimal(animales) {
    const copia = [...animales];
    const eliminado = copia.pop();
    return { array: copia, eliminado };
}

// quita el ultimo producto y devuelve el eliminado
export function quitarUltimoProducto(productos) {
    const copia = [...productos];
    const eliminado = copia.pop();
    return { array: copia, eliminado };
}

// vacia usando while y pop
export function vaciarListaConWhile(lista) {
    const copia = [...lista];
    while(copia.length > 0) {
        copia.pop();
    }
    return copia;
}
        