// Modulo del menu principal reutilizado por layout.js.

const LINKS = [
  { href: '/', label: 'Inicio', icono: 'house-fill' },
  { href: '/calculo', label: 'Ejercicio 1', icono: 'calculator-fill' },
  { href: '/archivos', label: 'Ejercicio 2', icono: 'folder-fill' },
  { href: '/url', label: 'Ejercicio 3', icono: 'link-45deg' },
  { href: '/npm', label: 'Ejercicio 4', icono: 'box-fill' },
];

export function getMenu(rutaActiva = '/') {
  const links = LINKS.map(({ href, label, icono }) => {
    const activo = rutaActiva === href ? ' nav-link-activo' : '';
    return `
      <li class="nav-item">
        <a class="nav-link nav-link-custom${activo}" href="${href}">
          <i class="bi bi-${icono} me-1"></i>
          <span>${label}</span>
        </a>
      </li>
    `;
  }).join('');

  return `
    <header class="site-header">
      <nav class="navbar navbar-expand-lg navbar-custom container">
        <div class="container-fluid px-0">
          <a class="navbar-brand brand-custom" href="/">NJS<span class="brand-dot">.</span></a>
          <button class="navbar-toggler toggler-custom" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal" aria-controls="menuPrincipal" aria-expanded="false" aria-label="Abrir menu">
            <i class="bi bi-list"></i>
          </button>
          <div class="collapse navbar-collapse mt-3 mt-lg-0" id="menuPrincipal">
            <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
              ${links}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  `;
}
