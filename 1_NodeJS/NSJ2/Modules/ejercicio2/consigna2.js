// Modulo del ejercicio 2.
// Genera la vista HTML que se guarda en /Pages/ejercicio2/galeria.html
// y tambien el contenido de la pagina principal del ejercicio.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escribirArchivo } from './archivos.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RUTA_GALERIA = path.join(__dirname, '..', '..', 'Pages', 'ejercicio2', 'galeria.html');

export function renderGaleriaHTML() {
  // HTML real que se escribe en disco para demostrar File System + HTTP.
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vista generada - NodeJS</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="/Styles/vista.css">
</head>
<body>
  <main class="container py-5">
    <div class="galeria-card">
      <div class="row g-4 align-items-center">
        <div class="col-12 col-lg-7">
          <span class="galeria-badge">Ejercicio 2 · HTTP + File System</span>
          <h1 class="galeria-titulo mt-3">Archivo <em>generado</em> por Node.js</h1>
          <p class="galeria-texto">
            Este HTML fue creado por <code>Modules/ejercicio2/consigna2.js</code> usando <code>node:fs</code>
            y entregado al navegador por <code>server.js</code> con <code>node:http</code>.
          </p>
        </div>
        <div class="col-12 col-lg-5">
          <div class="galeria-stack">
            <div class="galeria-item"><span>Generado por</span><strong>Modules/ejercicio2/consigna2.js</strong></div>
            <div class="galeria-item"><span>Guardado en</span><strong>Pages/ejercicio2/galeria.html</strong></div>
            <div class="galeria-item"><span>Servido por</span><strong>server.js con node:http</strong></div>
          </div>
        </div>
      </div>
      <a class="btn btn-outline-light btn-lg mt-4" href="http://127.0.0.1:3000/archivos">
        ← Volver al sitio
      </a>
    </div>
  </main>
</body>
</html>`;
}

export function crearGaleria() {
  escribirArchivo(RUTA_GALERIA, renderGaleriaHTML());
}

export function renderContenidoArchivos() {
  return `
    <div class="page-header mb-5">
      <span class="tag-chip">Ejercicio 2</span>
      <h1 class="page-title mt-2">HTTP + File System</h1>
      <p class="page-sub">
        El modulo genera un archivo HTML real en disco y el mismo servidor principal lo entrega al navegador.
      </p>
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-7">
        <div class="bloque-panel">
          <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
            <div>
              <span class="tag-chip">node:fs</span>
              <h2 class="bloque-titulo mt-2">Archivo generado en disco</h2>
              <p class="bloque-texto">
                <code>crearGaleria()</code> escribe <code>Pages/ejercicio2/galeria.html</code>
                usando el modulo <code>Modules/ejercicio2/archivos.js</code>.
              </p>
            </div>
            <i class="bi bi-file-earmark-code-fill fs-2 text-warning"></i>
          </div>
          <div class="dato-lista mb-4">
            <div class="dato-fila"><span>Modulo</span><strong>Modules/ejercicio2/consigna2.js</strong></div>
            <div class="dato-fila"><span>Salida</span><strong>Pages/ejercicio2/galeria.html</strong></div>
          </div>
          <div class="aviso-strip">El HTML se regenera cada vez que se inicia el servidor.</div>
        </div>
      </div>

      <div class="col-12 col-lg-5">
        <div class="bloque-clima">
          <div class="bloque-clima__header">
            <div>
              <span class="tag-chip tag-chip--blanco">node:http</span>
              <h2 class="bloque-titulo mt-2 text-white">Mismo server.js</h2>
            </div>
            <i class="bi bi-hdd-network-fill bloque-clima__icon"></i>
          </div>
          <p class="bloque-clima__cond">La ruta <code>/vista.html</code> es atendida por el mismo servidor principal sin necesidad de un segundo proceso.</p>
          <div class="dato-lista">
            <div class="dato-fila"><span>Ruta publica</span><strong>/vista.html</strong></div>
            <div class="dato-fila"><span>Modulo</span><strong>node:http</strong></div>
            <div class="dato-fila"><span>Ventaja</span><strong>Un solo servidor</strong></div>
          </div>
          <a class="btn btn-light btn-sm mt-4" href="/vista.html" target="_blank">
            <i class="bi bi-box-arrow-up-right me-1"></i> Abrir HTML generado
          </a>
        </div>
      </div>
    </div>
  `;
}
