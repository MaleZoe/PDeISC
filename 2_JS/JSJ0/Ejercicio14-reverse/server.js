// aca traigo express para levantar el server del ejercicio
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// esto es para que funcione __dirname con imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3014;

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


    // endpoint para revertir letras con reverse
    app.post('/api/reverse/letras', (req, res) => {
        const letras = ['A', 'B', 'C', 'D'];
        const copia = [...letras].reverse();
        res.json({ ok: true, resultado: copia });
    });

    // endpoint para revertir numeros
    app.post('/api/reverse/numeros', (req, res) => {
        const numeros = [1, 2, 3, 4, 5];
        const copia = [...numeros].reverse();
        res.json({ ok: true, resultado: copia });
    });

    // endpoint para revertir texto (string -> array -> reverse -> join)
    app.post('/api/reverse/texto', (req, res) => {
        const { texto } = req.body;
        if (!texto || typeof texto !== 'string') {
            return res.status(400).json({ ok: false, error: 'texto invalido' });
        }
        // paso a array, rebierto y vuelvo a unir
        const arr = texto.split('');
        const rev = arr.reverse();
        const resultado = rev.join('');
        res.json({ ok: true, resultado });
    });
        

// levanto el server del ejercicio
const serverInstancia = app.listen(PUERTO, () => {
    console.log(`>>> tp de reverse levantado en http://localhost:${PUERTO}`);
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
