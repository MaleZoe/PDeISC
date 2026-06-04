
import { inicializarTema } from '../Context/theme.js';

let numeros = [99, 100, 101, 102];
let mensajes = ['hola profe', 'como va?', 'me corrige el tp?'];
let clientes = ['Carlos', 'Marta', 'Esteban'];

document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    renderizarTodo();
    configurarEventos();
});

function renderizarTodo() {
    // render numeros
    const listNum = document.getElementById('p1-lista');
    listNum.innerHTML = '';
    numeros.forEach(n => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerText = n;
        listNum.appendChild(li);
    });

    // si se vacia oculto el boton
    if (numeros.length === 0) {
        document.getElementById('p1-btn-shift').classList.add('d-none');
    } else {
        document.getElementById('p1-btn-shift').classList.remove('d-none');
    }

    // render mensajes
    const listMsj = document.getElementById('p2-lista');
    listMsj.innerHTML = '';
    mensajes.forEach(m => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerText = m;
        listMsj.appendChild(li);
    });

    // si no hay mas mensajes oculto el boton
    if (mensajes.length === 0) {
        document.getElementById('p2-btn-shift').classList.add('d-none');
    } else {
        document.getElementById('p2-btn-shift').classList.remove('d-none');
    }

    // render clientes
    const listCli = document.getElementById('p3-lista');
    listCli.innerHTML = '';
    clientes.forEach(c => {
        const li = document.createElement('li');
        li.className = 'list-group-item list-group-item-info';
        li.innerText = c;
        listCli.appendChild(li);
    });

    // si no hay mas clientes oculto el boton
    if (clientes.length === 0) {
        document.getElementById('p3-btn-shift').classList.add('d-none');
    } else {
        document.getElementById('p3-btn-shift').classList.remove('d-none');
    }
}

function configurarEventos() {
    const btnNum = document.getElementById('p1-btn-shift');
    btnNum.addEventListener('click', shiftNumero);
    btnNum.addEventListener('dblclick', shiftNumero);

    const btnMsj = document.getElementById('p2-btn-shift');
    btnMsj.addEventListener('click', shiftMensaje);
    btnMsj.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        shiftMensaje();
    });

    const btnCli = document.getElementById('p3-btn-shift');
    btnCli.addEventListener('click', shiftCliente);
    btnCli.addEventListener('dblclick', shiftCliente);
}

async function shiftNumero() {
    if (numeros.length === 0) return;
    try {
        const res = await fetch('/api/shift/numero', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeros })
        });
        const data = await res.json();
        if (data.ok) {
            numeros = data.resultado;
            renderizarTodo();
        }
    } catch(e) {
        console.error(e);
    }
}

async function shiftMensaje() {
    if (mensajes.length === 0) return;
    try {
        const res = await fetch('/api/shift/mensaje', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mensajes })
        });
        const data = await res.json();
        if (data.ok) {
            mensajes = data.resultado;
            renderizarTodo();
        }
    } catch(e) {
        console.error(e);
    }
}

async function shiftCliente() {
    if (clientes.length === 0) return;
    try {
        const res = await fetch('/api/shift/cliente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientes })
        });
        const data = await res.json();
        if (data.ok) {
            clientes = data.resultado;
            renderizarTodo();
        }
    } catch(e) {
        console.error(e);
    }
}
        

window.reiniciarPunto = function(punto) {
    if (punto === 1) {
        numeros = [99, 100, 101, 102];
    } else if (punto === 2) {
        mensajes = ['hola profe', 'como va?', 'me corrige el tp?'];
    } else if (punto === 3) {
        clientes = ['Carlos', 'Marta', 'Esteban'];
    }
    renderizarTodo();
};

