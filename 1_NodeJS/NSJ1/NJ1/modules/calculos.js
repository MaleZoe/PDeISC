export function sumar(a, b) {
  // devuelve la suma de a y b
  return a + b;
}

export function restar(a, b) {
  // devuelve la resta de a y b
  return a - b;
}

export function multiplicar(a, b) {
  // devuelve la multiplicacion de a y b
  return a * b;
}

export function division(a, b) {
  // devuelve la division de a y b, validando que no se divida por cero
  if (b === 0) return 'Error: División por 0';
  return a / b;
}
