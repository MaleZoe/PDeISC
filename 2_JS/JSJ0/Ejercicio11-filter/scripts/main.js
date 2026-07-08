
// Importar la función para inicializar el tema claro/oscuro
import { inicializarTema } from '../Context/theme.js';

// Inicializar la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    configurarValidaciones();
    configurarEventos();
});

/**
 * Convierte un string separado por comas a un array de strings
 * @param {string} str - String separado por comas
 * @returns {string[]} Array de valores
 */
function stringToArray(str) {
    return str.split(',').map(item => item.trim()).filter(item => item !== '');
}

/**
 * Renderiza un array en un elemento HTML
 * @param {string} id - ID del elemento
 * @param {any[]} array - Array a renderizar
 */
function renderizarArray(id, array) {
    const el = document.getElementById(id);
    el.innerText = JSON.stringify(array);
}

/**
 * Convierte el string "nombre:true/false" a un array de objetos {nombre, activo}
 * @param {string} str - String con entradas "nombre:booleano" separadas por coma
 * @returns {{nombre: string, activo: boolean}[]}
 */
function stringToUsuarios(str) {
    return str.split(',').map(item => {
        const partes = item.trim().split(':');
        const nombre = partes[0]?.trim() ?? '';
        const activo = partes[1]?.trim().toLowerCase() === 'true';
        return { nombre, activo };
    }).filter(u => u.nombre !== '');
}

/**
 * Renderiza el array de usuarios {nombre, activo} en el elemento indicado
 * @param {string} id - ID del elemento
 * @param {{nombre: string, activo: boolean}[]} usuarios
 */
function renderizarUsuarios(id, usuarios) {
    const el = document.getElementById(id);
    el.innerText = '[ ' + usuarios.map(u => `{nombre:'${u.nombre}',activo:${u.activo}}`).join(', ') + ' ]';
}

/**
 * Configura la actualización en tiempo real del array al escribir en los campos
 */
function configurarValidaciones() {
    const p1Input = document.getElementById('p1-array');
    p1Input.addEventListener('input', () => {
        const arrayStr = stringToArray(p1Input.value);
        const array = arrayStr.map(n => Number(n));
        renderizarArray('p1-array-actual', array);
    });

    const p2Input = document.getElementById('p2-array');
    p2Input.addEventListener('input', () => {
        const array = stringToArray(p2Input.value);
        renderizarArray('p2-array-actual', array);
    });

    const p3Input = document.getElementById('p3-array');
    p3Input.addEventListener('input', () => {
        const usuarios = stringToUsuarios(p3Input.value);
        renderizarUsuarios('p3-array-actual', usuarios);
    });
}

/**
 * Asigna eventos a los botones de los 3 puntos del ejercicio
 */
function configurarEventos() {
    // Punto 1: Filtrar mayores a 10
    const btn1 = document.getElementById('p1-btn-filter');
    btn1.addEventListener('click', filtrarMayores10);
    btn1.addEventListener('dblclick', filtrarMayores10);

    // Punto 2: Filtrar palabras largas
    const btn2 = document.getElementById('p2-btn-filter');
    btn2.addEventListener('click', filtrarPalabras);
    btn2.addEventListener('dblclick', filtrarPalabras);

    // Punto 3: Filtrar usuarios activos
    const btn3 = document.getElementById('p3-btn-filter');
    btn3.addEventListener('click', filtrarActivos);
    btn3.addEventListener('mouseenter', filtrarActivos);
}

/**
 * Filtra los números mayores a 10 usando filter()
 * Endpoint: POST /api/filter/mayores10
 */
async function filtrarMayores10() {
    const input = document.getElementById('p1-array');
    const numerosStr = stringToArray(input.value);

    if (numerosStr.length === 0) {
        alert('Por favor ingresá al menos un número');
        return;
    }

    try {
        const res = await fetch('/api/filter/mayores10', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numerosStr })
        });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p1-resultado').innerText = JSON.stringify(data.resultado);
        }
    } catch(e) {
        console.error(e);
    }
}

/**
 * Filtra las palabras con más de 5 letras usando filter()
 * Endpoint: POST /api/filter/palabras
 */
async function filtrarPalabras() {
    const input = document.getElementById('p2-array');
    const palabras = stringToArray(input.value);

    if (palabras.length === 0) {
        alert('Por favor ingresá al menos una palabra');
        return;
    }

    try {
        const res = await fetch('/api/filter/palabras', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ palabras })
        });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('p2-resultado').innerText = JSON.stringify(data.resultado);
        }
    } catch(e) {
        console.error(e);
    }
}

/**
 * Filtra los usuarios con estado activo usando filter()
 * Endpoint: POST /api/filter/activos
 */
async function filtrarActivos() {
    const input = document.getElementById('p3-array');
    const usuarios = stringToUsuarios(input.value);

    if (usuarios.length === 0) {
        alert('Por favor ingresá al menos un usuario en formato nombre:true o nombre:false');
        return;
    }

    try {
        const res = await fetch('/api/filter/activos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuarios })
        });
        const data = await res.json();
        if (data.ok) {
            const resUl = document.getElementById('p3-resultado');
            resUl.innerHTML = '';
            data.resultado.forEach(u => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerText = `${u.nombre} (Activo)`;
                resUl.appendChild(li);
            });
        }
    } catch(e) {
        console.error(e);
    }
}


/**
 * Restablece el estado de un punto del ejercicio
 * @param {number} punto - Número del punto a reiniciar (1, 2 o 3)
 */
window.reiniciarPunto = function(punto) {
    if (punto === 1) {
        document.getElementById('p1-resultado').innerText = '-';
        document.getElementById('p1-array').value = '3,11,8,20,5,14';
        renderizarArray('p1-array-actual', [3, 11, 8, 20, 5, 14]);
    } else if (punto === 2) {
        document.getElementById('p2-resultado').innerText = '-';
        document.getElementById('p2-array').value = 'termo,mate,carpincho,milanesa,sol,javascript';
        renderizarArray('p2-array-actual', ['termo', 'mate', 'carpincho', 'milanesa', 'sol', 'javascript']);
    } else if (punto === 3) {
        document.getElementById('p3-resultado').innerHTML = '';
        document.getElementById('p3-array').value = 'Ana:true,Mati:false,Santi:true';
        renderizarUsuarios('p3-array-actual', [
            { nombre: 'Ana', activo: true },
            { nombre: 'Mati', activo: false },
            { nombre: 'Santi', activo: true }
        ]);
    }
};
