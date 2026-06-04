// aca traigo express para levantar el server del ejercicio
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// esto es para que funcione __dirname con imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3011;

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


    // endpoint para filtrar mayores a 10
    app.post('/api/filter/mayores10', (req, res) => {
        const numeros = [3, 11, 8, 20, 5, 14];
        const filtrados = numeros.filter(num => num > 10);
        res.json({ ok: true, resultado: filtrados });
    });

    // endpoint para filtrar palabras de mas de 5 letras
    app.post('/api/filter/palabras', (req, res) => {
        const lista = ['termo', 'mate', 'carpincho', 'milanesa', 'sol', 'javascript'];
        const filtrados = lista.filter(pal => pal.length > 5);
        res.json({ ok: true, resultado: filtrados });
    });

    // endpoint para filtrar usuarios activos
    app.post('/api/filter/activos', (req, res) => {
        const usuarios = [
            { nombre: 'Ana', activo: true },
            { nombre: 'Mati', activo: false },
            { nombre: 'Santi', activo: true }
        ];
        const filtrados = usuarios.filter(u => u.activo);
        res.json({ ok: true, resultado: filtrados });
    });
        

// levanto el server del ejercicio
const serverInstancia = app.listen(PUERTO, () => {
    console.log(`>>> tp de filter levantado en http://localhost:${PUERTO}`);
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
