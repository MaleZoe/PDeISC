// servidor para el proyecto 1 - dom básico
// acá usamos express para levantar el boliche y servir los archivos

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// acá le digo que use la carpeta public para todo lo estático
app.use(express.static(path.join(__dirname, 'public')));

// ruta principal para mandar el index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

// prendemos el servidor
app.listen(port, () => {
    console.log(`servidor de estanga laburando en http://localhost:${port}`);
});
