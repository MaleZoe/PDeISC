import { initTheme, toggleTheme } from '../Context/theme.js';

// inicio tema
initTheme();
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

const container = document.getElementById('nodos-container');
const btnCrear = document.getElementById('btn-crear');
const btnModificar = document.getElementById('btn-modificar');
const log = document.getElementById('log');
const logLista = document.getElementById('log-lista');
const consolePlaceholder = document.getElementById('console-placeholder');

// creo los 5 nodos diferentes
btnCrear.addEventListener('click', () => {
    // 1. Anchor
    const a = document.createElement('a');
    a.href = 'https://www.google.com';
    a.innerHTML = `<i class="bi bi-link-45deg me-2"></i>Link a Google`;
    a.className = 'btn btn-outline-primary text-start fade-in w-100';
    a.target = '_blank';
    container.appendChild(a);

    // 2. Image
    const img = document.createElement('img');
    img.src = 'https://picsum.photos/id/237/200/100';
    img.alt = 'Perrito';
    img.className = 'img-fluid rounded shadow-sm fade-in d-block mx-auto';
    img.style.maxWidth = '200px';
    container.appendChild(img);

    // 3. Button
    const btn = document.createElement('button');
    btn.innerText = 'Botón Original';
    btn.className = 'btn btn-info text-white fade-in w-100';
    btn.type = 'button';
    container.appendChild(btn);

    // 4. Input
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Escribí algo acá...';
    input.className = 'form-control fade-in';
    container.appendChild(input);

    // 5. Div
    const div = document.createElement('div');
    div.innerText = 'Este es un DIV vacío';
    div.className = 'p-3 border rounded bg-light-subtle text-center fade-in';
    div.id = 'mi-div-original';
    container.appendChild(div);

    btnCrear.style.display = 'none';
    btnModificar.style.display = 'inline-block';
});

// modifico atributos de forma específica
btnModificar.addEventListener('click', () => {
    const hijos = Array.from(container.children);
    log.style.display = 'block';
    consolePlaceholder.style.display = 'none';
    
    hijos.forEach((nodo, idx) => {
        let msg = '';
        const tag = nodo.tagName.toLowerCase();

        switch(tag) {
            case 'a':
                const viejaUrl = nodo.href;
                nodo.href = 'https://www.bing.com';
                nodo.innerHTML = `<i class="bi bi-search me-2"></i>Ahora busca en Bing`;
                nodo.classList.replace('btn-outline-primary', 'btn-outline-warning');
                msg = `A: href <span class="text-warning">${viejaUrl}</span> -> <span class="text-info">${nodo.href}</span>`;
                break;
            case 'img':
                const viejoSrc = nodo.src;
                nodo.src = 'https://picsum.photos/id/1025/200/100';
                nodo.alt = 'Pug refactorizado';
                msg = `IMG: src <span class="text-warning">.../id/237/...</span> -> <span class="text-info">.../id/1025/...</span>`;
                break;
            case 'button':
                nodo.innerText = 'Botón Deshabilitado';
                nodo.disabled = true;
                nodo.classList.replace('btn-info', 'btn-danger');
                msg = `BUTTON: status <span class="text-warning">enabled</span> -> <span class="text-danger">disabled</span>`;
                break;
            case 'input':
                nodo.value = 'Valor Inyectado';
                nodo.readOnly = true;
                nodo.className = 'form-control bg-secondary-subtle';
                msg = `INPUT: value <span class="text-warning">empty</span> -> <span class="text-info">Valor Inyectado</span>`;
                break;
            case 'div':
                const viejoId = nodo.id;
                nodo.id = 'mi-div-refactorizado';
                nodo.innerText = 'DIV Mutado con éxito';
                nodo.className = 'p-3 border border-success rounded bg-success-subtle text-success-emphasis text-center';
                msg = `DIV: id <span class="text-warning">${viejoId}</span> -> <span class="text-info">${nodo.id}</span>`;
                break;
        }

        const li = document.createElement('li');
        li.className = 'mb-2 border-bottom border-secondary pb-1';
        li.innerHTML = `<span class="text-success">[MUTATION]</span> ${msg}`;
        logLista.appendChild(li);
    });
    
    btnModificar.style.display = 'none';
});
