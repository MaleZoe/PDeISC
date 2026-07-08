
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
 * Convierte el string "nombre:edad" a un array de objetos {nombre, edad}
 * @param {string} str - String con entradas "nombre:edad" separadas por coma
 * @returns {{nombre: string, edad: number}[]}
 */
function stringToPersonas(str) {
    return str.split(',').map(item => {
        const [nombre, edad] = item.trim().split(':');
        return { nombre: nombre?.trim() ?? '', edad: Number(edad) };
    }).filter(p => p.nombre !== '');
}

/**
 * Renderiza el array de personas {nombre, edad} en el elemento indicado
 * @param {string} id - ID del elemento
 * @param {{nombre: string, edad: number}[]} personas
 */
function renderizarPersonas(id, personas) {
    const el = document.getElementById(id);
    el.innerText = '[ ' + personas.map(p => `{nombre:'${p.nombre}',edad:${p.edad}}`).join(', ') + ' ]';
}

/**
 * Configura la actualización en tiempo real del array al escribir en los campos
 */
function configurarValidaciones() {
    const p1Input = document.getElementById('p1-array');
    p1Input.addEventListener('input', () => {
        const array = stringToArray(p1Input.value);
        renderizarArray('p1-array-actual', array);
    });

    const p2Input = document.getElementById('p2-array');
    p2Input.addEventListener('input', () => {
        const arrayStr = stringToArray(p2Input.value);
        const array = arrayStr.map(n => Number(n));
        renderizarArray('p2-array-actual', array);
    });

    const p3Input = document.getElementById('p3-array');
    p3Input.addEventListener('input', () => {
        const personas = stringToPersonas(p3Input.value);
        renderizarPersonas('p3-array-actual', personas);
    });
}

/**
 * Asigna eventos a los botones de los 3 puntos del ejercicio
 */
function configurarEventos() {
    // Punto 1: Saludar nombres
    const btn1 = document.getElementById('p1-btn-foreach');
    btn1.addEventListener('click', saludar);
    btn1.addEventListener('mouseenter', saludar);

    // Punto 2: Imprimir dobles con forEach
    const btn2 = document.getElementById('p2-btn-foreach');
    btn2.addEventListener('click', calcularDobles);
    btn2.addEventListener('dblclick', calcularDobles);

    // Punto 3: Mostrar personas {nombre, edad}
    const btn3 = document.getElementById('p3-btn-foreach');
    btn3.addEventListener('click', mostrarPersonas);
    btn3.addEventListener('mouseenter', mostrarPersonas);
}

/**
 * Saluda a cada nombre del array usando forEach()
 * Endpoint: POST /api/foreach/saludar
 */
async function saludar() {
    const input = document.getElementById('p1-array');
    const nombres = stringToArray(input.value);

    if (nombres.length === 0) {
        alert('Por favor ingresá al menos un nombre');
        return;
    }

    try {
        const res = await fetch('/api/foreach/saludar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombres })
        });
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
        }
    } catch(e) {
        console.error(e);
    }
}

/**
 * Imprime el doble de cada número del array usando forEach()
 * Endpoint: POST /api/foreach/dobles
 */
async function calcularDobles() {
    const input = document.getElementById('p2-array');
    const numerosStr = stringToArray(input.value);

    if (numerosStr.length === 0) {
        alert('Por favor ingresá al menos un número');
        return;
    }

    try {
        const res = await fetch('/api/foreach/dobles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numerosStr })
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
 * Muestra cada persona con nombre y edad usando forEach()
 * Endpoint: POST /api/foreach/procesar
 */
async function mostrarPersonas() {
    const input = document.getElementById('p3-array');
    const personas = stringToPersonas(input.value);

    if (personas.length === 0) {
        alert('Por favor ingresá al menos una persona en formato nombre:edad');
        return;
    }

    try {
        const res = await fetch('/api/foreach/procesar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ personas })
        });
        const data = await res.json();
        if (data.ok) {
            const resUl = document.getElementById('p3-resultado');
            resUl.innerHTML = '';
            data.resultado.forEach(texto => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerText = texto;
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
        document.getElementById('p1-resultado').innerHTML = '';
        document.getElementById('p1-array').value = 'Ana,Beto,Cecilia';
        renderizarArray('p1-array-actual', ['Ana', 'Beto', 'Cecilia']);
    } else if (punto === 2) {
        document.getElementById('p2-resultado').innerText = '-';
        document.getElementById('p2-array').value = '2,4,8,16';
        renderizarArray('p2-array-actual', [2, 4, 8, 16]);
    } else if (punto === 3) {
        document.getElementById('p3-resultado').innerHTML = '';
        document.getElementById('p3-array').value = 'Gaby:25,Lucas:30,Marta:28';
        renderizarPersonas('p3-array-actual', [
            { nombre: 'Gaby', edad: 25 },
            { nombre: 'Lucas', edad: 30 },
            { nombre: 'Marta', edad: 28 }
        ]);
    }
};
