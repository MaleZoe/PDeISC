
// verifica admin con includes
export function tieneAdmin(roles) {
    return roles.includes('admin');
}

// verifica verde con includes
export function tieneVerde(colores) {
    return colores.includes('verde');
}

// verifica si existe antes de pushear
export function agregarSiNoExiste(numero, numeros) {
    if (numeros.includes(numero)) return numeros;
    const copia = [...numeros];
    copia.push(numero);
    return copia;
}
