
// saluda a todos con forEach
export function saludarNombres(nombres) {
    const saludos = [];
    nombres.forEach(n => saludos.push(`¡Hola ${n}!`));
    return saludos;
}

// dobla numeros con forEach
export function doblarNumeros(numeros) {
    const dobles = [];
    numeros.forEach(num => dobles.push(num * 2));
    return dobles;
}

// muestra personas con forEach
export function listarPersonas(personas) {
    const lista = [];
    personas.forEach(p => lista.push(`${p.nombre} tiene ${p.edad} años`));
    return lista;
}
