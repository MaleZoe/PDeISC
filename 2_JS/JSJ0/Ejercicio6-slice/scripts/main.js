
import { inicializarTema } from '../Context/theme.js';

document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    configurarEventos();
});

function configurarEventos() {
    const btn1 = document.getElementById('p1-btn-slice');
    btn1.addEventListener('click', sliceNumeros);
    btn1.addEventListener('dblclick', sliceNumeros);

    const btn2 = document.getElementById('p2-btn-slice');
    btn2.addEventListener('click', slicePeliculas);
    btn2.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        slicePeliculas();
    });

    const btn3 = document.getElementById('p3-btn-slice');
    btn3.addEventListener('click', sliceUltimos);
    btn3.addEventListener('dblclick', sliceUltimos);
}

async function sliceNumeros() {
    try {
        const res = await fetch('/api/slice/numeros', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p1-resultado').innerText = JSON.stringify(data.resultado);
            document.getElementById('p1-btn-slice').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}

async function slicePeliculas() {
    try {
        const res = await fetch('/api/slice/peliculas', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p2-resultado').innerText = JSON.stringify(data.resultado);
            document.getElementById('p2-btn-slice').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}

async function sliceUltimos() {
    try {
        const res = await fetch('/api/slice/ultimos', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p3-resultado').innerText = JSON.stringify(data.resultado);
            document.getElementById('p3-btn-slice').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}
        

window.reiniciarPunto = function(punto) {
    if (punto === 1) {
        document.getElementById('p1-resultado').innerText = '-';
        document.getElementById('p1-btn-slice').classList.remove('d-none');
    } else if (punto === 2) {
        document.getElementById('p2-resultado').innerText = '-';
        document.getElementById('p2-btn-slice').classList.remove('d-none');
    } else if (punto === 3) {
        document.getElementById('p3-resultado').innerText = '-';
        document.getElementById('p3-btn-slice').classList.remove('d-none');
    }
};

