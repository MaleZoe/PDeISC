
// filtra mayores a 10 con filter
export function filtrarMayoresADiez(numeros) {
    return numeros.filter(n => n > 10);
}

// filtra palabras largas con filter
export function filtrarPalabrasLargas(palabras) {
    return palabras.filter(p => p.length > 5);
}

// filtra activos con filter
export function filtrarUsuariosActivos(usuarios) {
    return usuarios.filter(u => u.activo);
}
