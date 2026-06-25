// servidor del ejercicio 1 - get con fetch y axios
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { usuarios } from './data/usuarios.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// sirvo todos los archivos estáticos del proyecto
app.use(express.static(__dirname));

// endpoint que devuelve los usuarios
app.get('/api/usuarios', (req, res) => {
    res.json(usuarios);
});

// página principal del ejercicio 1
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'ejercicio1.html'));
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`ejercicio 1 corriendo en http://localhost:${PORT}`);
});
