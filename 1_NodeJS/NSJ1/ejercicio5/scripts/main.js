// scripts ej 5 - Consolidado
import { toggleTheme, loadTheme } from '../Context/theme.js';
import { sumar, restar, multiplicar, dividir } from '../modules/calculos.js';

const themeToggle = document.getElementById('theme-toggle');
const themeLink = document.getElementById('theme-link');
const resultsContainer = document.getElementById('results-container');
const num1Input = document.getElementById('num1');
const num2Input = document.getElementById('num2');
const resDisplay = document.getElementById('resultado-display');
const btnSumar = document.getElementById('btn-sumar');
const btnRestar = document.getElementById('btn-restar');

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

// --- Lógica Ejercicio 3 (Interactividad) ---
const validarInput = (input) => {
    if (input.value === "" || isNaN(input.value)) {
        input.classList.add('is-invalid');
        return false;
    } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        return true;
    }
};

if (num1Input) num1Input.addEventListener('input', () => validarInput(num1Input));
if (num2Input) num2Input.addEventListener('input', () => validarInput(num2Input));

const operar = (operacion) => {
    const v1 = validarInput(num1Input);
    const v2 = validarInput(num2Input);

    if (v1 && v2) {
        const n1 = parseFloat(num1Input.value);
        const n2 = parseFloat(num2Input.value);
        let resultado;
        if (operacion === 'sumar') resultado = n1 + n2;
        if (operacion === 'restar') resultado = n1 - n2;
        resDisplay.innerText = resultado;
    } else {
        resDisplay.innerText = "Error";
    }
};

if (btnSumar) btnSumar.addEventListener('click', () => operar('sumar'));
if (btnRestar) btnRestar.addEventListener('click', () => operar('restar'));

// --- Lógica Ejercicio 4 (Módulos Dinámicos) ---
if (resultsContainer) {
    const res = [
        { op: "Suma (10+5)", val: sumar(10, 5) },
        { op: "Resta (20-8)", val: restar(20, 8) },
        { op: "Multiplicación (4*6)", val: multiplicar(4, 6) },
        { op: "División (50/2)", val: dividir(50, 2) }
    ];

    res.forEach(item => {
        const el = document.createElement('div');
        el.className = "list-group-item d-flex justify-content-between align-items-center";
        el.innerHTML = `<span>${item.op}</span> <span class="badge bg-primary rounded-pill">${item.val}</span>`;
        resultsContainer.appendChild(el);
    });
}
