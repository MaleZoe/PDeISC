import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ejecutar as runEj1 } from './ejercicios/ejercicio1.js';
import { ejecutar as runEj2 } from './ejercicios/ejercicio2.js';
import { ejecutar as runEj3 } from './ejercicios/ejercicio3.js';
import { ejecutar as runEj4 } from './ejercicios/ejercicio4.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Funciones helpers
import { sumar, restar, multiplicar, division } from './modules/calculos.js';

const server = http.createServer((req, res) => {
  const url = req.url;

  // RUTEO ESTANGA: Todo en un solo servidor
  if (url === '/' || url === '/ejercicio5') {
    // Generar JSON para inyectar en HTML
    const data = [
      { id: 1, titulo: 'Operaciones Directas', subtitulo: 'Ejercicio 2', operaciones: [
        { op: '4 + 5', res: 4 + 5 }, { op: '3 - 6', res: 3 - 6 }, { op: '2 × 7', res: 2 * 7 }, { op: '20 ÷ 4', res: 20 / 4 }
      ]},
      { id: 2, titulo: 'Lógica de Funciones', subtitulo: 'Ejercicio 3', operaciones: [
        { op: '4 + 5', res: sumar(4, 5) }, { op: '3 - 6', res: restar(3, 6) }, { op: '2 × 7', res: multiplicar(2, 7) }, { op: '20 ÷ 4', res: division(20, 4) }
      ]},
      { id: 3, titulo: 'Módulo Externo', subtitulo: 'Ejercicio 4', operaciones: [
        { op: '5 + 3', res: sumar(5, 3) }, { op: '8 - 6', res: restar(8, 6) }, { op: '3 × 11', res: multiplicar(3, 11) }, { op: '30 ÷ 5', res: division(30, 5) }
      ]}
    ];

    const cardsHTML = data.map(ej => `
      <div class="glass-card">
        <span class="badge-step">${ej.subtitulo}</span>
        <h3>${ej.titulo}</h3>
        <div>
          ${ej.operaciones.map(o => `
            <div class="op-row">
              <span class="op-text">${o.op}</span>
              <span class="op-result">${o.res}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    const htmlPath = path.join(__dirname, 'pages', 'index.html');
    fs.readFile(htmlPath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error leyendo index.html');
      }
      // inyectamos las cards generadas por Node en el HTML
      const finalHTML = content.replace('<!-- Inyectado por JS/Server dinamicamente -->', cardsHTML);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(finalHTML);
    });

  } else if (url === '/ejercicio1') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(runEj1());
  } else if (url === '/ejercicio2') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(runEj2());
  } else if (url === '/ejercicio3') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(runEj3());
  } else if (url === '/ejercicio4') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(runEj4());
  } 
  
  // Archivos estáticos (CSS, JS cliente)
  else if (url.startsWith('/styles/')) {
    const filePath = path.join(__dirname, url);
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        return res.end();
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(content);
    });
  } else if (url.startsWith('/Context/')) {
    const filePath = path.join(__dirname, url);
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        return res.end();
      }
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(content);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Ruta no encontrada. Pruebe con /, /ejercicio1, /ejercicio2, etc.');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor Estanga corriendo en http://localhost:${PORT}`);
});
