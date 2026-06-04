
import { inicializarTema } from '../Context/theme.js';

let animales = ['perro', 'gato', 'loro', 'carpincho'];
let productos = ['yerba', 'azucar', 'fideos', 'galletitas'];
let items = ['item A', 'item B', 'item C', 'item D', 'item E'];

document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    renderizarTodo();
    configurarEventos();
});

function renderizarTodo() {
    // render animales
    const listAnim = document.getElementById('p1-lista');
    listAnim.innerHTML = '';
    animales.forEach(a => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerText = a;
        listAnim.appendChild(li);
    });

    // si no hay mas animales oculto el boton
    if (animales.length === 0) {
        document.getElementById('p1-btn-pop').classList.add('d-none');
    }

    // render productos
    const listProd = document.getElementById('p2-lista');
    listProd.innerHTML = '';
    productos.forEach(p => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerText = p;
        listProd.appendChild(li);
    });

    // si no hay mas productos oculto el boton
    if (productos.length === 0) {
        document.getElementById('p2-btn-pop').classList.add('d-none');
    }

    // render items
    const listItems = document.getElementById('p3-lista');
    listItems.innerHTML = '';
    items.forEach(i => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerText = i;
        listItems.appendChild(li);
    });

    // oculto boton de vaciar si ya no hay items (uso unico)
    if (items.length === 0) {
        document.getElementById('p3-btn-vaciar').classList.add('d-none');
    }
}

function configurarEventos() {
    const btnAnim = document.getElementById('p1-btn-pop');
    btnAnim.addEventListener('click', popAnimal);
    btnAnim.addEventListener('dblclick', popAnimal);

    const btnProd = document.getElementById('p2-btn-pop');
    btnProd.addEventListener('click', popProducto);
    btnProd.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        popProducto();
    });

    const btnVaciar = document.getElementById('p3-btn-vaciar');
    btnVaciar.addEventListener('click', vaciarTodo);
    btnVaciar.addEventListener('dblclick', vaciarTodo);
}

async function popAnimal() {
    if (animales.length === 0) return;
    try {
        const res = await fetch('/api/pop/animal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ animales })
        });
        const data = await res.json();
        if (data.ok) {
            animales = data.resultado;
            renderizarTodo();
        }
    } catch(e) {
        console.error(e);
    }
}

async function popProducto() {
    if (productos.length === 0) return;
    try {
        const res = await fetch('/api/pop/producto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productos })
        });
        const data = await res.json();
        if (data.ok) {
            productos = data.resultado;
            const msj = document.getElementById('p2-mensaje');
            msj.innerText = `Compraste y eliminaste: ${data.eliminado}`;
            msj.classList.remove('d-none');
            renderizarTodo();
        }
    } catch(e) {
        console.error(e);
    }
}

async function vaciarTodo() {
    if (items.length === 0) return;
    try {
        const res = await fetch('/api/pop/vaciar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items })
        });
        const data = await res.json();
        if (data.ok) {
            items = data.resultado;
            renderizarTodo();
        }
    } catch(e) {
        console.error(e);
    }
}

// reinicia los arrays a su estado original
window.reiniciarPunto = function(punto) {
    if (punto === 1) {
        animales = ['perro', 'gato', 'loro', 'carpincho'];
        document.getElementById('p1-btn-pop').classList.remove('d-none');
    } else if (punto === 2) {
        productos = ['yerba', 'azucar', 'fideos', 'galletitas'];
        document.getElementById('p2-mensaje').classList.add('d-none');
        document.getElementById('p2-btn-pop').classList.remove('d-none');
    } else if (punto === 3) {
        items = ['item A', 'item B', 'item C', 'item D', 'item E'];
        document.getElementById('p3-btn-vaciar').classList.remove('d-none');
    }
    renderizarTodo();
};
        