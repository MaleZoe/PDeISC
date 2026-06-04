// importamos lo necesario
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3002;

// calculos que pide el estanga por consola
console.log("Resultados Ejercicio 2:");
console.log(`Suma (4+5): ${4+5}`);
console.log(`Resta (3-6): ${3-6}`);
console.log(`Multiplicación (2*7): ${2*7}`);
console.log(`División (20/4): ${20/4}`);

app.use(express.static(path.join(__dirname, 'pages')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));
app.use('/Context', express.static(path.join(__dirname, 'Context')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.listen(port, () => {
    console.log(`servidor corriendo en http://localhost:${port}`);
});
