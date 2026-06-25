/**
 * server.js
 * ─────────────────────────────────────────────────────────────────
 * Punto de entrada del proyecto NJS2.
 *
 * FLUJO DE ARRANQUE:
 *   1. Llama a generarSitio() que usa node:fs para escribir en disco
 *      todos los archivos HTML dentro de /pages.
 *   2. Levanta un servidor HTTP con node:http en el puerto 3000.
 *   3. Por cada request entrante:
 *      a. Si es /styles/*.css → sirve el archivo como estático.
 *      b. Si es /context/*.js → sirve el script como estático.
 *      c. Si coincide con una ruta del mapa RUTAS → lee y devuelve
 *         el HTML ya generado en disco.
 *      d. Si no coincide → responde 404.
 *
 * MÓDULOS NATIVOS USADOS:
 *   - node:http   → createServer, manejo de requests y responses.
 *   - node:fs     → readFileSync para leer HTMLs y CSS del disco.
 *   - node:path   → construcción de rutas absolutas cross-platform.
 *   - node:url    → fileURLToPath para obtener __dirname en ES Modules.
 * ─────────────────────────────────────────────────────────────────
 */
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generarSitio } from './modules/site/generarSitio.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cada ruta publica apunta a un archivo HTML ya generado en /pages.
const RUTAS = {
  '/': 'pages/index.html',
  '/calculo': 'pages/consigna1/calculo.html',
  '/archivos': 'pages/consigna2/archivos.html',
  '/vista.html': 'pages/consigna2/vista.html',
  '/url': 'pages/consigna3/url.html',
  '/npm': 'pages/consigna4/npm.html',
};

await generarSitio();

const server = createServer((req, res) => {
  // Los estilos se sirven como archivos estaticos.
  if (req.url?.startsWith('/styles/') && req.url.endsWith('.css')) {
    try {
      const css = readFileSync(path.join(__dirname, req.url), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
      res.end(css);
    } catch (e) {
      res.writeHead(404);
      res.end('404 - Estilo no encontrado');
    }
    return;
  }

  // Los scripts del contexto (theme.js) se sirven como archivos estaticos.
  if (req.url?.startsWith('/context/') && req.url.endsWith('.js')) {
    try {
      const js = readFileSync(path.join(__dirname, req.url), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
      res.end(js);
    } catch (e) {
      res.writeHead(404);
      res.end('404 - Script no encontrado');
    }
    return;
  }

  const archivo = RUTAS[req.url];

  // Si la ruta no existe en el mapa, responde 404.
  if (!archivo) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 - Pagina no encontrada');
    return;
  }

  try {
    // Lee y devuelve el HTML ya generado en disco.
    const html = readFileSync(path.join(__dirname, archivo), 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Error interno: ${err.message}`);
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('\n[NJS2] Servidor listo -> http://127.0.0.1:3000\n');
  console.log(' Paginas disponibles:');
  console.log(' / -> Inicio');
  console.log(' /calculo -> Consigna 1');
  console.log(' /archivos -> Consigna 2');
  console.log(' /vista.html -> HTML generado');
  console.log(' /url -> Consigna 3');
  console.log(' /npm -> Consigna 4');
});
