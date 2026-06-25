// aca traigo express para levantar el server del ejercicio
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// esto es para que funcione __dirname con imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3101;

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


    // endpoint para agregar frutas con push
    app.post('/api/push/fruta', (req, res) => {
        const { fruta, frutas } = req.body;
        const frutasPermitidas = ["Manzana", "Banana", "Naranja", "Pera", "Uva", "Frutilla"];
        
        if (!fruta || !frutasPermitidas.includes(fruta)) {
            return res.status(400).json({ ok: false, error: 'fruta no permitida' });
        }
        if (frutas.length >= 3) {
            return res.status(400).json({ ok: false, error: 'ya agregaste las 3 frutas maximo' });
        }
        
        const nuevoItem = {
            id: Date.now().toString(),
            valor: fruta
        };

        const nuevoArray = [...frutas];
        nuevoArray.push(nuevoItem); // Uso explicito de push
        res.json({ ok: true, resultado: nuevoArray });
    });

// endpoint para agregar amigos con push (abm)
app.post('/api/push/amigo', (req, res) => {
    const { amigo, amigos, editIndex } = req.body;
    if (!amigo || typeof amigo !== 'string' || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/.test(amigo)) {
        return res.status(400).json({ ok: false, error: 'nombre del amigo invalido' });
    }

    let nuevoArray = [...amigos];
    if (editIndex !== undefined && editIndex !== null && editIndex !== '') {
        const idx = parseInt(editIndex);
        if (idx >= 0 && idx < nuevoArray.length) {
            nuevoArray[idx] = { ...nuevoArray[idx], valor: amigo };
        }
    } else {
        nuevoArray.push({ // Uso explicito de push
            id: Date.now().toString(),
            valor: amigo
        });
    }
    res.json({ ok: true, resultado: nuevoArray });
});

    // endpoint para validar numero mayor
    app.post('/api/push/numero', (req, res) => {
        const { numero, numeros } = req.body;
        const numVal = Number(numero);
        if (isNaN(numVal)) {
            return res.status(400).json({ ok: false, error: 'no se permiten letras' });
        }
        const ultimo = numeros.length > 0 ? numeros[numeros.length - 1] : -Infinity;
        if (numVal <= ultimo) {
            return res.status(400).json({ ok: false, error: 'el numero debe ser mayor al ultimo (' + ultimo + ')' });
        }
        const nuevoArray = [...numeros];
        nuevoArray.push(numVal); // Uso explicito de push
        res.json({ ok: true, resultado: nuevoArray });
    });
        

// levanto el server del ejercicio
const serverInstancia = app.listen(PUERTO, () => {
    console.log(`>>> tp de push levantado en http://localhost:${PUERTO}`);
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
