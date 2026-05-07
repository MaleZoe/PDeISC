import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    console.log(` Servidor iniciado exitosamente en puerto ${PORT}.`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(` ERROR: Puerto ${PORT} en uso.`);
        process.exit(1);
    }
});
