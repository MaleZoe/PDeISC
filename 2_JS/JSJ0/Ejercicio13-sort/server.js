// aca traigo express para levantar el server del ejercicio
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// esto es para que funcione __dirname con imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3113;

// middleware para leer json en peticiones
app.use(express.json());

// sirvo las carpetas estaticas obligatorias
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));
app.use('/Context', express.static(path.join(__dirname, 'Context')));

// logger de visitas informal
app.use((req, res, next) => {
    console.log(`[visita] peticion a ${req.method} ${req.url}`);
    next();
});

// ruta al index html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});


    // endpoint para ordenar numeros con sort
    app.post('/api/sort/numeros', (req, res) => {
        const numeros = [40, 100, 1, 5, 25, 10];
        // comparador numerico obligatoriamente
        const ordenados = [...numeros].sort((a, b) => a - b);
        res.json({ ok: true, resultado: ordenados });
    });

    // endpoint para ordenar palabras
    app.post('/api/sort/palabras', (req, res) => {
        const palabras = ['limon', 'banana', 'manzana', 'cereza'];
        const ordenadas = [...palabras].sort();
        res.json({ ok: true, resultado: ordenadas });
    });

    // endpoint para ordenar personas por edad
    app.post('/api/sort/personas', (req, res) => {
        const personas = [
            { nombre: 'Ariel', edad: 40 },
            { nombre: 'Sonia', edad: 22 },
            { nombre: 'Juana', edad: 31 }
        ];
        const ordenadas = [...personas].sort((a, b) => a.edad - b.edad);
        res.json({ ok: true, resultado: ordenadas });
    });
        

// levanto el server del ejercicio
const serverInstancia = app.listen(PUERTO, () => {
    console.log(`>>> tp de sort levantado en http://localhost:${PUERTO}`);
});

// controlo puerto ocupado
serverInstancia.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`error grave: el puerto ${PUERTO} esta re ocupado, cambialo o mata el proceso`);
        process.exit(1);
    } else {
        console.error(`fallo en el servidor del ejercicio: `, err);
        process.exit(1);
    }
});
