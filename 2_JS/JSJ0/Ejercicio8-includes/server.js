// aca traigo express para levantar el server del ejercicio
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// esto es para que funcione __dirname con imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3008;

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


    // endpoint para verificar admin
    app.post('/api/includes/admin', (req, res) => {
        const roles = ['user', 'editor', 'moderator'];
        const contiene = roles.includes('admin');
        res.json({ ok: true, resultado: contiene });
    });

    // endpoint para buscar color verde
    app.post('/api/includes/verde', (req, res) => {
        const colores = ['azul', 'amarillo', 'verde', 'rojo'];
        const contiene = colores.includes('verde');
        res.json({ ok: true, resultado: contiene });
    });

    // endpoint para agregar numero si no existe
    app.post('/api/includes/numero', (req, res) => {
        const { numero, numeros } = req.body;
        const numVal = Number(numero);
        if (isNaN(numVal)) {
            return res.status(400).json({ ok: false, error: 'escribe un numero real' });
        }
        if (numeros.includes(numVal)) {
            return res.status(400).json({ ok: false, error: 'el numero ya existe en el array, gil' });
        }
        const nuevoArray = [...numeros, numVal];
        res.json({ ok: true, resultado: nuevoArray });
    });
        

// levanto el server del ejercicio
const serverInstancia = app.listen(PUERTO, () => {
    console.log(`>>> tp de includes levantado en http://localhost:${PUERTO}`);
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
