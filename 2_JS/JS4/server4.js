// servidor del ejercicio 4 - api propia de alumnos
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routerAlumnos from './modules/alumnos.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname));

// api de alumnos del ejercicio 4
app.use('/api/alumnos', routerAlumnos);

// página del ejercicio 4
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'ejercicio4.html'));
});

const PORT = 3004;
app.listen(PORT, () => {
    console.log(`ejercicio 4 corriendo en http://localhost:${PORT}`);
});
