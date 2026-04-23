// Servidor Express - Maneja rutas y archivos estáticos
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3006;

// Middleware para registrar cada petición
app.use((req, res, next) => {
  console.log(`[MÉTODO] ${req.method} ${req.url}`);
  next();
});

// Servir archivos estáticos
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Manejo de error 404
app.use((req, res) => {
  res.status(404).send(`
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>404 - Página no encontrada</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding: 50px; background: #f8f7f4; color: #1a1a2e; }
          h1 { color: #dc2626; }
        </style>
      </head>
      <body>
        <h1>Error 404</h1>
        <p>La ruta solicitada no existe en este servidor.</p>
        <a href="/">Volver al inicio</a>
      </body>
    </html>
  `);
});

// Iniciar servidor y manejar EADDRINUSE
const server = app.listen(PORT, () => {
  console.log(`PROYECTO 5 - Servidor iniciado en http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[ERROR] El puerto ${PORT} ya está en uso. Por favor, libérelo e intente de nuevo.`);
    process.exit(1);
  } else {
    console.error(`[ERROR] Ocurrió un problema:`, err);
  }
});
