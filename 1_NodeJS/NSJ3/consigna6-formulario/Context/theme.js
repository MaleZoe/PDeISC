/**
 * Módulo de tema claro/oscuro.
 * Persiste la preferencia en localStorage y respeta prefers-color-scheme
 * cuando el usuario no eligió un tema manualmente.
 */

export function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || getSystemTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}

export function applyTheme(theme) {
    const lightLink = document.getElementById('theme-light');
    const darkLink = document.getElementById('theme-dark');
    const toggleBtn = document.getElementById('theme-toggle');

    if (theme === 'dark') {
        if (lightLink) lightLink.disabled = true;
        if (darkLink) darkLink.disabled = false;
        if (toggleBtn) toggleBtn.innerHTML = '<i class="bi bi-sun"></i>';
        document.body.classList.add('dark-mode');
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        if (lightLink) lightLink.disabled = false;
        if (darkLink) darkLink.disabled = true;
        if (toggleBtn) toggleBtn.innerHTML = '<i class="bi bi-moon-stars"></i>';
        document.body.classList.remove('dark-mode');
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme || getSystemTheme());
}
