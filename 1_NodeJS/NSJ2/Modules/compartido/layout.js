// Layout base reutilizado por todas las paginas del sitio.
// Agrega head, estilos, menu, contenedor principal y footer.

import { getMenu } from '../ejercicio5/menu.js';

export function renderLayout(titulo, contenido, rutaActiva = '/') {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titulo} - NodeJS Practico</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="/Styles/style.css">
</head>
<body>
  <div class="grid-overlay"></div>

  ${getMenu(rutaActiva)}

  <main class="pagina container py-5 mt-5">
    ${contenido}
  </main>

  <footer class="footer-wrap container pb-4">
    <div class="footer-inner">
      <div class="footer-logo">NJS<span>.</span></div>
      <p class="footer-sub">Proyecto Node.js — Modulos nativos y NPM en accion.</p>
      <div class="footer-meta">Estructura: Pages / Styles / Modules</div>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
}
