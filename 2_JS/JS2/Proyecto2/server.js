// server del proyecto 2 - filtrado de numeros
import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import os from 'os';
import { fileURLToPath } from 'url';

// importo la logica del filtro
import { Filtro } from './modules/filtro.js';

// esto es para que el __dirname no llore con los imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3001;

// configuro multer para guardar en la raiz (back directamente)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname);
  },
  filename: (req, file, cb) => {
    cb(null, `upload_${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });

app.use(express.json());

// Middleware para loguear peticiones (al principio para que atrape todo)
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// sirvo las carpetas segun el protocolo
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));

// Ruta a los archivos del Proyecto 1 (hermano)
const rutaP1 = path.join(__dirname, '..', 'Proyecto1');

// funcion escanear carpeta p1
app.get('/archivos-p1', (req, res) => {
  try {
    if (!fs.existsSync(rutaP1)) {
        return res.json({ ok: true, archivos: [] });
    }
    const archivos = fs.readdirSync(rutaP1)
      .filter(f => f.startsWith('numeros_') && f.endsWith('.txt'))
      .sort((a, b) => b.localeCompare(a)); // Mas nuevos primero
    
    res.json({ ok: true, archivos });
  } catch (err) {
    res.status(500).json({ ok: false, error: "error al leer archivos de P1" });
  }
});

// NUEVO: funcion escanear carpeta p2 (local)
app.get('/archivos-locales', (req, res) => {
  try {
    const archivos = fs.readdirSync(__dirname)
      .filter(f => f.startsWith('resultado_') && f.endsWith('.txt'))
      .sort((a, b) => b.localeCompare(a)); // Mas nuevos primero
    
    res.json({ ok: true, archivos });
  } catch (err) {
    res.status(500).json({ ok: false, error: "error al leer archivos locales" });
  }
});

// endpoint para procesar un archivo especifico de P1
app.post('/procesar-p1', (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ ok: false, error: "falta el nombre" });

  const rutaArchivo = path.join(rutaP1, nombre);
  if (!fs.existsSync(rutaArchivo)) {
    return res.status(404).json({ ok: false, error: "el archivo ya no esta en P1" });
  }
// lectura archivo 
  fs.readFile(rutaArchivo, 'utf-8', (err, contenido) => {
    if (err) return res.status(500).json({ ok: false, error: "error al leer de P1" });

    const lineas = contenido.split(/\r?\n/).filter(line => line.trim() !== "");
    const numeros = lineas.map(Number).filter(n => !isNaN(n));
    const { utiles, descartados, factoriales } = Filtro.filtrar(numeros);
//logica de filtrado
    res.json({
      ok: true,
      archivoOrigen: nombre,
      totalLeidos: numeros.length,
      totalUtiles: utiles.length,
      totalDescartados: descartados.length,
      numerosUtiles: utiles,
      numerosDescartados: descartados,
      numerosFactoriales: factoriales
    });
  });
});

// NUEVO: endpoint para procesar un archivo local ya existente
app.post('/procesar-local', (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ ok: false, error: "falta el nombre" });
  
    const rutaArchivo = path.join(__dirname, nombre);
    if (!fs.existsSync(rutaArchivo)) {
      return res.status(404).json({ ok: false, error: "el archivo ya no existe" });
    }
  
    fs.readFile(rutaArchivo, 'utf-8', (err, contenido) => {
      if (err) return res.status(500).json({ ok: false, error: "error al leer el archivo" });
  
      const lineas = contenido.split(/\r?\n/).filter(line => line.trim() !== "");
      const numeros = lineas.map(Number).filter(n => !isNaN(n));
      const { utiles, descartados, factoriales } = Filtro.filtrar(numeros);
  
      res.json({
        ok: true,
        archivoOrigen: nombre,
        totalLeidos: numeros.length,
        totalUtiles: utiles.length,
        totalDescartados: descartados.length,
        numerosUtiles: utiles,
        numerosDescartados: descartados,
        numerosFactoriales: factoriales
      });
    });
  });

// ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// endpoint para subir y procesar el archivo (LA POSTA)
app.post('/procesar', upload.single('archivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: "no mandaste ni un archivo, pibe" });
  }

  const rutaArchivo = req.file.path;
  console.log(">>> Intentando leer archivo en:", rutaArchivo);

  if (!fs.existsSync(rutaArchivo)) {
      console.error(">>> ERROR: El archivo no existe en el disco!");
      return res.status(500).json({ ok: false, error: "Archivo no encontrado en el servidor" });
  }

  // leo el archivo de verdad usando fs.readFile
  fs.readFile(rutaArchivo, 'utf-8', (err, contenido) => {
    if (err) {
      console.error("error al leer:", err);
      return res.status(500).json({ ok: false, error: "no pude leer el archivo" });
    }

    // separo lineas y limpio
    const lineas = contenido.split(/\r?\n/).filter(line => line.trim() !== "");
    const numeros = lineas.map(l => l.trim()).map(Number).filter(n => !isNaN(n));

    // uso el modulo de filtro como corresponde
    const { utiles, descartados, factoriales } = Filtro.filtrar(numeros);

    // devuelvo todo el bardo al frente
    res.json({
      ok: true,
      archivoOrigen: req.file.originalname,
      totalLeidos: numeros.length,
      totalUtiles: utiles.length,
      totalDescartados: descartados.length,
      numerosUtiles: utiles,
      numerosDescartados: descartados,
      numerosFactoriales: factoriales
    });
  });
});

// endpoint para guardar el resultado final
app.post('/guardar-resultado', (req, res) => {
  const { numerosUtiles, stats } = req.body;

  if (!numerosUtiles || !Array.isArray(numerosUtiles)) {
    return res.status(400).json({ ok: false, error: "falta la data" });
  }

  const hoy = new Date();
  const fecha = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear().toString().slice(-2)}`;
  
  let contenido = `=== REPORTE DE FILTRADO (ESTANGA) ===\n`;
  contenido += `Fecha: ${fecha}\n`;
  contenido += `Archivo Origen: ${stats.archivoOrigen}\n`;
  contenido += `Total Leidos: ${stats.totalLeidos}\n`;
  contenido += `Utiles: ${stats.totalUtiles} (${stats.porcentajeUtiles}%)\n`;
  contenido += `------------------------------------\n`;
  contenido += numerosUtiles.join('\n');

  const nombreArchivo = `resultado_${Date.now()}.txt`;
  const rutaProyecto = path.join(__dirname, nombreArchivo);

  // 1. guardo en la raiz del proyecto (backend)
  fs.writeFile(rutaProyecto, contenido, 'utf-8', (err) => {
    if (err) return res.status(500).json({ ok: false, error: "no se pudo guardar en el proyecto" });
    
    // 2. LA POSTA: guardo tambien en Downloads de Windows
    const rutaDownloads = path.join(os.homedir(), 'Downloads', nombreArchivo);
    fs.writeFile(rutaDownloads, contenido, 'utf-8', (errDescarga) => {
      if (errDescarga) {
        console.warn("error guardando en Downloads:", errDescarga.message);
      }
      res.json({ ok: true, archivo: nombreArchivo, rutaLocal: rutaDownloads });
    });
  });
});

// prendo el server
const servidor = app.listen(PUERTO, () => {
  console.log(`>>> server del filtro andando en http://localhost:${PUERTO}`);
});

// Middleware para loguear peticiones
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Manejador de errores global para devolver JSON siempre (AL FINAL)
app.use((err, req, res, next) => {
    console.error(">>> ERROR DETECTADO:", err);
    res.status(500).json({
        ok: false,
        error: err.message || "Error interno del servidor"
    });
});
