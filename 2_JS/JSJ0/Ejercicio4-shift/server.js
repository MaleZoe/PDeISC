// aca traigo express para levantar el server del ejercicio
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// esto es para que funcione __dirname con imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3104;

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


    // endpoint para shift numeros
    app.post('/api/shift/numero', (req, res) => {
        const { numeros } = req.body;
        if (!Array.isArray(numeros) || numeros.length === 0) {
            return res.status(400).json({ ok: false, error: 'la lista de numeros esta vacia' });
        }
        const nuevoArray = [...numeros];
        nuevoArray.shift();
        res.json({ ok: true, resultado: nuevoArray });
    });

    // endpoint para shift mensajes
    app.post('/api/shift/mensaje', (req, res) => {
        const { mensajes } = req.body;
        if (!Array.isArray(mensajes) || mensajes.length === 0) {
            return res.status(400).json({ ok: false, error: 'no hay mensajes' });
        }
        const nuevoArray = [...mensajes];
        nuevoArray.shift();
        res.json({ ok: true, resultado: nuevoArray });
    });

    // endpoint para atender siguiente cliente
    app.post('/api/shift/cliente', (req, res) => {
        const { clientes } = req.body;
        if (!Array.isArray(clientes) || clientes.length === 0) {
            return res.status(400).json({ ok: false, error: 'no hay clientes esperando' });
        }
        const nuevoArray = [...clientes];
        nuevoArray.shift();
        res.json({ ok: true, resultado: nuevoArray });
    });
        

// levanto el server del ejercicio
const serverInstancia = app.listen(PUERTO, () => {
    console.log(`>>> tp de shift levantado en http://localhost:${PUERTO}`);
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
