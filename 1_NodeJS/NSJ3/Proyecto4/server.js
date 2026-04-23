
// Importación de módulos
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3004;

// archivos estáticos
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Registro de peticiones en consola
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url} → ${res.statusCode}`);
    next();
});

// Rutas principales
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/acerca', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'acerca.html'));
});


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`[SERVIDOR] Proyecto 4 corriendo en http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`[ERROR] El puerto ${PORT} ya está ocupado.`);
        process.exit(1);
    }
});
