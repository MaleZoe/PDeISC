
import { inicializarTema } from '../Context/theme.js';

document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    configurarEventos();
});

function configurarEventos() {
    const btn1 = document.getElementById('p1-btn-foreach');
    btn1.addEventListener('click', saludar);
    btn1.addEventListener('mouseenter', saludar);

    const btn2 = document.getElementById('p2-btn-foreach');
    btn2.addEventListener('click', calcularDobles);
    btn2.addEventListener('dblclick', calcularDobles);

    const btn3 = document.getElementById('p3-btn-foreach');
    btn3.addEventListener('click', mostrarPersonas);
    btn3.addEventListener('mouseenter', mostrarPersonas);
}

async function saludar() {
    try {
        const res = await fetch('/api/foreach/saludar', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            const resUl = document.getElementById('p1-resultado');
            resUl.innerHTML = '';
            data.resultado.forEach(saludo => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerText = saludo;
                resUl.appendChild(li);
            });
            document.getElementById('p1-btn-foreach').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}

async function calcularDobles() {
    try {
        const res = await fetch('/api/foreach/dobles', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p2-resultado').innerText = JSON.stringify(data.resultado);
            document.getElementById('p2-btn-foreach').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}

async function mostrarPersonas() {
    try {
        const res = await fetch('/api/foreach/personas', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            const resUl = document.getElementById('p3-resultado');
            resUl.innerHTML = '';
            data.resultado.forEach(pText => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerText = pText;
                resUl.appendChild(li);
            });
            document.getElementById('p3-btn-foreach').classList.add('d-none');
        }
    } catch(e) {
        console.error(e);
    }
}
        

window.reiniciarPunto = function(punto) {
    if (punto === 1) {
        document.getElementById('p1-resultado').innerHTML = '';
        document.getElementById('p1-btn-foreach').classList.remove('d-none');
    } else if (punto === 2) {
        document.getElementById('p2-resultado').innerText = '-';
        document.getElementById('p2-btn-foreach').classList.remove('d-none');
    } else if (punto === 3) {
        document.getElementById('p3-resultado').innerHTML = '';
        document.getElementById('p3-btn-foreach').classList.remove('d-none');
    }
};

