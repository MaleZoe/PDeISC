// modulo que usa FILE SYSTEM
import fs from 'fs';
import path from 'path';

// crea un archivo html real y devuelve el contenido (Ej 2)
export const generarYServirEj2 = (baseDir) => {
  const dirPages = path.join(baseDir, 'pages');
  // por si no existe (que deberia, pero porsia)
  if (!fs.existsSync(dirPages)){
    fs.mkdirSync(dirPages, { recursive: true });
  }

  const rutaArchivo = path.join(dirPages, 'archivo_generado.html');
  
  const html = \`
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>Generado por FS</title>
    <link rel="stylesheet" href="/styles/base.css">
    <link rel="stylesheet" href="/styles/light.css">
  </head>
  <body>
    <div class="container" style="text-align: center; margin-top: 50px;">
      <h1>Archivo creado con FS (Ejercicio 2)</h1>
      <div class="card" style="display: inline-block; text-align: left;">
        <p>Este archivo es un HTML estático creado fisicamente en el disco usando <strong>fs.writeFileSync</strong>.</p>
        <p>Y luego fue leido con <strong>fs.readFileSync</strong> y servido con <strong>http</strong>.</p>
      </div>
      <br><br>
      <a href="/" class="btn btn-primary">Volver al Inicio</a>
    </div>
  </body>
  </html>
  \`;
  
  // lo piso siempre
  fs.writeFileSync(rutaArchivo, html, 'utf8');
  return fs.readFileSync(rutaArchivo, 'utf8');
};
