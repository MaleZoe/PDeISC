import { sumar, restar, multiplicar, division } from '../modules/calculos.js';

export function ejecutar() {
  // Logueamos los resultados importando funciones de calculos.js
  console.log(`La suma de 5 + 3 = ${sumar(5, 3)}`);
  console.log(`La resta de 8 - 6 = ${restar(8, 6)}`);
  console.log(`La multiplicacion de 3 * 11 = ${multiplicar(3, 11)}`);
  console.log(`La division de 30 / 5 = ${division(30, 5)}`);

  return `La suma de 5 + 3 = ${sumar(5, 3)}\nLa resta de 8 - 6 = ${restar(8, 6)}\nLa multiplicacion de 3 * 11 = ${multiplicar(3, 11)}\nLa division de 30 / 5 = ${division(30, 5)}`;
}
