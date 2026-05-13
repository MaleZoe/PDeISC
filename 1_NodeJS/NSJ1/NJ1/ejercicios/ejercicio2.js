export function ejecutar() {
  const suma = 4 + 5;
  const resta = 3 - 6;
  const multiplicacion = 2 * 7;
  const division = 20 / 4;

  // Logueamos los resultados y los armamos en un string para devolverlos
  console.log(`La suma de 4 + 5 = ${suma}`);
  console.log(`La resta de 3 - 6 = ${resta}`);
  console.log(`La multiplicacion de 2 * 7 = ${multiplicacion}`);
  console.log(`La division de 20 / 4 = ${division}`);

  return `La suma de 4 + 5 = ${suma}\nLa resta de 3 - 6 = ${resta}\nLa multiplicacion de 2 * 7 = ${multiplicacion}\nLa division de 20 / 4 = ${division}`;
}
