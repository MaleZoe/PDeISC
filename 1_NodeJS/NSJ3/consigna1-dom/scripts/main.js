import { initTheme, toggleTheme } from '../Context/theme.js';

// inicio tema al arrancar
initTheme();
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// contenedores del canvas
const containerH1 = document.getElementById('container-h1');
const containerImg = document.getElementById('container-img');

// botones del dom
const btnAddH1 = document.getElementById('btn-add-h1');
const btnChangeText = document.getElementById('btn-change-text');
const btnChangeColor = document.getElementById('btn-change-color');
const btnAddImg = document.getElementById('btn-add-img');
const btnChangeImg = document.getElementById('btn-change-img');
const btnResizeImg = document.getElementById('btn-resize-img');

// función para meter el h1 de prepo
btnAddH1.addEventListener('click', () => {
    // quito el empty state si existe
    const empty = containerH1.querySelector('.empty-state');
    if (empty) empty.remove();

    const h1 = document.createElement('h1');
    h1.id = 'mi-h1';
    h1.textContent = 'Hola DOM';
    h1.className = 'display-1 fw-bold tracking-tight mb-0 fade-in';
    containerH1.appendChild(h1);
    
    btnAddH1.style.display = 'none';
    btnChangeText.style.display = 'inline-block';
    btnChangeColor.style.display = 'inline-block';
});

// función para cambiar el texto si te aburriste
btnChangeText.addEventListener('click', () => {
    const h1 = document.getElementById('mi-h1');
    if (h1) {
        h1.textContent = h1.textContent === 'Hola DOM' ? 'Chau DOM' : 'Hola DOM';
    }
});

// función para ponerle colorcito al titulo
btnChangeColor.addEventListener('click', () => {
    const h1 = document.getElementById('mi-h1');
    if (h1) {
        const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        h1.style.setProperty('color', randomColor, 'important');
    }
});

// función para clavar una imagen cualquiera
btnAddImg.addEventListener('click', () => {
    const img = document.createElement('img');
    img.id = 'mi-img';
    img.src = 'https://picsum.photos/600/400';
    img.alt = 'Imagen dinámica';
    img.className = 'img-fluid rounded-4 shadow-lg fade-in';
    img.style.transition = 'all 0.5s ease';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.objectFit = 'contain';
    containerImg.appendChild(img);
    
    btnAddImg.style.display = 'none';
    btnChangeImg.style.display = 'inline-block';
    btnResizeImg.style.display = 'inline-block';
});

// función para cambiar la foto por otra
btnChangeImg.addEventListener('click', () => {
    const img = document.getElementById('mi-img');
    if (img) {
        img.src = `https://picsum.photos/600/400?t=${new Date().getTime()}`;
    }
});

// función para agrandar o achicar la imagen
btnResizeImg.addEventListener('click', () => {
    const img = document.getElementById('mi-img');
    if (img) {
        const isSmall = img.style.maxWidth === '300px';
        img.style.maxWidth = isSmall ? '100%' : '300px';
    }
});
