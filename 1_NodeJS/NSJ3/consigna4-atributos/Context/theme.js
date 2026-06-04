// función para cambiar el tema con transición suave
export function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // guardo la preferencia
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}

// función para aplicar el tema guardado
export function applyTheme(theme) {
    const lightLink = document.getElementById('theme-light');
    const darkLink = document.getElementById('theme-dark');
    const toggleBtn = document.getElementById('theme-toggle');

    if (theme === 'dark') {
        if (lightLink) lightLink.disabled = true;
        if (darkLink) darkLink.disabled = false;
        if (toggleBtn) toggleBtn.innerHTML = '<i class="bi bi-sun"></i>';
        document.body.classList.add('dark-mode');
    } else {
        if (lightLink) lightLink.disabled = false;
        if (darkLink) darkLink.disabled = true;
        if (toggleBtn) toggleBtn.innerHTML = '<i class="bi bi-moon-stars"></i>';
        document.body.classList.remove('dark-mode');
    }
}

// inicio el tema al cargar
export function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}
