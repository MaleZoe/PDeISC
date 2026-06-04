// aca traigo express para levantar el server del ejercicio
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// esto es para que funcione __dirname con imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3005;

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


    // endpoint para splice remover letras
    app.post('/api/splice/eliminar', (req, res) => {
        const { letras } = req.body;
        if (!Array.isArray(letras) || letras.length < 2) {
            return res.status(400).json({ ok: false, error: 'no hay suficientes letras para hacer splice' });
        }
        const copia = [...letras];
        copia.splice(1, 2);
        res.json({ ok: true, resultado: copia });
    });

    // endpoint para insertar sin borrar
    app.post('/api/splice/insertar', (req, res) => {
        const { nombre, nombres } = req.body;
        if (!nombre || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
            return res.status(400).json({ ok: false, error: 'nombre invalido' });
        }
        const copia = [...nombres];
        copia.splice(1, 0, nombre);
        res.json({ ok: true, resultado: copia });
    });

    // endpoint para reemplazar
    app.post('/api/splice/reemplazar', (req, res) => {
        const { indice, valores, lista } = req.body;
        const idx = parseInt(indice);
        if (isNaN(idx) || idx < 0 || idx > lista.length - 2) {
            return res.status(400).json({ ok: false, error: 'indice fuera de rango para reemplazar 2 elementos' });
        }
        const partes = valores.split(',').map(v => v.trim());
        if (partes.length < 2 || !partes[0] || !partes[1]) {
            return res.status(400).json({ ok: false, error: 'pone al menos 2 valores no vacios separados por coma' });
        }
        const copia = [...lista];
        copia.splice(idx, 2, partes[0], partes[1]);
        res.json({ ok: true, resultado: copia });
    });
        

// levanto el server del ejercicio
const serverInstancia = app.listen(PUERTO, () => {
    console.log(`>>> tp de splice levantado en http://localhost:${PUERTO}`);
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
