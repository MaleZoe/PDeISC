// aca traigo express para levantar el server del ejercicio
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// esto es para que funcione __dirname con imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3002;

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


    // endpoint para remover ultimo animal usando pop
    app.post('/api/pop/animal', (req, res) => {
        const { animales } = req.body;
        if (!Array.isArray(animales) || animales.length === 0) {
            return res.status(400).json({ ok: false, error: 'la lista ya esta vacia' });
        }
        const nuevoArray = [...animales];
        const eliminado = nuevoArray.pop();
        res.json({ ok: true, resultado: nuevoArray, eliminado });
    });

    // endpoint para comprar ultimo producto
    app.post('/api/pop/producto', (req, res) => {
        const { productos } = req.body;
        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ ok: false, error: 'no hay mas productos' });
        }
        const nuevoArray = [...productos];
        const eliminado = nuevoArray.pop();
        res.json({ ok: true, resultado: nuevoArray, eliminado });
    });

    // endpoint para vaciar el array con bucle while y pop
    app.post('/api/pop/vaciar', (req, res) => {
        const { items } = req.body;
        let copia = [...items];
        let contador = 0;
        while (copia.length > 0) {
            copia.pop();
            contador++;
        }
        res.json({ ok: true, resultado: copia, cantidad: contador });
    });
        

// levanto el server del ejercicio
const serverInstancia = app.listen(PUERTO, () => {
    console.log(`>>> tp de pop levantado en http://localhost:${PUERTO}`);
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
