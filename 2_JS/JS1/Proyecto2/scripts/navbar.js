// NJS4/Proyecto 2/scripts/navbar.js

/**
 * Módulo Navbar
 * Responsabilidad: Cerrar el menú hamburguesa al clickear cualquier enlace de navegación
 * para mejorar la experiencia de usuario en dispositivos móviles.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todos los enlaces dentro del navbar
    const enlacesNav = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Seleccionar el elemento colapsable del navbar
    const navbarCollapse = document.getElementById('navbarNav');
    
    // Iterar sobre cada enlace y agregar el evento click
    enlacesNav.forEach(enlace => {
        enlace.addEventListener('click', () => {
            // Verificar si el menú está actualmente abierto (tiene la clase 'show' de Bootstrap)
            if (navbarCollapse.classList.contains('show')) {
                // Obtener la instancia del Collapse de Bootstrap y ocultarlo
                const instanciaCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (instanciaCollapse) {
                    instanciaCollapse.hide();
                }
            }
        });
    });
});
