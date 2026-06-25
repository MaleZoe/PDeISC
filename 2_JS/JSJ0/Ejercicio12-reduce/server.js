// aca traigo express para levantar el server del ejercicio
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// esto es para que funcione __dirname con imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3112;

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


    // endpoint para sumar numeros con reduce
    app.post('/api/reduce/sumar', (req, res) => {
        const numeros = [1, 2, 3, 4, 5];
        const suma = numeros.reduce((acc, curr) => acc + curr, 0);
        res.json({ ok: true, resultado: suma });
    });

    // endpoint para multiplicar con reduce
    app.post('/api/reduce/multiplicar', (req, res) => {
        const numeros = [1, 2, 3, 4];
        const prod = numeros.reduce((acc, curr) => acc * curr, 1);
        res.json({ ok: true, resultado: prod });
    });

    // endpoint para totalizar carrito
    app.post('/api/reduce/total', (req, res) => {
        const carrito = [
            { precio: 150 },
            { precio: 300 },
            { precio: 50 }
        ];
        const total = carrito.reduce((acc, curr) => acc + curr.precio, 0);
        res.json({ ok: true, resultado: total });
    });
        

// levanto el server del ejercicio
const serverInstancia = app.listen(PUERTO, () => {
    console.log(`>>> tp de reduce levantado en http://localhost:${PUERTO}`);
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
