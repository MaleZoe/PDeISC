// acá arranco el servidor de una
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generarSitio } from './Modules/sitio/sitio.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


// este objeto tiene las rutas para que no sea un quilombo de ifs
const RUTAS = {
  '/': 'Pages/inicio.html',
  '/calculo': 'Pages/ejercicio1/calculadora.html',
  '/archivos': 'Pages/ejercicio2/archivos.html',
  '/vista.html': 'Pages/ejercicio2/galeria.html',
  '/url': 'Pages/ejercicio3/url-info.html',
  '/npm': 'Pages/ejercicio4/npm.html',
};

// genero todo el sitio antes de levantar el server
await generarSitio();

const server = createServer((req, res) => {

  // si pide css se lo mando sin vueltas
  if (req.url?.startsWith('/Styles/') && req.url.endsWith('.css')) {
    const css = readFileSync(path.join(__dirname, req.url), 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
    res.end(css);
    return;
  }

  const archivo = RUTAS[req.url];

  if (!archivo) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 - flaco, esa pagina no existe');
    return;
  }

  try {
    const html = readFileSync(path.join(__dirname, archivo), 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`le erraste feo: ${err.message}`);
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('\n[estanga] el server esta arriba en http://127.0.0.1:3000');
});
