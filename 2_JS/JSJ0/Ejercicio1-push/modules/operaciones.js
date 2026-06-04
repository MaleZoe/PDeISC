
// aca agrego la fruta usando push
export function agregarFruta(fruta, lista) {
    const nuevaLista = [...lista];
    nuevaLista.push(fruta);
    return nuevaLista;
}

// aca guardo un amigo en la lista existente
export function agregarAmigo(amigo, lista) {
    const nuevaLista = [...lista];
    nuevaLista.push(amigo);
    return nuevaLista;
}

// aca valido si es mayor y lo meto al array
export function agregarSiEsMayor(numero, lista) {
    const nuevaLista = [...lista];
    const ultimo = nuevaLista[nuevaLista.length - 1];
    if (numero > ultimo) {
        nuevaLista.push(numero);
    }
    return nuevaLista;
}
        