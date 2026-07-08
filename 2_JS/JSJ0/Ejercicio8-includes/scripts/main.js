
// Importar la función para inicializar el tema claro/oscuro
import { inicializarTema } from '../Context/theme.js';

// Array global para almacenar números únicos
let numeros = [5, 10, 15];

// Inicializar la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    configurarValidaciones();
    configurarEventos();
});

/**
 * Configura la validación en tiempo real de los campos
 */
function configurarValidaciones() {
    // Punto 3: Números
    const inputNum = document.getElementById('p3-numero');
    inputNum.addEventListener('input', () => {
        const val = inputNum.value;
        const err = document.getElementById('p3-numero-error');
        if (val === '') {
            inputNum.classList.add('input-error');
            err.innerText = 'pone un numero';
        } else {
            inputNum.classList.remove('input-error');
            err.innerText = '';
        }
    });
}

/**
 * Asigna eventos a los botones y entradas de texto de los 3 puntos del ejercicio
 */
function configurarEventos() {
    // Punto 1: Verificar valor en array
    const btn1 = document.getElementById('p1-btn-includes');
    const p1ValorInput = document.getElementById('p1-valor');
    btn1.addEventListener('click', verificarValor1);
    p1ValorInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') verificarValor1();
    });

    // Punto 2: Verificar valor en array
    const btn2 = document.getElementById('p2-btn-includes');
    const p2ValorInput = document.getElementById('p2-valor');
    btn2.addEventListener('click', verificarValor2);
    btn2.addEventListener('mouseenter', verificarValor2);
    p2ValorInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') verificarValor2();
    });

    // Punto 3: Agregar número único
    const btn3 = document.getElementById('p3-btn-includes');
    const inputNum = document.getElementById('p3-numero');
    btn3.addEventListener('click', agregarNumeroUnico);
    inputNum.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') agregarNumeroUnico();
    });
}

/**
 * Verifica si un valor existe en el array del punto 1
 */
async function verificarValor1() {
    const valorInput = document.getElementById('p1-valor');
    const valor = valorInput.value.trim();

    if (valor === '') {
        document.getElementById('p1-valor-error').innerText = 'el valor no puede estar vacío';
        valorInput.classList.add('input-error');
        return;
    }

    try {
        const res = await fetch('/api/includes/verificar1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ valor })
        });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p1-resultado').innerText = data.resultado ? 'Sí, contiene el valor' : 'No contiene el valor';
        }
    } catch(e) {
        console.error(e);
    }
}

/**
 * Verifica si un valor existe en el array del punto 2
 */
async function verificarValor2() {
    const valorInput = document.getElementById('p2-valor');
    const valor = valorInput.value.trim();

    if (valor === '') {
        document.getElementById('p2-valor-error').innerText = 'el valor no puede estar vacío';
        valorInput.classList.add('input-error');
        return;
    }

    try {
        const res = await fetch('/api/includes/verificar2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ valor })
        });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p2-resultado').innerText = data.resultado ? 'Sí, contiene el valor' : 'No contiene el valor';
        }
    } catch(e) {
        console.error(e);
    }
}

/**
 * Agrega un número al array, pero solo si no existe previamente (evita duplicados)
 * Endpoint: POST /api/includes/numero
 */
async function agregarNumeroUnico() {
    const input = document.getElementById('p3-numero');
    if (input.classList.contains('input-error') || input.value === '') return;
    const arrayFijo = [5, 10, 15];
    try {
        const res = await fetch('/api/includes/numero', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numero: input.value, numeros: arrayFijo })
        });
        const data = await res.json();
        const resDiv = document.getElementById('p3-resultado');
        if (res.ok && data.ok) {
            resDiv.innerText = `Único. Se agregaría: ${JSON.stringify(data.resultado)}`;
            resDiv.className = 'fs-6 text-center p-2 bg-light rounded text-success';
        } else {
            resDiv.innerText = `Duplicado: Ya existe en el array`;
            resDiv.className = 'fs-6 text-center p-2 bg-light rounded text-danger';
        }
    } catch(e) {
        console.error(e);
    }
}
        

/**
 * Restablece el estado de un punto del ejercicio
 * @param {number} punto - Número del punto a reiniciar (1, 2 o 3)
 */
window.reiniciarPunto = function(punto) {
    if (punto === 1) {
        document.getElementById('p1-resultado').innerText = '-';
        document.getElementById('p1-valor').value = 'admin';
    } else if (punto === 2) {
        document.getElementById('p2-resultado').innerText = '-';
        document.getElementById('p2-valor').value = 'verde';
    } else if (punto === 3) {
        document.getElementById('p3-resultado').innerText = '-';
        document.getElementById('p3-resultado').className = 'fs-6 text-center p-2 bg-light rounded text-success';
        const p3Input = document.getElementById('p3-numero');
        if (p3Input) {
            p3Input.value = '';
            p3Input.classList.remove('input-error');
        }
        const p3Err = document.getElementById('p3-numero-error');
        if (p3Err) p3Err.innerText = '';
    }
};
