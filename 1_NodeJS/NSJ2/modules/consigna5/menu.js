/**
 * modules/consigna5/menu.js
 * ─────────────────────────────────────────────────────────────────
 * Módulo que genera el HTML del menú de navegación principal.
 *
 * RESPONSABILIDADES:
 *   - Define la lista de links del sitio (LINKS).
 *   - Exporta getMenu(rutaActiva) que devuelve el <header> completo
 *     con el navbar de Bootstrap y el botón de toggle de tema.
 *   - Marca visualmente el link de la ruta activa con la clase
 *     nav-link-ui--active para orientar al usuario.
 *   - Incluye el botón #btn-theme (🌙/☀️) que llama a toggleTheme()
 *     definida por context/theme.js al cargarse inline.
 *
 * USO:
 *   import { getMenu } from '../consigna5/menu.js';
 *   const headerHTML = getMenu('/archivos');
 *
 * PARÁMETROS:
 *   @param {string} rutaActiva - Ruta de la página actual ('/', '/calculo', etc.)
 *   @returns {string} HTML del <header> con el navbar.
 * ─────────────────────────────────────────────────────────────────
 */
const LINKS = [
  { href: '/', label: 'Inicio', icono: 'grid-1x2-fill' },
  { href: '/calculo', label: 'Consigna 1', icono: 'stars' },
  { href: '/archivos', label: 'Consigna 2', icono: 'folder2-open' },
  { href: '/url', label: 'Consigna 3', icono: 'link-45deg' },
  { href: '/npm', label: 'Consigna 4', icono: 'box-seam-fill' },
];

export function getMenu(rutaActiva = '/') {
  // Marca visualmente la ruta activa para orientar al usuario.
  const links = LINKS.map(({ href, label, icono }) => {
    const activo = rutaActiva === href ? ' nav-link-ui--active' : '';
    return `
      <li class="nav-item">
        <a class="nav-link nav-link-ui${activo}" href="${href}">
          <i class="bi bi-${icono}"></i>
          <span>${label}</span>
        </a>
      </li>
    `;
  }).join('');

  return `
    <header class="site-header container-xxl pt-3 pt-lg-4">
      <nav class="navbar navbar-expand-lg navbar-ui">
        <div class="container-fluid px-3 px-lg-4">
          <a class="navbar-brand navbar-brand-ui" href="/">NJS2</a>
          <button class="navbar-toggler navbar-toggler-ui" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal" aria-controls="menuPrincipal" aria-expanded="false" aria-label="Abrir menu">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse mt-3 mt-lg-0" id="menuPrincipal">
            <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              ${links}
              <li class="nav-item ms-lg-2">
                <button id="btn-theme" class="btn-theme-toggle" aria-label="Cambiar tema" title="Cambiar tema">🌙</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  `;
}
