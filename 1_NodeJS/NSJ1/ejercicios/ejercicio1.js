import { createServer } from 'node:http';

console.log("Hola mundo desde Node.js");
console.log("Fin");

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hola mundo desde Node.js\nFin');
});

server.listen(3001, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3001');
});
