// aca traigo el express para el server
import express from 'express';
// estos son para los archivos y las rutas
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

// esto es para que el __dirname funcione con los imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3002;

// aca configuro para que lea json
app.use(express.json());

// sirvo todas las carpetas como dice el protocolo
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));
app.use('/Context', express.static(path.join(__dirname, 'Context')));

// esto es para ver que llega
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// la ruta de entrada a la pagina
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// aca guardo los numeros en un txt
app.post('/exportar', (req, res) => {
    const { numeros } = req.body;

    // valido que me manden algo que sirva
    if (!numeros || !Array.isArray(numeros) || numeros.length === 0) {
        return res.status(400).json({ ok: false, error: "la lista esta vacia, no seas boludo" });
    }

    try {
        // armo el texto del archivo: solo los numeros, uno por linea
        const contenido = numeros.join('\n');
        const nombreArchivo = `numeros_${Date.now()}.txt`;

        // 1. guardo el archivo en la raiz del proyecto (backend)
        const rutaProyecto = path.join(__dirname, nombreArchivo);
        fs.writeFileSync(rutaProyecto, contenido, 'utf8');

        // 2. LA POSTA: guardo tambien en la carpeta de Descargas del sistema (Windows)
        const carpetaDownloads = path.join(os.homedir(), 'Downloads');
        const rutaDownloads = path.join(carpetaDownloads, nombreArchivo);
        
        try {
            fs.writeFileSync(rutaDownloads, contenido, 'utf8');
        } catch (err) {
            console.warn(">>> Advertencia: No pude guardar en Downloads directamente:", err.message);
        }

        res.json({ 
            ok: true, 
            archivo: nombreArchivo, 
            total: numeros.length,
            rutaLocal: rutaDownloads
        });

    } catch (error) {
        console.error(">>> ERROR CRITICO AL EXPORTAR:", error);
        res.status(500).json({ ok: false, error: error.message || "error interno del servidor" });
    }
});

// prendo el server
const servidor = app.listen(PUERTO, () => {
    console.log(`>>> el server esta andando en http://localhost:${PUERTO}`);
});

// por si el puerto esta ocupado
servidor.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`[ERROR] el puerto ${PUERTO} ya lo estas usando en otro lado`);
        process.exit(1);
    } else {
        console.error("error critico:", error);
        process.exit(1);
    }
});
