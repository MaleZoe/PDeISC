// importo las dependencias necesarias
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routerAlumnos from './modules/alumnos.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// para parsear json en las requests
app.use(express.json());

// sirvo los archivos estáticos desde la raíz
app.use(express.static(__dirname));

// rutas de las páginas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/ejercicio1', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'ejercicio1.html'));
});

app.get('/ejercicio2', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'ejercicio2.html'));
});

app.get('/ejercicio3', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'ejercicio3.html'));
});

app.get('/ejercicio4', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'ejercicio4.html'));
});

// api propia para el ejercicio 4
app.use('/api/alumnos', routerAlumnos);

// arranco el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`);
});
