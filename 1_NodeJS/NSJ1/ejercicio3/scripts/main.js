// scripts ej 3
import { toggleTheme, loadTheme } from '../Context/theme.js';

const themeToggle = document.getElementById('theme-toggle');
const themeLink = document.getElementById('theme-link');
const btnScrollTop = document.getElementById('btn-scroll-top');
const num1Input = document.getElementById('num1');
const num2Input = document.getElementById('num2');
const resDisplay = document.getElementById('resultado-display');

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

// validacion en tiempo real como pide el profe
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

num1Input.addEventListener('input', () => validarInput(num1Input));
num2Input.addEventListener('input', () => validarInput(num2Input));

// funciones de calculo
const funciones = {
    sumar: (a, b) => a + b,
    restar: (a, b) => a - b
};

// lo exponemos al window para el onclick del html (mala practica pero bue, es para el ejemplo)
window.operar = (operacion) => {
    const v1 = validarInput(num1Input);
    const v2 = validarInput(num2Input);

    if (v1 && v2) {
        const n1 = parseFloat(num1Input.value);
        const n2 = parseFloat(num2Input.value);
        const resultado = funciones[operacion](n1, n2);
        resDisplay.innerText = resultado;
    } else {
        resDisplay.innerText = "Error en los datos";
    }
};

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
