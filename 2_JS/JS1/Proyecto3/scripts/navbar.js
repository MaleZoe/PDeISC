// NJS4/Proyecto 3/scripts/navbar.js

/**
 * Módulo Navbar
 * Responsabilidad: Cerrar el menú hamburguesa al clickear cualquier enlace de navegación
 * en dispositivos móviles, evitando parpadeos en versión desktop.
 */

document.addEventListener('DOMContentLoaded', () => {
    const enlacesNav = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.getElementById('navbarNav');
    
    enlacesNav.forEach(enlace => {
        enlace.addEventListener('click', () => {
            // Chequear si el menú está abierto (clase 'show' de bootstrap)
            if (navbarCollapse.classList.contains('show')) {
                // Obtener o crear la instancia de Collapse y ocultarla
                const instanciaCollapse = bootstrap.Collapse.getInstance(navbarCollapse) 
                                       || new bootstrap.Collapse(navbarCollapse);
                instanciaCollapse.hide();
            }
        });
    });
});
