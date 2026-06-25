import { initTheme, toggleTheme } from '../Context/theme.js';

initTheme();
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

const container = document.getElementById('nodos-container');
const btnCrear = document.getElementById('btn-crear');
const btnModificar = document.getElementById('btn-modificar');
const nodosVacio = document.getElementById('nodos-vacio');
const cambiosVacio = document.getElementById('cambios-vacio');
const cambiosLista = document.getElementById('cambios-lista');

let nodosCreados = false;
let atributosModificados = false;

function crearNodoWrapper(etiqueta, nodo) {
    const wrapper = document.createElement('div');
    wrapper.className = 'card border-0 shadow-sm p-3 fade-in';
    wrapper.dataset.tipo = etiqueta;

    const label = document.createElement('span');
    label.className = 'badge bg-secondary-subtle mb-2';
    label.textContent = `<${etiqueta}>`;

    const cambio = document.createElement('p');
    cambio.className = 'nodo-cambio small mb-0 mt-2';
    cambio.hidden = true;

    wrapper.append(label, nodo, cambio);
    return wrapper;
}

function registrarCambio(etiqueta, atributo, antes, despues) {
    cambiosVacio.hidden = true;

    const item = document.createElement('li');
    item.className = 'cambio-item border-bottom pb-2 mb-2 fade-in';
    item.innerHTML = `
        <strong class="cambio-etiqueta">&lt;${etiqueta}&gt;</strong><br>
        <span class="small cambio-detalle">Atributo: <code>${atributo}</code></span><br>
        <span class="small cambio-detalle">Cambio: <span class="cambio-antes">${antes}</span> → <span class="cambio-despues">${despues}</span></span>
    `;
    cambiosLista.appendChild(item);
}

function mostrarCambioEnNodo(wrapper, atributo, antes, despues) {
    const cambio = wrapper.querySelector('.nodo-cambio');
    cambio.hidden = false;
    cambio.innerHTML = `<strong>${atributo}:</strong> <span class="cambio-antes">${antes}</span> → <span class="cambio-despues">${despues}</span>`;
}

btnCrear.addEventListener('click', () => {
    if (nodosCreados) return;

    nodosVacio.remove();
    container.innerHTML = '';

    const a = document.createElement('a');
    a.href = 'https://www.google.com';
    a.textContent = 'Link a Google';
    a.className = 'd-block nodo-link';
    a.target = '_blank';
    container.appendChild(crearNodoWrapper('a', a));

    const img = document.createElement('img');
    img.src = 'https://picsum.photos/id/237/200/100';
    img.alt = 'Imagen de ejemplo';
    img.className = 'img-fluid rounded';
    img.style.maxWidth = '200px';
    container.appendChild(crearNodoWrapper('img', img));

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Botón habilitado';
    button.className = 'btn btn-outline-primary btn-sm';
    container.appendChild(crearNodoWrapper('button', button));

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Escribí algo...';
    input.className = 'form-control form-control-sm';
    container.appendChild(crearNodoWrapper('input', input));

    const div = document.createElement('div');
    div.id = 'mi-div-original';
    div.textContent = 'Contenido del div';
    div.className = 'p-2 border rounded';
    container.appendChild(crearNodoWrapper('div', div));

    nodosCreados = true;
    btnModificar.disabled = false;
});

btnModificar.addEventListener('click', () => {
    if (!nodosCreados || atributosModificados) return;

    cambiosLista.innerHTML = '';
    cambiosVacio.hidden = true;

    container.querySelectorAll('[data-tipo]').forEach((wrapper) => {
        const nodo = wrapper.children[1];
        const tipo = wrapper.dataset.tipo;

        switch (tipo) {
            case 'a': {
                const antes = nodo.getAttribute('href');
                nodo.setAttribute('href', 'https://www.bing.com');
                nodo.textContent = 'Link a Bing';
                registrarCambio('a', 'href', antes, nodo.getAttribute('href'));
                mostrarCambioEnNodo(wrapper, 'href', antes, nodo.getAttribute('href'));
                break;
            }
            case 'img': {
                const antes = nodo.getAttribute('src');
                nodo.setAttribute('src', 'https://picsum.photos/id/1025/200/100');
                nodo.setAttribute('alt', 'Nueva imagen');
                registrarCambio('img', 'src', antes, nodo.getAttribute('src'));
                mostrarCambioEnNodo(wrapper, 'src', antes, nodo.getAttribute('src'));
                break;
            }
            case 'button': {
                const antes = nodo.disabled ? 'true' : 'false';
                nodo.disabled = true;
                nodo.textContent = 'Botón deshabilitado';
                registrarCambio('button', 'disabled', antes, 'true');
                mostrarCambioEnNodo(wrapper, 'disabled', antes, 'true');
                break;
            }
            case 'input': {
                const antes = nodo.value || '(vacío)';
                nodo.value = 'Valor modificado';
                nodo.readOnly = true;
                registrarCambio('input', 'value', antes, nodo.value);
                mostrarCambioEnNodo(wrapper, 'value', antes, nodo.value);
                break;
            }
            case 'div': {
                const antes = nodo.getAttribute('id');
                nodo.setAttribute('id', 'mi-div-modificado');
                nodo.textContent = 'Div con id modificado';
                registrarCambio('div', 'id', antes, nodo.getAttribute('id'));
                mostrarCambioEnNodo(wrapper, 'id', antes, nodo.getAttribute('id'));
                break;
            }
        }
    });

    atributosModificados = true;
    btnModificar.disabled = true;
});
