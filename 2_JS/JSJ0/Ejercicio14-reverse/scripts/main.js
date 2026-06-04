
import { inicializarTema } from '../Context/theme.js';

document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    configurarValidaciones();
    configurarEventos();
});

function configurarValidaciones() {
    const inputTxt = document.getElementById('p3-texto');
    inputTxt.addEventListener('input', () => {
        const val = inputTxt.value.trim();
        const err = document.getElementById('p3-texto-error');
        if (val === '') {
            inputTxt.classList.add('input-error');
            err.innerText = 'pone algun texto para dar vuelta';
        } else {
            inputTxt.classList.remove('input-error');
            err.innerText = '';
        }
    });
}

function configurarEventos() {
    const btn1 = document.getElementById('p1-btn-reverse');
    btn1.addEventListener('click', reverseLetras);
    btn1.addEventListener('dblclick', reverseLetras);

    const btn2 = document.getElementById('p2-btn-reverse');
    btn2.addEventListener('click', reverseNumeros);
    btn2.addEventListener('mouseenter', reverseNumeros);

    const btn3 = document.getElementById('p3-btn-reverse');
    const inputTxt = document.getElementById('p3-texto');
    btn3.addEventListener('click', reverseTexto);
    inputTxt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') reverseTexto();
    });
}

async function reverseLetras() {
    try {
        const res = await fetch('/api/reverse/letras', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p1-resultado').innerText = JSON.stringify(data.resultado);
            document.getElementById('p1-btn-reverse').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}

async function reverseNumeros() {
    try {
        const res = await fetch('/api/reverse/numeros', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p2-resultado').innerText = JSON.stringify(data.resultado);
            document.getElementById('p2-btn-reverse').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}

async function reverseTexto() {
    const input = document.getElementById('p3-texto');
    if (input.classList.contains('input-error') || input.value.trim() === '') return;
    try {
        const res = await fetch('/api/reverse/texto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: input.value })
        });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p3-resultado').innerText = data.resultado;
            document.getElementById('p3-btn-reverse').classList.add('d-none');
            input.value = '';
        }
    } catch(e) {
        console.error(e);
    }
}
        

window.reiniciarPunto = function(punto) {
    if (punto === 1) {
        document.getElementById('p1-resultado').innerText = '-';
        document.getElementById('p1-btn-reverse').classList.remove('d-none');
    } else if (punto === 2) {
        document.getElementById('p2-resultado').innerText = '-';
        document.getElementById('p2-btn-reverse').classList.remove('d-none');
    } else if (punto === 3) {
        document.getElementById('p3-resultado').innerText = '-';
        document.getElementById('p3-btn-reverse').classList.remove('d-none');
        const input = document.getElementById('p3-texto');
        if (input) {
            input.value = '';
            input.classList.remove('input-error');
        }
        const err = document.getElementById('p3-texto-error');
        if (err) err.innerText = '';
    }
};

