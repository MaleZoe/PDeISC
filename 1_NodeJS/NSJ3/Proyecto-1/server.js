// Este es el servidor de la aplicación usando Express.
// Básicamente se encarga de que cuando entremos a la web, nos muestre el index.html
// y que el navegador pueda encontrar las carpetas de estilos y scripts.

const express = require('express');
const path = require('path');
const app = express();
const puerto = 3001; // El puerto donde va a correr la web (localhost:3001)

// Esto sirve para ver en la consola qué páginas se van cargando
app.use((req, res, next) => {
  console.log(`[Petición] ${req.method} ${req.url}`);
  next();
});

// Le decimos a Express dónde están los archivos que no cambian (estáticos)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Cuando alguien entra a la raíz "/", le mandamos el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Arrancamos el servidor
const servidor = app.listen(puerto, () => {
  console.log(`Proyecto 1 corriendo en http://localhost:${puerto}`);
});

// Manejo de errores a nivel de servidor, específicamente si el puerto está en uso
servidor.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ El puerto ${puerto} ya está en uso. Cerrando proceso...`);
  } else {
    console.error(`❌ Error del servidor: ${err.message}`);
  }
  process.exit(1);
});
