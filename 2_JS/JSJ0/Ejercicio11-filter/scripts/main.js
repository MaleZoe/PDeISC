
import { inicializarTema } from '../Context/theme.js';

document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    configurarValidaciones();
    configurarEventos();
});

function configurarValidaciones() {
    // no se necesitan validaciones de input
}

function configurarEventos() {
    const btn1 = document.getElementById('p1-btn-filter');
    btn1.addEventListener('click', filtrarMayores10);
    btn1.addEventListener('dblclick', filtrarMayores10);

    const btn2 = document.getElementById('p2-btn-filter');
    btn2.addEventListener('click', filtrarPalabras);
    btn2.addEventListener('dblclick', filtrarPalabras);

    const btn3 = document.getElementById('p3-btn-filter');
    btn3.addEventListener('click', filtrarActivos);
    btn3.addEventListener('mouseenter', filtrarActivos);
}

async function filtrarMayores10() {
    try {
        const res = await fetch('/api/filter/mayores10', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p1-resultado').innerText = JSON.stringify(data.resultado);
            document.getElementById('p1-btn-filter').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}

async function filtrarPalabras() {
    try {
        const res = await fetch('/api/filter/palabras', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p2-resultado').innerText = JSON.stringify(data.resultado);
            document.getElementById('p2-btn-filter').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}

async function filtrarActivos() {
    try {
        const res = await fetch('/api/filter/activos', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            const resUl = document.getElementById('p3-resultado');
            resUl.innerHTML = '';
            data.resultado.forEach(u => {
                const li = document.createElement('li');
                li.className = 'list-group-item list-group-item-success';
                li.innerText = u.nombre + ' (Activo)';
                resUl.appendChild(li);
            });
            document.getElementById('p3-btn-filter').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}
        

window.reiniciarPunto = function(punto) {
    if (punto === 1) {
        document.getElementById('p1-resultado').innerText = '-';
        document.getElementById('p1-btn-filter').classList.remove('d-none');
    } else if (punto === 2) {
        document.getElementById('p2-resultado').innerText = '-';
        document.getElementById('p2-btn-filter').classList.remove('d-none');
        const input = document.getElementById('p2-palabra');
        if (input) {
            input.value = '';
            input.classList.remove('input-error');
        }
        const err = document.getElementById('p2-palabra-error');
        if (err) err.innerText = '';
    } else if (punto === 3) {
        document.getElementById('p3-resultado').innerHTML = '';
        document.getElementById('p3-btn-filter').classList.remove('d-none');
    }
};

