const express = require('express');
const path = require('path');

// Inicialización de la aplicación Express
const app = express();
const PORT = 3001;

// Middleware para servir archivos estáticos (CSS y JS)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Middleware para registrar en consola cada petición entrante
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// Ruta principal que sirve el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Inicialización del servidor con manejo elegante del error EADDRINUSE
const server = app.listen(PORT, () => {
    console.log(` Servidor iniciado exitosamente.`);
    console.log(` Visita: http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n ERROR CRÍTICO: El puerto ${PORT} ya está en uso.`);
        console.error(`Por favor, detén el otro proceso o cambia el puerto en server.js.`);
        process.exit(1);
    } else {
        console.error(`\n Ocurrió un error al iniciar el servidor: ${err.message}`);
        process.exit(1);
    }
});
