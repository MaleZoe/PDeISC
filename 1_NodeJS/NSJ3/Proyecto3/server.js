// server.js
// Importación de módulos necesarios
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3003;

// Configuración de archivos estáticos para CSS y JS
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Middleware para loguear cada petición
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// Definición de rutas
// Ruta principal: Dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Ruta: Eventos de Mouse
app.get('/mouse', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'pagina-mouse.html'));
});

// Ruta: Eventos de Teclado
app.get('/teclado', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'pagina-teclado.html'));
});

// Ruta: Eventos de Formulario
app.get('/formulario', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'pagina-formulario.html'));
});

// Ruta: Eventos de Ventana
app.get('/ventana', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'pagina-ventana.html'));
});

// Ruta: Eventos de Tiempo
app.get('/tiempo', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'pagina-tiempo.html'));
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).send('<h1>Error 404: Página no encontrada</h1><p>Lo sentimos, la ruta solicitada no existe en este servidor.</p><a href="/">Volver al inicio</a>');
});

// Inicio del servidor con manejo de error EADDRINUSE
const server = app.listen(PORT, () => {
    console.log(`[SERVIDOR] Iniciado con éxito en http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`[ERROR] El puerto ${PORT} ya está en uso. Por favor, libera el puerto o usa uno diferente.`);
        process.exit(1);
    } else {
        console.error(`[ERROR] Ocurrió un error inesperado: ${err.message}`);
        process.exit(1);
    }
});
    