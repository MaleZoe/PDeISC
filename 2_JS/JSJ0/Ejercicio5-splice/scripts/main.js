
import { inicializarTema } from '../Context/theme.js';

let letras = ['A', 'B', 'C', 'D', 'E'];
let nombres = ['Juan', 'Pedro', 'Sofia'];
let listaOriginal = ['mate', 'cafe', 'te', 'chocolate', 'leche'];

document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    renderizarTodo();
    configurarValidaciones();
    configurarEventos();
});

function renderizarTodo() {
    // render letras
    document.getElementById('p1-letras').innerText = JSON.stringify(letras);
    
    // si queda menos de 2 elementos no se puede borrar 2 desde pos 1
    if (letras.length <= 1) {
        document.getElementById('p1-btn-splice').classList.add('d-none');
    } else {
        document.getElementById('p1-btn-splice').classList.remove('d-none');
    }

    // render nombres
    document.getElementById('p2-resultado').innerText = JSON.stringify(nombres);
    
    // si ya se inserto (solo uso una vez para el ejemplo)
    if (nombres.length > 3) {
        document.getElementById('p2-formulario').classList.add('d-none');
    } else {
        document.getElementById('p2-formulario').classList.remove('d-none');
    }

    // render items
    document.getElementById('p3-resultado').innerText = JSON.stringify(listaOriginal);
}

function configurarValidaciones() {
    const inputNombre = document.getElementById('p2-nombre');
    inputNombre.addEventListener('input', () => {
        const val = inputNombre.value.trim();
        const err = document.getElementById('p2-nombre-error');
        if (val === '') {
            inputNombre.classList.add('input-error');
            err.innerText = 'el nombre no puede estar vacio';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val)) {
            inputNombre.classList.add('input-error');
            err.innerText = 'solo letras';
        } else {
            inputNombre.classList.remove('input-error');
            err.innerText = '';
        }
    });

    const inputIndice = document.getElementById('p3-indice');
    inputIndice.addEventListener('input', () => {
        const val = parseInt(inputIndice.value);
        const err = document.getElementById('p3-indice-error');
        if (isNaN(val) || val < 0 || val > listaOriginal.length - 2) {
            inputIndice.classList.add('input-error');
            err.innerText = 'el indice debe ser de 0 a ' + (listaOriginal.length - 2);
        } else {
            inputIndice.classList.remove('input-error');
            err.innerText = '';
        }
    });

    const inputValor = document.getElementById('p3-valor');
    inputValor.addEventListener('input', () => {
        const val = inputValor.value.trim();
        const err = document.getElementById('p3-valor-error');
        const partes = val.split(',').map(p => p.trim());
        if (partes.length < 2 || partes[0] === '' || partes[1] === '') {
            inputValor.classList.add('input-error');
            err.innerText = 'escribi 2 palabras no vacias separadas por coma';
        } else {
            inputValor.classList.remove('input-error');
            err.innerText = '';
        }
    });
}

function configurarEventos() {
    const btn1 = document.getElementById('p1-btn-splice');
    btn1.addEventListener('click', spliceEliminar);
    btn1.addEventListener('dblclick', spliceEliminar);

    const btn2 = document.getElementById('p2-btn-splice');
    const inputNombre = document.getElementById('p2-nombre');
    btn2.addEventListener('click', spliceInsertar);
    inputNombre.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') spliceInsertar();
    });

    const btn3 = document.getElementById('p3-btn-splice');
    const inputValor = document.getElementById('p3-valor');
    btn3.addEventListener('click', spliceReemplazar);
    inputValor.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') spliceReemplazar();
    });
}

async function spliceEliminar() {
    if (letras.length < 2) return;
    try {
        const res = await fetch('/api/splice/eliminar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ letras })
        });
        const data = await res.json();
        if (data.ok) {
            letras = data.resultado;
            renderizarTodo();
        }
    } catch(e) {
        console.error(e);
    }
}

async function spliceInsertar() {
    const input = document.getElementById('p2-nombre');
    const err = document.getElementById('p2-nombre-error');
    const val = input.value.trim();
    
    if (val === '') {
        input.classList.add('input-error');
        err.innerText = 'el nombre no puede estar vacio';
        return;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val)) {
        input.classList.add('input-error');
        err.innerText = 'solo letras';
        return;
    } else {
        input.classList.remove('input-error');
        err.innerText = '';
    }

    try {
        const res = await fetch('/api/splice/insertar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: val, nombres })
        });
        const data = await res.json();
        if (data.ok) {
            nombres = data.resultado;
            input.value = '';
            renderizarTodo();
        }
    } catch(e) {
        console.error(e);
    }
}

async function spliceReemplazar() {
    const inputInd = document.getElementById('p3-indice');
    const inputVal = document.getElementById('p3-valor');
    const errInd = document.getElementById('p3-indice-error');
    const errVal = document.getElementById('p3-valor-error');
    
    const valInd = parseInt(inputInd.value);
    const valVal = inputVal.value.trim();
    
    let tieneError = false;
    
    if (isNaN(valInd) || valInd < 0 || valInd > listaOriginal.length - 2) {
        inputInd.classList.add('input-error');
        errInd.innerText = 'el indice debe ser de 0 a ' + (listaOriginal.length - 2);
        tieneError = true;
    } else {
        inputInd.classList.remove('input-error');
        errInd.innerText = '';
    }
    
    const partes = valVal.split(',').map(p => p.trim());
    if (partes.length < 2 || partes[0] === '' || partes[1] === '') {
        inputVal.classList.add('input-error');
        errVal.innerText = 'escribi 2 palabras no vacias separadas por coma';
        tieneError = true;
    } else {
        inputVal.classList.remove('input-error');
        errVal.innerText = '';
    }
    
    if (tieneError) return;

    try {
        const res = await fetch('/api/splice/reemplazar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ indice: inputInd.value, valores: inputVal.value, lista: listaOriginal })
        });
        const data = await res.json();
        if (data.ok) {
            listaOriginal = data.resultado;
            inputInd.value = '';
            inputVal.value = '';
            renderizarTodo();
        }
    } catch(e) {
        console.error(e);
    }
}
        

window.reiniciarPunto = function(punto) {
    if (punto === 1) {
        letras = ['A', 'B', 'C', 'D', 'E'];
    } else if (punto === 2) {
        nombres = ['Juan', 'Pedro', 'Sofia'];
        const p2Input = document.getElementById('p2-nombre');
        if (p2Input) {
            p2Input.value = '';
            p2Input.classList.remove('input-error');
        }
        const p2Err = document.getElementById('p2-nombre-error');
        if (p2Err) p2Err.innerText = '';
    } else if (punto === 3) {
        listaOriginal = ['mate', 'cafe', 'te', 'chocolate', 'leche'];
        const p3Ind = document.getElementById('p3-indice');
        const p3Val = document.getElementById('p3-valor');
        if (p3Ind) {
            p3Ind.value = '';
            p3Ind.classList.remove('input-error');
        }
        if (p3Val) {
            p3Val.value = '';
            p3Val.classList.remove('input-error');
        }
        const p3IndErr = document.getElementById('p3-indice-error');
        const p3ValErr = document.getElementById('p3-valor-error');
        if (p3IndErr) p3IndErr.innerText = '';
        if (p3ValErr) p3ValErr.innerText = '';
    }
    renderizarTodo();
};

