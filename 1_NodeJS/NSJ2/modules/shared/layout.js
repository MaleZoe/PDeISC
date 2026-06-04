// Layout base reutilizado por todas las paginas del sitio.
// Agrega head, estilos, menu, contenedor principal y footer.
import { getMenu } from '../consigna5/menu.js';

export function renderLayout(titulo, contenido, rutaActiva = '/') {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titulo} - NJS2</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="/styles/estilos.css">
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
