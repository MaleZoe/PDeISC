// aca traigo express para levantar el server del ejercicio
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// esto es para que funcione __dirname con imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3110;

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


    // endpoint para map por 3
    app.post('/api/map/triplicar', (req, res) => {
        const numeros = [1, 3, 5, 7];
        const resultado = numeros.map(n => n * 3);
        res.json({ ok: true, resultado });
    });

    // endpoint para map nombres en mayusculas
    app.post('/api/map/mayusculas', (req, res) => {
        const nombres = ['tito', 'cacho', 'pepe'];
        const resultado = nombres.map(n => n.toUpperCase());
        res.json({ ok: true, resultado });
    });

    // endpoint para agregar precio con 21% de IVA
    app.post('/api/map/iva', (req, res) => {
        const precios = [100, 200, 500, 1000];
        const preciosConIva = precios.map(p => (p * 1.21).toFixed(2));
        res.json({ ok: true, resultado: preciosConIva });
    });
        

// levanto el server del ejercicio
const serverInstancia = app.listen(PUERTO, () => {
    console.log(`>>> tp de map levantado en http://localhost:${PUERTO}`);
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
