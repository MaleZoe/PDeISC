// ej 4 con modulos
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { sumar, restar, multiplicar, dividir } from './modules/calculos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3004;

console.log("Resultados Ejercicio 4 (usando modulos):");
console.log(`Suma (5+3): ${sumar(5, 3)}`);
console.log(`Resta (8-6): ${restar(8, 6)}`);
console.log(`Multiplicación (3*11): ${multiplicar(3, 11)}`);
console.log(`División (30/5): ${dividir(30, 5)}`);

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
