
import { inicializarTema } from '../Context/theme.js';

let preciosOriginales = [100, 200, 500, 1000];

document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    configurarEventos();
    renderizarPunto3();
});

function renderizarPunto3() {
    document.getElementById('p3-originales').innerText = JSON.stringify(preciosOriginales);
}

function configurarEventos() {
    const btn1 = document.getElementById('p1-btn-map');
    btn1.addEventListener('click', triplicar);
    btn1.addEventListener('dblclick', triplicar);

    const btn2 = document.getElementById('p2-btn-map');
    btn2.addEventListener('click', pasarMayusculas);
    btn2.addEventListener('mouseenter', pasarMayusculas);

    const btn3 = document.getElementById('p3-btn-map');
    btn3.addEventListener('click', calcularIVA);
    btn3.addEventListener('dblclick', calcularIVA);
}

async function triplicar() {
    try {
        const res = await fetch('/api/map/triplicar', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p1-resultado').innerText = JSON.stringify(data.resultado);
            document.getElementById('p1-btn-map').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}

async function pasarMayusculas() {
    try {
        const res = await fetch('/api/map/mayusculas', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p2-resultado').innerText = JSON.stringify(data.resultado);
            document.getElementById('p2-btn-map').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}

async function calcularIVA() {
    try {
        const res = await fetch('/api/map/iva', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            const resUl = document.getElementById('p3-resultado');
            resUl.innerHTML = '';
            data.resultado.forEach((item, idx) => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerText = `Producto ${idx + 1} con IVA: $${item}`;
                resUl.appendChild(li);
            });
            document.getElementById('p3-btn-map').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}
        

window.reiniciarPunto = function(punto) {
    if (punto === 1) {
        document.getElementById('p1-resultado').innerText = '-';
        document.getElementById('p1-btn-map').classList.remove('d-none');
    } else if (punto === 2) {
        document.getElementById('p2-resultado').innerText = '-';
        document.getElementById('p2-btn-map').classList.remove('d-none');
    } else if (punto === 3) {
        document.getElementById('p3-resultado').innerHTML = '';
        document.getElementById('p3-btn-map').classList.remove('d-none');
    }
};

