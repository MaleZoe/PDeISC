// importamos la logica del tema
import { toggleTheme, loadTheme } from '../Context/theme.js';

const themeToggle = document.getElementById('theme-toggle');
const themeLink = document.getElementById('theme-link');
const btnScrollTop = document.getElementById('btn-scroll-top');

// funcion para aplicar el css que corresponde
const setThemeButtonIcon = (theme) => {
    themeToggle.innerText = theme === 'claro' ? '🌙' : '☀️';
    themeToggle.setAttribute('aria-label', theme === 'claro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
};

const applyTheme = (theme) => {
    themeLink.href = `../styles/${theme}.css`;
    setThemeButtonIcon(theme);
};

// inicializamos el tema
const currentTheme = loadTheme();
applyTheme(currentTheme);

// evento para cambiar el tema
themeToggle.addEventListener('click', () => {
    const newTheme = toggleTheme(loadTheme());
    applyTheme(newTheme);
});

// logica para el boton de subir
window.onscroll = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btnScrollTop.style.display = "block";
    } else {
        btnScrollTop.style.display = "none";
    }
};

btnScrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// un log para que se vea que anda
console.log("script cargado correctamente pibe");
