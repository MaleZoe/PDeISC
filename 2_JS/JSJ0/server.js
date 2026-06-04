// aca importo express para armar el servidor
import express from 'express';
// estos son para manejar rutas de archivos sin quilombo
import path from 'path';
import { fileURLToPath } from 'url';

// esto es para que funcione el __dirname usando modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3000;

// middleware para que el servidor entienda json
app.use(express.json());

// sirvo las carpetas estaticas como corresponde
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));
app.use('/Context', express.static(path.join(__dirname, 'Context')));

// ruta principal que te escupe el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// levanto el servidor en el puerto 3000
const servidor = app.listen(PUERTO, () => {
    console.log(`servidor corriendo de una en http://localhost:${PUERTO}`);
});

// por si el puerto ya esta ocupado y no compile
servidor.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`error: el puerto ${PUERTO} ya esta re contra usado, cerra lo que tengas abierto`);
        process.exit(1);
    } else {
        console.error(`rompio algo del servidor:`, err);
        process.exit(1);
    }
});
