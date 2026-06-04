
import { inicializarTema } from '../Context/theme.js';

document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    configurarEventos();
});

function configurarEventos() {
    const btn1 = document.getElementById('p1-btn-index');
    btn1.addEventListener('click', buscarPerro);
    btn1.addEventListener('mouseenter', buscarPerro);

    const btn2 = document.getElementById('p2-btn-index');
    btn2.addEventListener('click', buscar50);
    btn2.addEventListener('dblclick', buscar50);

    const btn3 = document.getElementById('p3-btn-index');
    btn3.addEventListener('click', buscarMadrid);
    btn3.addEventListener('dblclick', buscarMadrid);
}

async function buscarPerro() {
    try {
        const res = await fetch('/api/indexof/perro', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p1-resultado').innerText = 'Indice: ' + data.resultado;
            document.getElementById('p1-btn-index').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}

async function buscar50() {
    try {
        const res = await fetch('/api/indexof/50', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p2-resultado').innerText = 'Indice del 50: ' + data.resultado;
            document.getElementById('p2-btn-index').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}

async function buscarMadrid() {
    try {
        const res = await fetch('/api/indexof/madrid', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            if (data.resultado === -1) {
                document.getElementById('p3-resultado').innerHTML = `<span class="text-danger">${data.mensaje}</span>`;
            } else {
                document.getElementById('p3-resultado').innerText = 'Indice de Madrid: ' + data.resultado;
            }
            document.getElementById('p3-btn-index').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}
        

window.reiniciarPunto = function(punto) {
    if (punto === 1) {
        document.getElementById('p1-resultado').innerText = '-';
        document.getElementById('p1-btn-index').classList.remove('d-none');
    } else if (punto === 2) {
        document.getElementById('p2-resultado').innerText = '-';
        document.getElementById('p2-btn-index').classList.remove('d-none');
    } else if (punto === 3) {
        document.getElementById('p3-resultado').innerText = '-';
        document.getElementById('p3-btn-index').classList.remove('d-none');
    }
};

