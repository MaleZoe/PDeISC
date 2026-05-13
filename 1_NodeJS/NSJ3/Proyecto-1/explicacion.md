# Explicación del Proyecto 1 - Laboratorio DOM

Este proyecto es una demostración básica de cómo manipular el Árbol de Objetos del Documento (DOM) usando JavaScript puro (Vanilla JS).

## Estructura
- **server.js**: Servidor Express configurado con ESModules para servir los archivos estáticos.
- **index.html**: Estructura principal usando Bootstrap para el diseño responsivo y "glassmorphism" para la estética.
- **estilos.css**: Definiciones visuales personalizadas, gradientes y efectos de tarjetas.
- **dom-basic.js**: Lógica que captura los eventos de los botones y modifica el DOM en tiempo real.

## Funcionamiento
1. **Agregar H1**: Crea un nodo `<h1>` dinámicamente y lo inyecta en la zona de renderizado.
2. **Cambiar Texto**: Modifica la propiedad `textContent` del nodo existente.
3. **Cambiar Color**: Altera el estilo `color` del H1 usando un array de colores predefinidos.
4. **Manejo de Imágenes**: Permite crear un nodo `<img>`, alternar su atributo `src` para cambiar la imagen y modificar su propiedad `width` para el tamaño.

Todo el código sigue el **Método Estanga**: modularidad, sin alerts, y prolijidad absoluta.
