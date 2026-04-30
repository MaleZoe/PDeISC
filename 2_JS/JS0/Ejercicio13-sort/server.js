const express = require('express');
const path = require('path');

const app = express();
const PORT = 3013;

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado exitosamente.`);
    console.log(`👉 Visita: http://localhost:${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ ERROR CRÍTICO: El puerto ${PORT} ya está en uso.`);
        console.error(`Por favor, detén el otro proceso o cambia el puerto en server.js.`);
        process.exit(1);
    } else {
        console.error(`\n❌ Ocurrió un error al iniciar el servidor: ${err.message}`);
        process.exit(1);
    }
});
