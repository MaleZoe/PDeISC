
import { inicializarTema } from '../Context/theme.js';

let colores = [];
let tareas = ['leer apuntes', 'comprar pan'];
let usuarios = ['admin_1', 'moderador_g'];

document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    renderizarTodo();
    configurarValidaciones();
    configurarEventos();
});

function renderizarTodo() {
    // render colores
    const listCol = document.getElementById('p1-lista');
    listCol.innerHTML = '';
    colores.forEach(c => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerText = c;
        listCol.appendChild(li);
    });

    if (colores.length >= 3) {
        document.getElementById('p1-formulario').classList.add('d-none');
    }

    // render tareas
    const listTar = document.getElementById('p2-lista');
    listTar.innerHTML = '';
    tareas.forEach(t => {
        const li = document.createElement('li');
        li.className = 'list-group-item list-group-item-warning';
        li.innerText = t;
        listTar.appendChild(li);
    });

    // render usuarios
    const listUsr = document.getElementById('p3-lista');
    listUsr.innerHTML = '';
    usuarios.forEach(u => {
        const li = document.createElement('li');
        li.className = 'list-group-item list-group-item-success';
        li.innerText = u;
        listUsr.appendChild(li);
    });
}

function configurarValidaciones() {
    const inputColor = document.getElementById('p1-color');
    inputColor.addEventListener('change', () => {
        const val = inputColor.value;
        const err = document.getElementById('p1-color-error');
        if (val === '') {
            inputColor.classList.add('input-error');
            err.innerText = 'debés elegir un color';
        } else {
            inputColor.classList.remove('input-error');
            err.innerText = '';
        }
    });

    const inputTarea = document.getElementById('p2-tarea');
    inputTarea.addEventListener('input', () => {
        const val = inputTarea.value.trim();
        const err = document.getElementById('p2-tarea-error');
        if (val === '') {
            inputTarea.classList.add('input-error');
            err.innerText = 'escribi una tarea';
        } else {
            inputTarea.classList.remove('input-error');
            err.innerText = '';
        }
    });

    const inputUsr = document.getElementById('p3-usuario');
    inputUsr.addEventListener('input', () => {
        const val = inputUsr.value.trim();
        const err = document.getElementById('p3-usuario-error');
        if (val === '') {
            inputUsr.classList.add('input-error');
            err.innerText = 'escribi un usuario';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val)) {
            inputUsr.classList.add('input-error');
            err.innerText = 'no se permiten numeros ni simbolos';
        } else {
            inputUsr.classList.remove('input-error');
            err.innerText = '';
        }
    });
}

function configurarEventos() {
    const btnColor = document.getElementById('p1-btn-unshift');
    const inputColor = document.getElementById('p1-color');
    btnColor.addEventListener('click', unshiftColor);
    inputColor.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') unshiftColor();
    });

    const btnTarea = document.getElementById('p2-btn-unshift');
    const inputTarea = document.getElementById('p2-tarea');
    btnTarea.addEventListener('click', unshiftTarea);
    inputTarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') unshiftTarea();
    });

    const btnUsr = document.getElementById('p3-btn-unshift');
    btnUsr.addEventListener('click', unshiftUsuario);
    btnUsr.addEventListener('dblclick', unshiftUsuario);
}

async function unshiftColor() {
    const input = document.getElementById('p1-color');
    if (input.classList.contains('input-error') || input.value.trim() === '') return;
    try {
        const res = await fetch('/api/unshift/color', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ color: input.value.trim(), colores })
        });
        const data = await res.json();
        if (data.ok) {
            colores = data.resultado;
            input.value = '';
            renderizarTodo();
        }
    } catch(e) {
        console.error(e);
    }
}

async function unshiftTarea() {
    const input = document.getElementById('p2-tarea');
    if (input.classList.contains('input-error') || input.value.trim() === '') return;
    try {
        const res = await fetch('/api/unshift/tarea', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tarea: input.value.trim(), tareas })
        });
        const data = await res.json();
        if (data.ok) {
            tareas = data.resultado;
            input.value = '';
            renderizarTodo();
        }
    } catch(e) {
        console.error(e);
    }
}

async function conectarUsuario() {
    const input = document.getElementById('p3-usuario');
    if (input.classList.contains('input-error') || input.value.trim() === '') return;

    try {
        const res = await fetch('/api/unshift/usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: input.value.trim(), usuarios })
        });
        const data = await res.json();
        if (data.ok) {
            usuarios = data.resultado;
            input.value = '';
            renderizarTodo();
        }
    } catch(e) {
        console.error(e);
    }
}

// reinicia los arrays a su estado original
window.reiniciarPunto = function(punto) {
    if (punto === 1) {
        colores = [];
        document.getElementById('p1-formulario').classList.remove('d-none');
    } else if (punto === 2) {
        tareas = ['comprar pan', 'limpiar la pieza'];
    } else if (punto === 3) {
        usuarios = ['estanga', 'admin'];
    }
    renderizarTodo();
};
        