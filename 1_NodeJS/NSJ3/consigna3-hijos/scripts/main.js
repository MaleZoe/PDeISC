import { initTheme, toggleTheme } from '../Context/theme.js';

// inicio tema
initTheme();
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// comp 1: mouseover
const comp1 = document.getElementById('comp-1');
comp1.addEventListener('mouseover', () => {
    comp1.classList.add('bg-primary', 'text-white', 'shadow-lg');
});
comp1.addEventListener('mouseout', () => {
    comp1.classList.remove('bg-primary', 'text-white', 'shadow-lg');
});

// comp 2: dblclick
const comp2 = document.getElementById('comp-2');
comp2.addEventListener('dblclick', () => {
    comp2.style.transform = comp2.style.transform === 'rotate(10deg)' ? 'rotate(0deg)' : 'rotate(10deg)';
    comp2.classList.toggle('border-success');
});

// comp 3: teclado
const inputTeclado = document.getElementById('input-teclado');
const feedbackTeclado = document.getElementById('feedback-teclado');
if (inputTeclado) {
    inputTeclado.addEventListener('keyup', (e) => {
        feedbackTeclado.innerHTML = `<i class="bi bi-key me-1"></i>Última tecla: <strong>${e.key}</strong>`;
    });
}

// comp 4: foco
const inputFoco = document.getElementById('input-foco');
const feedbackFoco = document.getElementById('feedback-foco');
if (inputFoco) {
    inputFoco.addEventListener('focus', () => {
        feedbackFoco.textContent = 'Estado: Activo (En foco)';
        feedbackFoco.classList.replace('bg-danger-subtle', 'bg-success-subtle');
        feedbackFoco.classList.replace('text-danger', 'text-success');
    });
    inputFoco.addEventListener('blur', () => {
        feedbackFoco.textContent = 'Estado: Inactivo';
        feedbackFoco.classList.replace('bg-success-subtle', 'bg-danger-subtle');
        feedbackFoco.classList.replace('text-success', 'text-danger');
    });
}

// comp 5: contextmenu toggle
const comp5 = document.getElementById('comp-5');
let isLocked = false;

comp5.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    isLocked = !isLocked;

    if (isLocked) {
        comp5.classList.replace('bg-primary-subtle', 'bg-danger-subtle');
        comp5.querySelector('h5').textContent = 'Custom Context Menu (Bloqueado)';
        comp5.querySelector('p').innerHTML = '<span class="fw-bold"><i class="bi bi-shield-fill-check me-1"></i>Capturado. Click derecho de nuevo para liberar.</span>';
        comp5.querySelector('i').className = 'bi bi-shield-lock-fill fs-1 text-danger';
    } else {
        comp5.classList.replace('bg-danger-subtle', 'bg-primary-subtle');
        comp5.querySelector('h5').textContent = 'Custom Context Menu';
        comp5.querySelector('p').innerHTML = 'Probá el click derecho para ver cómo capturamos el evento.';
        comp5.querySelector('i').className = 'bi bi-shield-lock fs-1 text-primary';
    }
});

// Lógica de contador de hijos (Punto 3 de la consigna)
const inspectables = document.querySelectorAll('.inspectable');

inspectables.forEach(card => {
    card.addEventListener('click', (e) => {
        // evitamos que el click en el input cuente como click en la card si no queremos
        if (e.target.tagName === 'INPUT') return;

        const count = card.children.length;
        const badge = card.querySelector('.counter-badge');
        
        if (badge) {
            badge.textContent = `${count} hijos`;
            badge.classList.replace('bg-dark', 'bg-primary');
            badge.classList.add('fade-in');
            
            // efecto visual momentaneo
            card.style.outline = '2px solid var(--primary-color)';
            setTimeout(() => card.style.outline = 'none', 500);
        }
    });
});
