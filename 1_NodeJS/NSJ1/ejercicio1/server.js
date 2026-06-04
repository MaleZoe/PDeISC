// importamos el express para el servidor
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001; // cada uno con su puerto

// aca mostramos lo que pide el estanga por consola
console.log("Hola mundo desde Node.js");
console.log("Fin");

// para servir los archivos estaticos
app.use(express.static(path.join(__dirname, 'pages')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/Context', express.static(path.join(__dirname, 'Context')));

// la ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// prendemos el server
app.listen(port, () => {
    console.log(`servidor corriendo en http://localhost:${port}`);
});
