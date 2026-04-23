// Detecta la ruta actual y marca el enlace activo en la navbar
document.addEventListener('DOMContentLoaded', () => {
  const enlaces = document.querySelectorAll('.navbar-nav .nav-link');
  const pathActual = window.location.pathname;
  
  // Asignar clase de Bootstrap "active" según ruta
  enlaces.forEach(enlace => {
    if (enlace.getAttribute('href') === pathActual) {
      enlace.classList.add('active', 'fw-bold', 'texto-secundario');
    }
    
    // Auto-cierre del hamburguesa al cliquear en móvil
    enlace.addEventListener('click', () => {
      const navbarColapsable = document.querySelector('.navbar-collapse');
      if (navbarColapsable && navbarColapsable.classList.contains('show')) {
        const instanciaBs = window.bootstrap.Collapse.getInstance(navbarColapsable) 
          || new window.bootstrap.Collapse(navbarColapsable);
        instanciaBs.hide();
      }
    });
  });
});
