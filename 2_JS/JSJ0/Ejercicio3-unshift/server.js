// aca traigo express para levantar el server del ejercicio
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// esto es para que funcione __dirname con imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3103;

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


    // endpoint para unshift colores
    app.post('/api/unshift/color', (req, res) => {
        const { color, colores } = req.body;
        const coloresPermitidos = ["Rojo", "Verde", "Azul", "Amarillo", "Violeta", "Naranja"];
        if (!color || !coloresPermitidos.includes(color)) {
            return res.status(400).json({ ok: false, error: 'color no permitido' });
        }
        if (colores.length >= 3) {
            return res.status(400).json({ ok: false, error: 'ya ingresaste los 3 colores limites' });
        }
        const nuevoArray = [...colores];
        nuevoArray.unshift(color); // Uso explicito de unshift
        res.json({ ok: true, resultado: nuevoArray });
    });

    // endpoint para unshift tareas
    app.post('/api/unshift/tarea', (req, res) => {
        const { tarea, tareas } = req.body;
        if (!tarea || tarea.trim() === '') {
            return res.status(400).json({ ok: false, error: 'tarea vacia' });
        }
        const nuevoArray = [...tareas];
        nuevoArray.unshift(tarea); // Uso explicito de unshift
        res.json({ ok: true, resultado: nuevoArray });
    });

    // endpoint para unshift usuarios
    app.post('/api/unshift/usuario', (req, res) => {
        const { usuario, usuarios } = req.body;
        if (!usuario || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(usuario)) {
            return res.status(400).json({ ok: false, error: 'usuario invalido' });
        }
        const nuevoArray = [...usuarios];
        nuevoArray.unshift(usuario); // Uso explicito de unshift
        res.json({ ok: true, resultado: nuevoArray });
    });
        

// levanto el server del ejercicio
const serverInstancia = app.listen(PUERTO, () => {
    console.log(`>>> tp de unshift levantado en http://localhost:${PUERTO}`);
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
