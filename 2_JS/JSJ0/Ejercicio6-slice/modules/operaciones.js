
// copia los primeros 3 con slice
export function copiarPrimerosTres(numeros) {
    return numeros.slice(0, 3);
}

// copia del 2 al 4 inclusive con slice (end 5)
export function copiarPeliculasParcial(peliculas) {
    return peliculas.slice(2, 5);
}

// copia los ultimos 3 con slice
export function copiarUltimosTres(lista) {
    return lista.slice(-3);
}
