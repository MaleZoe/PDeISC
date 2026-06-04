
// suma con reduce
export function sumarTodo(numeros) {
    return numeros.reduce((acc, curr) => acc + curr, 0);
}

// multiplica con reduce
export function multiplicarTodo(numeros) {
    return numeros.reduce((acc, curr) => acc * curr, 1);
}

// totaliza precios con reduce
export function totalizarPrecios(objetos) {
    return objetos.reduce((acc, curr) => acc + curr.precio, 0);
}
