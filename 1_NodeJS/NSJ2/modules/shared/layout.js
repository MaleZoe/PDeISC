/**
 * modules/shared/layout.js
 * ─────────────────────────────────────────────────────────────────
 * Layout base HTML reutilizado por todas las páginas del sitio.
 *
 * RESPONSABILIDADES:
 *   - Genera el esqueleto HTML completo (<html>, <head>, <body>).
 *   - Inyecta los estilos globales (Bootstrap + estilos.css).
 *   - Inyecta el script de tema (theme.js) inline en el <head>
 *     para evitar el "flash" de contenido sin estilo al cargar.
 *   - Delega el menú de navegación a modules/consigna5/menu.js.
 *   - Envuelve el contenido de cada consigna en el main.
 *
 * USO:
 *   import { renderLayout } from '../shared/layout.js';
 *   const html = renderLayout('Titulo de Pagina', contenidoHTML, '/ruta-activa');
 *
 * PARÁMETROS:
 *   @param {string} titulo     - Título de la pestaña del navegador.
 *   @param {string} contenido  - HTML interno de la sección main.
 *   @param {string} rutaActiva - Ruta actual (para marcar el link activo en el menú).
 * ─────────────────────────────────────────────────────────────────
 */
import { getMenu } from '../consigna5/menu.js';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lee el script de tema una sola vez al importar el módulo.
// Se inyecta inline en el <head> para que el tema se aplique antes del render.
const themeScript = readFileSync(
  path.join(__dirname, '..', '..', 'context', 'theme.js'),
  'utf8'
);

export function renderLayout(titulo, contenido, rutaActiva = '/') {
  return `<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titulo} - NJS2</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="/styles/estilos.css">

  <!--
    Script de tema inyectado inline en el <head>.
    Al estar aquí (antes del <body>) se ejecuta antes del primer render,
    evitando el flash de pantalla oscura→clara o viceversa.
    Lee localStorage y setea data-theme en <html> al instante.
  -->
  <script>${themeScript}</script>
</head>
<body>
  <div class="fondo-ui">
    <div class="fondo-ui__blur fondo-ui__blur--uno"></div>
    <div class="fondo-ui__blur fondo-ui__blur--dos"></div>
  </div>

  ${getMenu(rutaActiva)}

  <main class="pagina container-xxl py-4 py-lg-5">
    ${contenido}
  </main>

  <footer class="container-xxl pb-4">
    <div class="footer-ui">
      <div>
        <div class="footer-ui__brand">NJS2</div>
        <p class="footer-ui__text mb-0">Node.js Modules Showcase con enfoque visual responsive.</p>
      </div>
      <div class="footer-ui__meta">Solo pages, styles y modules</div>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
}
