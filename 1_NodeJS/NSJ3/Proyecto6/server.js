const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para registrar cada solicitud en la consola
app.use((req, res, next) => {
  console.log(`[MÉTODO] ${req.method} ${req.url}`);
  next();
});

// Servir archivos estáticos (CSS y JS)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Ruta principal que sirve el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Manejo de cualquier otra ruta (Error 404)
app.use((req, res) => {
  res.status(404).send(`
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>404 - Página no encontrada</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding-top: 50px; background-color: #faf9f7; color: #2d2926; }
          h1 { color: #c0392b; font-size: 3rem; }
          a { color: #c17f4a; text-decoration: none; font-weight: bold; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>Error 404</h1>
        <p>Lo sentimos, la página que buscás no existe.</p>
        <p><a href="/">Volver al inicio</a></p>
      </body>
    </html>
  `);
});

// Iniciar el servidor y manejar el error de puerto en uso
const servidor = app.listen(PORT, () => {
  console.log(`Servidor iniciado correctamente. Escuchando en el puerto ${PORT}`);
  console.log(`Accedé a: http://localhost:${PORT}`);
});

servidor.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`[ERROR FATAL] El puerto ${PORT} ya está en uso. Por favor, cerrá la otra aplicación o cambiá el puerto e intentá de nuevo.`);
    process.exit(1);
  } else {
    console.error(`[ERROR] Ocurrió un error inesperado al iniciar el servidor: ${error.message}`);
    process.exit(1);
  }
});
