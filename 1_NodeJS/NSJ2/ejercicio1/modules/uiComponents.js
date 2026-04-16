/**
 * uiComponents.js
 * Módulo para generar componentes de interfaz de usuario con la identidad visual de Telefe.
 * Utiliza los colores RGB icónicos y componentes redondeados.
 */

/**
 * Retorna el HTML de la barra de navegación (Navbar) con estilo Telefe.
 * @returns {string} - HTML del Navbar.
 */
const getNavbar = () => {
    return `
    <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm" style="border-top: 5px solid #005595; backdrop-filter: blur(8px); background-color: rgba(255, 255, 255, 0.9) !important;">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="/">
          <!-- Logo Telefe inspirado (Círculos RGB) -->
          <div class="d-flex me-2">
            <div style="width: 12px; height: 12px; background: #005595; border-radius: 50%; margin-right: 2px;"></div>
            <div style="width: 12px; height: 12px; background: #00A650; border-radius: 50%; margin-right: 2px;"></div>
            <div style="width: 12px; height: 12px; background: #ED1C24; border-radius: 50%;"></div>
          </div>
          <span class="fw-bold text-dark" style="letter-spacing: 1px;">TELEFE CLIMA</span>
        </a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#telefeNav" aria-controls="telefeNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="telefeNav">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link px-3 fw-medium" href="/">Inicio</a></li>
            <li class="nav-item"><a class="nav-link px-3 fw-medium" href="/forecast">Pronóstico</a></li>
            <li class="nav-item"><a class="nav-link px-3 fw-medium" href="/wind">Viento</a></li>
            <li class="nav-item"><a class="nav-link px-3 fw-medium" href="/climate">Clima</a></li>
            <li class="nav-item"><a class="nav-link px-3 fw-medium" href="/safety">Seguridad</a></li>
            <li class="nav-item">
              <a class="nav-link px-3 fw-bold text-primary" href="/health" style="color: #005595 !important;">
                <span style="border-bottom: 2px solid #00A650;">Salud UV</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    `;
};

module.exports = {
    getNavbar
};