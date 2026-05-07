document.addEventListener('DOMContentLoaded', () => {
    const enlacesNav = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarColapsable = document.getElementById('navbarApp');

    // Cierra el menú desplegable automáticamente al hacer clic en un enlace (para móviles)
    enlacesNav.forEach(enlace => {
        enlace.addEventListener('click', () => {
            if (navbarColapsable.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarColapsable) || new bootstrap.Collapse(navbarColapsable, { toggle: false });
                bsCollapse.hide();
            }
        });
    });
});

