import { createServer } from 'node:http';

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

console.log(`La suma de 4 + 5 = ${sumar(4, 5)}`);
console.log(`La resta de 3 - 6 = ${restar(3, 6)}`);
console.log(`La multiplicacion de 2 * 7 = ${multiplicar(2, 7)}`);
console.log(`La division de 20 / 4 = ${division(20, 4)}`);

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(
`La suma de 4 + 5 = ${sumar(4, 5)}
La resta de 3 - 6 = ${restar(3, 6)}
La multiplicacion de 2 * 7 = ${multiplicar(2, 7)}
La division de 20 / 4 = ${division(20, 4)}`
  );
});

server.listen(3003, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3003');
});
