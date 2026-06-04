// aca traigo express para levantar el server del ejercicio
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// esto es para que funcione __dirname con imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3006;

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


    // endpoint para slice numeros
    app.post('/api/slice/numeros', (req, res) => {
        const original = [5, 10, 15, 20, 25];
        const copia = original.slice(0, 3);
        res.json({ ok: true, resultado: copia });
    });

    // endpoint para slice peliculas
    app.post('/api/slice/peliculas', (req, res) => {
        const original = ['Star Wars', 'Titanic', 'Matrix', 'Avatar', 'Gladiator', 'Inception'];
        const copia = original.slice(2, 5); // del 2 al 4 inclusive (el end es excluyente)
        res.json({ ok: true, resultado: copia });
    });

    // endpoint para slice ultimos 3
    app.post('/api/slice/ultimos', (req, res) => {
        const original = ['manzana', 'banana', 'naranja', 'pera', 'uva', 'sandía'];
        const copia = original.slice(-3);
        res.json({ ok: true, resultado: copia });
    });
        

// levanto el server del ejercicio
const serverInstancia = app.listen(PUERTO, () => {
    console.log(`>>> tp de slice levantado en http://localhost:${PUERTO}`);
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
