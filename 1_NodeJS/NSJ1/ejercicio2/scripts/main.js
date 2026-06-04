// scripts ej 2
import { toggleTheme, loadTheme } from '../Context/theme.js';

const themeToggle = document.getElementById('theme-toggle');
const themeLink = document.getElementById('theme-link');
const btnScrollTop = document.getElementById('btn-scroll-top');

const setThemeButtonIcon = (theme) => {
    themeToggle.innerText = theme === 'claro' ? '🌙' : '☀️';
    themeToggle.setAttribute('aria-label', theme === 'claro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
};

const applyTheme = (theme) => {
    themeLink.href = `../styles/${theme}.css`;
    setThemeButtonIcon(theme);
};

const currentTheme = loadTheme();
applyTheme(currentTheme);

themeToggle.addEventListener('click', () => {
    const newTheme = toggleTheme(loadTheme());
    applyTheme(newTheme);
});

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
