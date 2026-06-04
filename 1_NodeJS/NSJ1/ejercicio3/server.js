// ej 3 con funciones
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3003;

// definimos las funciones aca nomas para el log
const sumar = (a, b) => a + b;
const restar = (a, b) => a - b;
const multiplicar = (a, b) => a * b;
const dividir = (a, b) => a / b;

console.log("Resultados Ejercicio 3 (con funciones):");
console.log(`Suma (4+5): ${sumar(4, 5)}`);
console.log(`Resta (3-6): ${restar(3, 6)}`);
console.log(`Multiplicación (2*7): ${multiplicar(2, 7)}`);
console.log(`División (20/4): ${dividir(20, 4)}`);

app.use(express.json());

// ruta para validar en el backend, no confies en el front jamas
app.post('/validar', (req, res) => {
    const { n1, n2 } = req.body;
    if (isNaN(n1) || isNaN(n2)) {
        return res.status(400).json({ error: "mandaste fruta, pone numeros" });
    }
    res.json({ mensaje: "todo piola" });
});

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
