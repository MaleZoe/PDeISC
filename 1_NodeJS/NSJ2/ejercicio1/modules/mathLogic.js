/**
 mathLogic.js
 Este módulo contiene funciones matemáticas básicas.
 Utilizamos CommonJS (module.exports) para que estas funciones estén disponibles en otros archivos.
 */

// Función para sumar dos números
const add = (a, b) => {
    return a + b;
};

// Función para multiplicar dos números
const multiply = (a, b) => {
    return a * b;
};

// Exportar las funciones para que puedan ser requeridas en otros módulos
module.exports = {
    add,
    multiply
};