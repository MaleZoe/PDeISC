import { initTheme, toggleTheme } from '../Context/theme.js';

// inicio tema
initTheme();
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

const display = document.getElementById('display');
const emptyTemplate = `
    <div class="h-100 d-flex flex-column align-items-center justify-content-center opacity-25">
        <i class="bi bi-columns-gap fs-1 mb-2"></i>
        <p>El contenido se renderizará aquí</p>
    </div>
`;

// inserto lista
document.getElementById('btn-lista').addEventListener('click', () => {
    if (display.querySelector('.opacity-25')) display.innerHTML = '';
    display.innerHTML += `
        <div class="fade-in mb-3">
            <h6 class="fw-bold small text-primary mb-2">Lista Generada</h6>
            <ul class="list-group shadow-sm border-0">
                <li class="list-group-item d-flex align-items-center"><i class="bi bi-check2-square me-2 text-success"></i>Tarea del sistema #${Math.floor(Math.random()*100)}</li>
                <li class="list-group-item d-flex align-items-center"><i class="bi bi-check2-square me-2 text-success"></i>Actualización de registros</li>
            </ul>
        </div>
    `;
});

// inserto tabla
document.getElementById('btn-tabla').addEventListener('click', () => {
    if (display.querySelector('.opacity-25')) display.innerHTML = '';
    display.innerHTML += `
        <div class="fade-in mb-3">
            <h6 class="fw-bold small text-secondary mb-2">Tabla de Auditoría</h6>
            <div class="table-responsive shadow-sm rounded-3 border">
                <table class="table table-sm table-hover mb-0">
                    <thead class="table-light"><tr><th>Cod</th><th>Status</th></tr></thead>
                    <tbody><tr><td>${Date.now().toString().slice(-4)}</td><td><span class="badge bg-success">Active</span></td></tr></tbody>
                </table>
            </div>
        </div>
    `;
});

// inserto alerta
document.getElementById('btn-alerta').addEventListener('click', () => {
    if (display.querySelector('.opacity-25')) display.innerHTML = '';
    display.innerHTML += `
        <div class="alert alert-info border-0 shadow-sm d-flex align-items-center fade-in mb-3" role="alert">
            <i class="bi bi-info-circle-fill me-2 fs-5"></i>
            <div>Inyección de componente exitosa vía <strong>innerHTML</strong>.</div>
        </div>
    `;
});

// limpio
document.getElementById('btn-limpiar').addEventListener('click', () => {
    display.innerHTML = emptyTemplate;
});
