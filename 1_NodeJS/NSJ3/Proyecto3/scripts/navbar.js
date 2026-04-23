// scripts/navbar.js
// Lógica para el menú de navegación responsivo y resaltado de página activa

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Alternar visibilidad del menú móvil
    if (hamburger && menu) {
        hamburger.addEventListener('click', () => {
            menu.classList.toggle('show');
            hamburger.textContent = menu.classList.contains('show') ? '✕' : '☰';
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('show');
                hamburger.textContent = '☰';
            });
        });
    }

    // Resaltar el enlace de la página actual basado en la URL
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath === href || (currentPath === '/' && href === '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
