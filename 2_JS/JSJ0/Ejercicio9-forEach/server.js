// aca traigo express para levantar el server del ejercicio
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// esto es para que funcione __dirname con imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3009;

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


    // endpoint para saludar nombres con foreach
    app.post('/api/foreach/saludar', (req, res) => {
        const nombres = ['Ana', 'Beto', 'Cecilia'];
        const saludos = [];
        nombres.forEach(n => {
            saludos.push('¡Hola ' + n + ', cómo va la vida!');
        });
        res.json({ ok: true, resultado: saludos });
    });

    // endpoint para doblar numeros con foreach
    app.post('/api/foreach/dobles', (req, res) => {
        const numeros = [2, 4, 8, 16];
        const dobles = [];
        numeros.forEach(num => {
            dobles.push(num * 2);
        });
        res.json({ ok: true, resultado: dobles });
    });

    // endpoint para personas y edades
    app.post('/api/foreach/personas', (req, res) => {
        const personas = [
            { nombre: 'Gaby', edad: 20 },
            { nombre: 'Lucas', edad: 35 }
        ];
        const listado = [];
        personas.forEach(p => {
            listado.push(p.nombre + ' tiene ' + p.edad + ' años');
        });
        res.json({ ok: true, resultado: listado });
    });
        

// levanto el server del ejercicio
const serverInstancia = app.listen(PUERTO, () => {
    console.log(`>>> tp de forEach levantado en http://localhost:${PUERTO}`);
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
