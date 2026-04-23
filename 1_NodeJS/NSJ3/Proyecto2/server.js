// Este servidor maneja el Proyecto 2 (Explorador de Eventos).
// Sirve diferentes páginas para probar eventos de mouse, teclado, formulario, etc.

const express = require('express');
const path = require('path');
const app = express();
const puerto = 3002; // Corre en el puerto 3002

// Log de consola para saber qué está pasando
app.use((req, res, next) => {
  console.log(`[Petición P2] ${req.method} ${req.url}`);
  next();
});

// Carpetas de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Rutas para cada una de las páginas de eventos
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'index.html')));
app.get('/eventos-mouse', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'eventos-mouse.html')));
app.get('/eventos-teclado', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'eventos-teclado.html')));
app.get('/eventos-formulario', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'eventos-formulario.html')));
app.get('/eventos-ventana', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'eventos-ventana.html')));
app.get('/eventos-tiempo', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'eventos-tiempo.html')));

// Ponemos el servidor a escuchar
app.listen(puerto, () => {
  console.log(`Proyecto 2 corriendo en http://localhost:${puerto}`);
});


