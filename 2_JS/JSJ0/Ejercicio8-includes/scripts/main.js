
import { inicializarTema } from '../Context/theme.js';

let numeros = [5, 10, 15];

document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    configurarValidaciones();
    configurarEventos();
});

function configurarValidaciones() {
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

function configurarEventos() {
    const btn1 = document.getElementById('p1-btn-includes');
    btn1.addEventListener('click', verificarAdmin);
    btn1.addEventListener('dblclick', verificarAdmin);

    const btn2 = document.getElementById('p2-btn-includes');
    btn2.addEventListener('click', verificarVerde);
    btn2.addEventListener('mouseenter', verificarVerde);

    const btn3 = document.getElementById('p3-btn-includes');
    const inputNum = document.getElementById('p3-numero');
    btn3.addEventListener('click', agregarNumeroUnico);
    inputNum.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') agregarNumeroUnico();
    });
}

async function verificarAdmin() {
    try {
        const res = await fetch('/api/includes/admin', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p1-resultado').innerText = data.resultado ? 'Sí, contiene admin' : 'No contiene admin';
            document.getElementById('p1-btn-includes').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}

async function verificarVerde() {
    try {
        const res = await fetch('/api/includes/verde', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p2-resultado').innerText = data.resultado ? 'Sí, existe verde' : 'No existe verde';
            document.getElementById('p2-btn-includes').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}

async function agregarNumeroUnico() {
    const input = document.getElementById('p3-numero');
    if (input.classList.contains('input-error') || input.value === '') return;
    try {
        const res = await fetch('/api/includes/numero', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numero: input.value, numeros })
        });
        const data = await res.json();
        if (data.ok) {
            numeros = data.resultado;
            input.value = '';
            document.getElementById('p3-resultado').innerText = JSON.stringify(numeros);
        } else {
            document.getElementById('p3-numero-error').innerText = data.error;
            input.classList.add('input-error');
        }
    } catch(e) {
        console.error(e);
    }
}
        

window.reiniciarPunto = function(punto) {
    if (punto === 1) {
        document.getElementById('p1-resultado').innerText = '-';
        document.getElementById('p1-btn-includes').classList.remove('d-none');
    } else if (punto === 2) {
        document.getElementById('p2-resultado').innerText = '-';
        document.getElementById('p2-btn-includes').classList.remove('d-none');
    } else if (punto === 3) {
        numeros = [5, 10, 15];
        document.getElementById('p3-resultado').innerText = JSON.stringify(numeros);
        const p3Input = document.getElementById('p3-numero');
        if (p3Input) {
            p3Input.value = '';
            p3Input.classList.remove('input-error');
        }
        const p3Err = document.getElementById('p3-numero-error');
        if (p3Err) p3Err.innerText = '';
    }
};

