
import { inicializarTema } from '../Context/theme.js';

document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    configurarEventos();
});

function configurarEventos() {
    const btn1 = document.getElementById('p1-btn-sort');
    btn1.addEventListener('click', ordenarNum);
    btn1.addEventListener('dblclick', ordenarNum);

    const btn2 = document.getElementById('p2-btn-sort');
    btn2.addEventListener('click', ordenarPal);
    btn2.addEventListener('mouseenter', ordenarPal);

    const btn3 = document.getElementById('p3-btn-sort');
    btn3.addEventListener('click', ordenarPers);
    btn3.addEventListener('dblclick', ordenarPers);
}

async function ordenarNum() {
    try {
        const res = await fetch('/api/sort/numeros', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p1-resultado').innerText = JSON.stringify(data.resultado);
        }
    } catch(e) {
        console.error(e);
    }
}

async function ordenarPal() {
    try {
        const res = await fetch('/api/sort/palabras', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p2-resultado').innerText = JSON.stringify(data.resultado);
        }
    } catch(e) {
        console.error(e);
    }
}

async function ordenarPers() {
    try {
        const res = await fetch('/api/sort/personas', { method: 'POST' });
        const data = await res.json();
        if (data.ok) {
            const resUl = document.getElementById('p3-resultado');
            resUl.innerHTML = '';
            data.resultado.forEach(p => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerText = `${p.nombre} (${p.edad} años)`;
                resUl.appendChild(li);
            });
        }
    } catch(e) {
        console.error(e);
    }
}
        

window.reiniciarPunto = function(punto) {
    if (punto === 1) {
        document.getElementById('p1-resultado').innerText = '-';
    } else if (punto === 2) {
        document.getElementById('p2-resultado').innerText = '-';
    } else if (punto === 3) {
        document.getElementById('p3-resultado').innerHTML = '';
    }
};

