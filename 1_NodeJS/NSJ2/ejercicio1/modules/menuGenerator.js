/**
 * menuGenerator.js
 * Este módulo genera una cadena HTML de una barra de navegación (Navbar) responsiva de Bootstrap 5.
 * Esto puede ser inyectado dinámicamente en cualquier página por el servidor.
 */

/**
 * Devuelve una cadena HTML de la barra de navegación de Bootstrap 5.
 * @returns {string} - El HTML del Navbar.
 */
const getNavbar = () => {
    return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">Proyecto Node.js</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/page1">Página 1</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/page2">Página 2</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/page3">Página 3</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/page4">Página 4</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    `;
};

// Exportar la función para que el servidor la utilice
module.exports = {
    getNavbar
};