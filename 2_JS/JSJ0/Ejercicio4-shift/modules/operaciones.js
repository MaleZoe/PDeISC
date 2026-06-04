
// quita el primer numero usando shift
export function quitarPrimerNumero(numeros) {
    const copia = [...numeros];
    copia.shift();
    return copia;
}

// elimina el primer mensaje usando shift
export function eliminarPrimerMensaje(mensajes) {
    const copia = [...mensajes];
    copia.shift();
    return copia;
}

// simula cola atendiendo al primero con shift
export function atenderSiguienteCliente(clientes) {
    const copia = [...clientes];
    copia.shift();
    return copia;
}
