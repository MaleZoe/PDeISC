import { createServer } from 'node:http';
import { sumar, restar, multiplicar, division } from './calculos.js';

console.log(`La suma de 5 + 3 = ${sumar(5, 3)}`);
console.log(`La resta de 8 - 6 = ${restar(8, 6)}`);
console.log(`La multiplicacion de 3 * 11 = ${multiplicar(3, 11)}`);
console.log(`La division de 30 / 5 = ${division(30, 5)}`);

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(
`La suma de 5 + 3 = ${sumar(5, 3)}
La resta de 8 - 6 = ${restar(8, 6)}
La multiplicacion de 3 * 11 = ${multiplicar(3, 11)}
La division de 30 / 5 = ${division(30, 5)}`
  );
});

server.listen(3004, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3004');
});
