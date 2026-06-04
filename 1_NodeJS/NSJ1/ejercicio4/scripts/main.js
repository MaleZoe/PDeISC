// scripts ej 4
import { toggleTheme, loadTheme } from '../Context/theme.js';
import { sumar, restar, multiplicar, dividir } from '../modules/calculos.js';

const themeToggle = document.getElementById('theme-toggle');
const themeLink = document.getElementById('theme-link');
const resultsContainer = document.getElementById('results-container');

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

// cargamos los resultados dinamicamente
const res = [
    { op: "Suma (5+3)", val: sumar(5, 3) },
    { op: "Resta (8-6)", val: restar(8, 6) },
    { op: "Multiplicación (3*11)", val: multiplicar(3, 11) },
    { op: "División (30/5)", val: dividir(30, 5) }
];

res.forEach(item => {
    const el = document.createElement('div');
    el.className = "list-group-item d-flex justify-content-between align-items-center";
    el.innerHTML = `<span>${item.op}</span> <span class="badge bg-primary rounded-pill">${item.val}</span>`;
    resultsContainer.appendChild(el);
});
