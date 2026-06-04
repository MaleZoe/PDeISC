
import { inicializarTema } from '../Context/theme.js';

document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    configurarEventos();
});

function configurarEventos() {
    const btn1 = document.getElementById('p1-btn-reduce');
    btn1.addEventListener('click', sumarTodo);
    btn1.addEventListener('dblclick', sumarTodo);

    const btn2 = document.getElementById('p2-btn-reduce');
    btn2.addEventListener('click', multiplicarTodo);
    btn2.addEventListener('mouseenter', multiplicarTodo);

    const btn3 = document.getElementById('p3-btn-reduce');
    btn3.addEventListener('click', totalCarrito);
    btn3.addEventListener('dblclick', totalCarrito);
}

async function sumarTodo() {
    try {
        const res = await fetch('/api/reduce/sumar', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p1-resultado').innerText = data.resultado;
            document.getElementById('p1-btn-reduce').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}

async function multiplicarTodo() {
    try {
        const res = await fetch('/api/reduce/multiplicar', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p2-resultado').innerText = data.resultado;
            document.getElementById('p2-btn-reduce').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}

async function totalCarrito() {
    try {
        const res = await fetch('/api/reduce/total', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p3-resultado').innerText = '$' + data.resultado;
            document.getElementById('p3-btn-reduce').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}
        

window.reiniciarPunto = function(punto) {
    if (punto === 1) {
        document.getElementById('p1-resultado').innerText = '-';
        document.getElementById('p1-btn-reduce').classList.remove('d-none');
    } else if (punto === 2) {
        document.getElementById('p2-resultado').innerText = '-';
        document.getElementById('p2-btn-reduce').classList.remove('d-none');
    } else if (punto === 3) {
        document.getElementById('p3-resultado').innerText = '-';
        document.getElementById('p3-btn-reduce').classList.remove('d-none');
    }
};

