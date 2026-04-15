import { createServer } from 'node:http';
import { sumar, restar, multiplicar, division } from './calculos.js';

const ejercicios = [
  {
    id: 1,
    titulo: 'Operaciones Directas',
    subtitulo: 'Ejercicio 2',
    operaciones: [
      { op: '4 + 5', res: 4 + 5, icon: '+' },
      { op: '3 - 6', res: 3 - 6, icon: '-' },
      { op: '2 × 7', res: 2 * 7, icon: '×' },
      { op: '20 ÷ 4', res: 20 / 4, icon: '÷' },
    ]
  },
  {
    id: 2,
    titulo: 'Lógica de Funciones',
    subtitulo: 'Ejercicio 3',
    operaciones: [
      { op: '4 + 5', res: sumar(4, 5), icon: 'λ' },
      { op: '3 - 6', res: restar(3, 6), icon: 'λ' },
      { op: '2 × 7', res: multiplicar(2, 7), icon: 'λ' },
      { op: '20 ÷ 4', res: division(20, 4), icon: 'λ' },
    ]
  },
  {
    id: 3,
    titulo: 'Módulo Externo',
    subtitulo: 'Ejercicio 4',
    operaciones: [
      { op: '5 + 3', res: sumar(5, 3), icon: '📦' },
      { op: '8 - 6', res: restar(8, 6), icon: '📦' },
      { op: '3 × 11', res: multiplicar(3, 11), icon: '📦' },
      { op: '30 ÷ 5', res: division(30, 5), icon: '📦' },
    ]
  },
];


const cardsHTML = ejercicios.map(ej => `
  <div class="col-md-4 mb-4">
    <div class="glass-card">
      <div class="card-header-custom">
        <span class="badge-step">${ej.subtitulo}</span>
        <h3>${ej.titulo}</h3>
      </div>
      <div class="card-body-custom">
        ${ej.operaciones.map(op => `
          <div class="op-row">
            <span class="op-icon">${op.icon}</span>
            <span class="op-text">${op.op}</span>
            <span class="op-result">${op.res}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
`).join('');

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Calculadora</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        :root {
          --bg-color: #0f172a;
          --card-bg: rgba(30, 41, 59, 0.7);
          --accent-color: #38bdf8;
          --text-main: #f1f5f9;
        }

        body {
          background-color: var(--bg-color);
          background-image: 
            radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.15) 0px, transparent 50%);
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--text-main);
          min-height: 100vh;
        }

        .glass-card {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 1.5rem;
          height: 100%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover {
          transform: translateY(-8px);
          border-color: var(--accent-color);
          box-shadow: 0 10px 30px -10px rgba(56, 189, 248, 0.3);
        }

        .badge-step {
          background: rgba(56, 189, 248, 0.2);
          color: var(--accent-color);
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        h3 {
          font-size: 1.25rem;
          margin-top: 0.5rem;
          font-weight: 600;
        }

        .op-row {
          display: flex;
          align-items: center;
          padding: 12px;
          margin-bottom: 8px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
        }

        .op-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-color);
          border-radius: 8px;
          margin-right: 12px;
          color: var(--accent-color);
        }

        .op-text { flex-grow: 1; opacity: 0.8; }
        .op-result { font-weight: 700; color: #10b981; }

        .header-section {
          padding: 4rem 0 2rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header class="header-section text-center">
          <h1 class="display-4 fw-bold mb-2">Calculadora<span style="color: var(--accent-color)"</h1>
        </header>

        <div class="row">
          ${cardsHTML}
        </div>
      </div>
    </body>
    </html>
  `);
});

server.listen(7000, () => {
  console.log('Servidor corriendo en http://localhost:7000');
});
