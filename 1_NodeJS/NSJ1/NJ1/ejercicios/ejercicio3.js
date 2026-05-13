function sumar(a, b) {
  return a + b;
}

function restar(a, b) {
  return a - b;
}

function multiplicar(a, b) {
  return a * b;
}

function division(a, b) {
  return a / b;
}

export function ejecutar() {
  // Logueamos los resultados utilizando funciones locales
  console.log(`La suma de 4 + 5 = ${sumar(4, 5)}`);
  console.log(`La resta de 3 - 6 = ${restar(3, 6)}`);
  console.log(`La multiplicacion de 2 * 7 = ${multiplicar(2, 7)}`);
  console.log(`La division de 20 / 4 = ${division(20, 4)}`);

  return `La suma de 4 + 5 = ${sumar(4, 5)}\nLa resta de 3 - 6 = ${restar(3, 6)}\nLa multiplicacion de 2 * 7 = ${multiplicar(2, 7)}\nLa division de 20 / 4 = ${division(20, 4)}`;
}
