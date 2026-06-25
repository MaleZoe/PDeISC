# Consigna 1 — Manipulación DOM

Proyecto de práctica sobre creación y modificación dinámica de elementos HTML desde JavaScript.

## Objetivo

Demostrar operaciones básicas del DOM: crear un `<h1>`, cambiar su texto y color, e insertar/modificar imágenes con eventos de click.

## Estructura

| Archivo | Función |
|---------|---------|
| `pages/index.html` | Layout responsive con panel de controles y canvas de preview |
| `scripts/main.js` | Lógica de creación/edición de H1 e imágenes |
| `Context/theme.js` | Toggle claro/oscuro con persistencia en localStorage |
| `styles/light.css` / `dark.css` | Temas con variables CSS y media queries |
| `server.js` | Servidor Express estático (puerto **3001**) |

## Funcionalidades DOM

- **Agregar H1:** crea `#mi-h1` con texto "Hola DOM"
- **Cambiar texto:** alterna entre "Hola DOM" y "Chau DOM"
- **Cambiar color:** asigna un color aleatorio al título
- **Agregar imagen:** inserta `<img>` desde picsum.photos
- **Cambiar imagen:** recarga con timestamp para evitar caché
- **Redimensionar:** alterna entre ancho completo y 300px

## Tema y responsive

- Botón de tema en el header (icono luna/sol)
- Sidebar de controles deja de ser sticky en pantallas < 768px
- Animación `.fade-in` al insertar elementos

## Cómo correrlo

```bash
npm install
node server.js
# http://localhost:3001
```
