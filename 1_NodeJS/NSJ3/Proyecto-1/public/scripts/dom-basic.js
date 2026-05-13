// lógica para el proyecto 1 - dom básico
// acá manejamos los botones y el despiole que pide la consigna

// selecciono los elementos del dom
const renderZone = document.getElementById('renderZone');
const btnAddH1 = document.getElementById('btnAddH1');
const btnChangeText = document.getElementById('btnChangeText');
const btnChangeColor = document.getElementById('btnChangeColor');
const btnAddImg = document.getElementById('btnAddImg');
const btnChangeImg = document.getElementById('btnChangeImg');
const btnResizeImg = document.getElementById('btnResizeImg');

// variables para control
let currentH1 = null;
let currentImg = null;

// función para agregar el h1
const agregarH1 = () => {
    if (currentH1) return; // si ya existe no lo agrego de nuevo, no seas animal
    
    currentH1 = document.createElement('h1');
    currentH1.textContent = 'Hola DOM';
    currentH1.classList.add('fw-bold');
    
    // limpio la zona y agrego
    renderZone.innerHTML = '';
    renderZone.appendChild(currentH1);
};

// función para cambiar el texto del h1
const cambiarTextoH1 = () => {
    if (!currentH1) {
        console.warn('Che, primero tenés que agregar el H1');
        return;
    }
    currentH1.textContent = 'Chau DOM';
};

// función para cambiar el color del h1
const cambiarColorH1 = () => {
    if (!currentH1) return;
    // le meto un color random para que quede bien cheto
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    currentH1.style.color = randomColor;
};

// función para agregar una imagen
const agregarImagen = () => {
    if (currentImg) return;
    
    currentImg = document.createElement('img');
    currentImg.src = '../assets/robot.png';
    currentImg.alt = 'Robot Estanga';
    currentImg.style.width = '200px'; // tamaño inicial
    
    renderZone.appendChild(currentImg);
};

// función para cambiar la imagen
const cambiarImagen = () => {
    if (!currentImg) return;
    // cambio entre el robot y la ciudad
    if (currentImg.src.includes('robot')) {
        currentImg.src = '../assets/city.png';
    } else {
        currentImg.src = '../assets/robot.png';
    }
};

// función para cambiar el tamaño de la imagen
const cambiarTamañoImagen = () => {
    if (!currentImg) return;
    // si es chica la agrando, si es grande la achico
    if (currentImg.style.width === '200px') {
        currentImg.style.width = '400px';
    } else {
        currentImg.style.width = '200px';
    }
};

// asigno los eventos a los botones
btnAddH1.addEventListener('click', agregarH1);
btnChangeText.addEventListener('click', cambiarTextoH1);
btnChangeColor.addEventListener('click', cambiarColorH1);
btnAddImg.addEventListener('click', agregarImagen);
btnChangeImg.addEventListener('click', cambiarImagen);
btnResizeImg.addEventListener('click', cambiarTamañoImagen);
