import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3002;

app.use((req, res, next) => {
    const hora = new Date().toLocaleTimeString('es-AR', { hour12: false });
    console.log(`[${req.method}] ${req.url} — ${hora}`);
    next();
});

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error("❌ Error: El puerto 3000 ya está en uso. Cerrando el proceso...");
        process.exit(1);
    }
});

const servidor = app.listen(PUERTO, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PUERTO}`);
});

servidor.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error("❌ Error: El puerto 3000 ya está en uso. Cerrando el proceso...");
        process.exit(1);
    }
});

