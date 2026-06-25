// aca traigo express para levantar el server del ejercicio
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// esto es para que funcione __dirname con imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3107;

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


    // endpoint para encontrar el perro
    app.post('/api/indexof/perro', (req, res) => {
        const animales = ['gato', 'perro', 'loro', 'elefante'];
        const posicion = animales.indexOf('perro');
        res.json({ ok: true, resultado: posicion });
    });

    // endpoint para encontrar 50
    app.post('/api/indexof/50', (req, res) => {
        const numeros = [10, 25, 50, 75, 100];
        const posicion = numeros.indexOf(50);
        res.json({ ok: true, resultado: posicion });
    });

    // endpoint para encontrar Madrid
    app.post('/api/indexof/madrid', (req, res) => {
        const ciudades = ['Buenos Aires', 'Paris', 'Roma'];
        const posicion = ciudades.indexOf('Madrid');
        if (posicion === -1) {
            return res.json({ ok: true, resultado: -1, mensaje: 'Madrid no esta en la lista, che' });
        }
        res.json({ ok: true, resultado: posicion });
    });
        

// levanto el server del ejercicio
const serverInstancia = app.listen(PUERTO, () => {
    console.log(`>>> tp de indexOf levantado en http://localhost:${PUERTO}`);
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
