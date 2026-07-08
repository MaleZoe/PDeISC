
// Importar la función para inicializar el tema claro/oscuro
import { inicializarTema } from '../Context/theme.js';

// Inicializar la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    configurarValidaciones();
    configurarEventos();
});

/**
 * Convierte un string separado por comas a un array
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
 * Configura la validación en tiempo real de los campos
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
        const arrayStr = stringToArray(p3Input.value);
        const array = arrayStr.map(n => Number(n));
        renderizarArray('p3-array-actual', array);
    });
}

/**
 * Asigna eventos a los botones de los 3 puntos del ejercicio
 */
function configurarEventos() {
    // Punto 1: Triplicar números
    const btn1 = document.getElementById('p1-btn-map');
    btn1.addEventListener('click', triplicar);
    btn1.addEventListener('dblclick', triplicar);

    // Punto 2: Convertir nombres a mayúsculas
    const btn2 = document.getElementById('p2-btn-map');
    btn2.addEventListener('click', pasarMayusculas);
    btn2.addEventListener('mouseenter', pasarMayusculas);

    // Punto 3: Calcular IVA de precios
    const btn3 = document.getElementById('p3-btn-map');
    btn3.addEventListener('click', calcularIVA);
    btn3.addEventListener('dblclick', calcularIVA);
}

/**
 * Crea un nuevo array con cada número multiplicado por 3 usando map()
 * Endpoint: POST /api/map/triplicar
 */
async function triplicar() {
    const input = document.getElementById('p1-array');
    const numerosStr = stringToArray(input.value);

    if (numerosStr.length === 0) {
        alert('Por favor ingresá al menos un número');
        return;
    }

    try {
        const res = await fetch('/api/map/triplicar', {
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
 * Convierte un array de nombres en mayúsculas usando map()
 * Endpoint: POST /api/map/mayusculas
 */
async function pasarMayusculas() {
    const input = document.getElementById('p2-array');
    const nombres = stringToArray(input.value);

    if (nombres.length === 0) {
        alert('Por favor ingresá al menos un nombre');
        return;
    }

    try {
        const res = await fetch('/api/map/mayusculas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombres })
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
 * A un array de precios, le agrega el 21% de IVA y crea un nuevo array usando map()
 * Endpoint: POST /api/map/iva
 */
async function calcularIVA() {
    const input = document.getElementById('p3-array');
    const preciosStr = stringToArray(input.value);

    if (preciosStr.length === 0) {
        alert('Por favor ingresá al menos un precio');
        return;
    }

    try {
        const res = await fetch('/api/map/iva', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ preciosStr })
        });
        const data = await res.json();
        if (data.ok) {
            const resUl = document.getElementById('p3-resultado');
            resUl.innerHTML = '';
            data.resultado.forEach((item, idx) => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerText = `Producto ${idx + 1} con IVA: $${item}`;
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
        document.getElementById('p1-array').value = '1,3,5,7';
        renderizarArray('p1-array-actual', [1, 3, 5, 7]);
    } else if (punto === 2) {
        document.getElementById('p2-resultado').innerText = '-';
        document.getElementById('p2-array').value = 'tito,cacho,pepe';
        renderizarArray('p2-array-actual', ['tito', 'cacho', 'pepe']);
    } else if (punto === 3) {
        document.getElementById('p3-resultado').innerHTML = '';
        document.getElementById('p3-array').value = '100,200,500,1000';
        renderizarArray('p3-array-actual', [100, 200, 500, 1000]);
    }
};
