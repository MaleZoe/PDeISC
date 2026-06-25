// servidor del ejercicio 3 - búsqueda en tiempo real
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { usuarios } from './data/usuarios.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname));

// devuelvo todos los usuarios para que el front pueda filtrar
app.get('/api/usuarios', (req, res) => {
    res.json(usuarios);
});

// página del ejercicio 3
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'ejercicio3.html'));
});

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`ejercicio 3 corriendo en http://localhost:${PORT}`);
});
