// Este script maneja la interactividad de la página (DHTML).
// El objetivo es modificar la página sin recargarla, usando JavaScript.

document.addEventListener('DOMContentLoaded', () => {
  
  // Variables para saber si ya agregamos cosas o para cambiar colores
  let h1Agregado = false;
  let imagenAgregada = false;
  let indiceColor = 0;
  let estadoTamanio = 0; 
  let indiceImagen = 0;

  // Listas de colores e imágenes para ir rotando
  const colores = ['#e63946', '#2a9d8f', '#f4a261', '#7209b7'];
  const imagenes = [
    'https://picsum.photos/seed/dom1/400/250',
    'https://picsum.photos/seed/dom2/400/250',
    'https://picsum.photos/seed/dom3/400/250',
    'https://picsum.photos/seed/dom4/400/250'
  ];

  // El lugar de la pantalla donde vamos a meter los elementos
  const areaVisualizacion = document.getElementById('areaVisualizacion');

  // Traemos los botones del HTML para darles órdenes
  const btnAgregarH1 = document.getElementById('btnAgregarH1');
  const btnCambiarTexto = document.getElementById('btnCambiarTexto');
  const btnCambiarColor = document.getElementById('btnCambiarColor');
  const btnAgregarImagen = document.getElementById('btnAgregarImagen');
  const btnCambiarImagen = document.getElementById('btnCambiarImagen');
  const btnCambiarTamanio = document.getElementById('btnCambiarTamanio');

  // Le decimos a cada botón qué función ejecutar cuando le hagan clic
  btnAgregarH1.addEventListener('click', agregarH1);
  btnCambiarTexto.addEventListener('click', cambiarTexto);
  btnCambiarColor.addEventListener('click', cambiarColor);
  btnAgregarImagen.addEventListener('click', agregarImagen);
  btnCambiarImagen.addEventListener('click', cambiarImagen);
  btnCambiarTamanio.addEventListener('click', cambiarTamanio);

  // Crea un título H1 y lo mete en el área de visualización
  function agregarH1() {
    if (!h1Agregado) {
      const nuevoH1 = document.createElement('h1');
      nuevoH1.id = 'textoDinamico';
      nuevoH1.textContent = 'Hola DOM';
      areaVisualizacion.prepend(nuevoH1); // Lo pone al principio
      h1Agregado = true;
      actualizarBotones(); // Habilita los botones que dependen del H1
    }
  }

  // Busca el H1 que creamos y le cambia lo que dice
  function cambiarTexto() {
    if (h1Agregado) {
      const h1Dinamico = document.getElementById('textoDinamico');
      if (h1Dinamico) {
        h1Dinamico.textContent = 'Chau DOM';
      }
    }
  }

  // Va pasando por la lista de colores y se lo aplica al H1
  function cambiarColor() {
    if (h1Agregado) {
      const h1Dinamico = document.getElementById('textoDinamico');
      if (h1Dinamico) {
        indiceColor = (indiceColor + 1) % colores.length;
        h1Dinamico.style.color = colores[indiceColor];
      }
    }
  }

  // Crea una etiqueta de imagen y le pone una URL de la lista
  function agregarImagen() {
    if (!imagenAgregada) {
      const nuevaImagen = document.createElement('img');
      nuevaImagen.id = 'imagenDinamica';
      nuevaImagen.src = imagenes[indiceImagen];
      nuevaImagen.alt = 'Imagen de prueba';
      nuevaImagen.style.width = '150px'; 
      estadoTamanio = 0; 
      
      areaVisualizacion.appendChild(nuevaImagen); // La mete al final
      imagenAgregada = true;
      actualizarBotones(); // Habilita botones de imagen
    }
  }

  // Cambia la foto de la imagen que ya está en pantalla
  function cambiarImagen() {
    if (imagenAgregada) {
      const imgActiva = document.getElementById('imagenDinamica');
      if (imgActiva) {
        indiceImagen = (indiceImagen + 1) % imagenes.length;
        imgActiva.src = imagenes[indiceImagen];
      }
    }
  }

  // Cambia el ancho de la imagen entre tres tamaños distintos
  function cambiarTamanio() {
    if (imagenAgregada) {
      const imgActiva = document.getElementById('imagenDinamica');
      if (imgActiva) {
        estadoTamanio = (estadoTamanio + 1) % 3;
        if (estadoTamanio === 0) imgActiva.style.width = '150px';
        else if (estadoTamanio === 1) imgActiva.style.width = '300px';
        else imgActiva.style.width = '500px';
      }
    }
  }

  // Activa o desactiva botones según si ya creamos el H1 o la imagen
  function actualizarBotones() {
    btnCambiarTexto.disabled = !h1Agregado;
    btnCambiarColor.disabled = !h1Agregado;
    btnCambiarImagen.disabled = !imagenAgregada;
    btnCambiarTamanio.disabled = !imagenAgregada;
  }
});
