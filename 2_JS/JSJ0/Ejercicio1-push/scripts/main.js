
import { inicializarTema } from '../Context/theme.js';

let frutas = [];
let amigos = [
    { id: '1', valor: 'juan', fecha: '26/05/26' },
    { id: '2', valor: 'pedro', fecha: '26/05/26' }
];
let numeros = [10, 20, 30];

// aca inicializo todo cuando carga el dom
document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    renderizarTodo();
    configurarValidaciones();
    configurarEventos();
});

// renderiza todas las secciones
function renderizarTodo() {
    // render fruta
    const listaFruta = document.getElementById('p1-lista');
    listaFruta.innerHTML = '';
    frutas.forEach(f => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `<span>${f.valor}</span>`;
        listaFruta.appendChild(li);
    });

    if (frutas.length >= 3) {
        document.getElementById('p1-formulario').classList.add('d-none');
    } else {
        document.getElementById('p1-formulario').classList.remove('d-none');
    }

    // render amigos
    const listaAmigos = document.getElementById('p2-lista');
    listaAmigos.innerHTML = '';
    amigos.forEach((am, idx) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div>
                <strong>${am.valor}</strong>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-warning me-1" onclick="editarAmigo(${idx})">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarAmigo(${idx})">Borrar</button>
            </div>
        `;
        listaAmigos.appendChild(li);
    });

    // render numeros
    document.getElementById('p3-resultado').innerText = JSON.stringify(numeros);
}

// valida inputs en tiempo real
function configurarValidaciones() {
    const inputFruta = document.getElementById('p1-fruta');
    inputFruta.addEventListener('change', () => {
        const val = inputFruta.value;
        const errSpan = document.getElementById('p1-fruta-error');
        if (val === '') {
            inputFruta.classList.add('input-error');
            errSpan.innerText = 'debés elegir una fruta';
        } else {
            inputFruta.classList.remove('input-error');
            errSpan.innerText = '';
        }
    });

    const inputAmigo = document.getElementById('p2-amigo');
    inputAmigo.addEventListener('input', () => {
        const val = inputAmigo.value.trim();
        const errSpan = document.getElementById('p2-amigo-error');
        if (val === '') {
            inputAmigo.classList.add('input-error');
            errSpan.innerText = 'el campo no puede estar vacio';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/.test(val)) {
            inputAmigo.classList.add('input-error');
            errSpan.innerText = 'nombre invalido (solo letras y apostrofes)';
        } else {
            inputAmigo.classList.remove('input-error');
            errSpan.innerText = '';
        }
    });

    const inputNum = document.getElementById('p3-numero');
    inputNum.addEventListener('input', () => {
        const val = inputNum.value;
        const errSpan = document.getElementById('p3-numero-error');
        if (val === '') {
            inputNum.classList.add('input-error');
            errSpan.innerText = 'escribi un numero';
        } else {
            inputNum.classList.remove('input-error');
            errSpan.innerText = '';
        }
    });
}

// configura los eventos duales para cada boton
function configurarEventos() {
    const btnFruta = document.getElementById('p1-btn-add');
    const inputFruta = document.getElementById('p1-fruta');
    
    // evento 1: click
    btnFruta.addEventListener('click', enviarFruta);
    // evento 2: enter en input
    inputFruta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') enviarFruta();
    });

    const btnAmigo = document.getElementById('p2-btn-add');
    // evento 1: click
    btnAmigo.addEventListener('click', enviarAmigo);
    // evento 2: doble click en boton
    btnAmigo.addEventListener('dblclick', enviarAmigo);

    const btnNum = document.getElementById('p3-btn-add');
    const inputNum = document.getElementById('p3-numero');
    // evento 1: click
    btnNum.addEventListener('click', enviarNumero);
    // evento 2: enter en input
    inputNum.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') enviarNumero();
    });
}

// hace la llamada para guardar fruta
async function enviarFruta() {
    const input = document.getElementById('p1-fruta');
    if (input.classList.contains('input-error') || input.value.trim() === '') return;

    try {
        const res = await fetch('/api/push/fruta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fruta: input.value.trim(), frutas })
        });
        const data = await res.json();
        if (data.ok) {
            frutas = data.resultado;
            input.value = '';
            renderizarTodo();
        } else {
            document.getElementById('p1-fruta-error').innerText = data.error;
        }
    } catch (e) {
        console.error(e);
    }
}

// hace la llamada para guardar amigo (soporta edit)
async function enviarAmigo() {
    const input = document.getElementById('p2-amigo');
    const editIdx = document.getElementById('p2-edit-index').value;
    if (input.classList.contains('input-error') || input.value.trim() === '') return;

    try {
        const res = await fetch('/api/push/amigo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amigo: input.value.trim(), amigos, editIndex: editIdx })
        });
        const data = await res.json();
        if (data.ok) {
            amigos = data.resultado;
            input.value = '';
            document.getElementById('p2-edit-index').value = '';
            document.getElementById('p2-btn-add').innerText = 'Agregar Amigo (Click / Doble Click)';
            renderizarTodo();
        } else {
            document.getElementById('p2-amigo-error').innerText = data.error;
        }
    } catch (e) {
        console.error(e);
    }
}

// carga datos de un amigo para editar
window.editarAmigo = function(idx) {
    const amigo = amigos[idx];
    document.getElementById('p2-amigo').value = amigo.valor;
    document.getElementById('p2-edit-index').value = idx;
    document.getElementById('p2-btn-add').innerText = 'Modificar Amigo';
};

// borra un amigo del array
window.eliminarAmigo = function(idx) {
    amigos.splice(idx, 1);
    renderizarTodo();
};

// reinicia los arrays a su estado original
window.reiniciarPunto = function(punto) {
    if (punto === 1) {
        frutas = [];
    } else if (punto === 2) {
        amigos = [
            { id: '1', valor: 'juan' },
            { id: '2', valor: 'pedro' }
        ];
    } else if (punto === 3) {
        numeros = [10, 20, 30];
    }
    renderizarTodo();
};

// hace la llamada para validar y guardar el numero mayor
async function enviarNumero() {
    const input = document.getElementById('p3-numero');
    if (input.classList.contains('input-error') || input.value === '') return;

    try {
        const res = await fetch('/api/push/numero', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numero: input.value, numeros })
        });
        const data = await res.json();
        if (data.ok) {
            numeros = data.resultado;
            input.value = '';
            renderizarTodo();
        } else {
            document.getElementById('p3-numero-error').innerText = data.error;
            input.classList.add('input-error');
        }
    } catch (e) {
        console.error(e);
    }
}
        