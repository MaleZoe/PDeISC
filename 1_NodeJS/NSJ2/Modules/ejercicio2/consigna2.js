// acá manejo lo del ejercicio 2, generar archivos y servirlos
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escribirArchivo } from './archivos.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RUTA_GALERIA = path.join(__dirname, '..', '..', 'Pages', 'ejercicio2', 'galeria.html');
const FECHA = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });

export function renderGaleriaHTML() {
  // este es el html que mando al disco, bien básico pero funcional
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vista generada - ${FECHA}</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="/Styles/vista.css">
</head>
<body>
  <main class="container py-5">
    <div class="galeria-card">
      <div class="row g-4 align-items-center">
        <div class="col-12 col-lg-7">
          <span class="galeria-badge">ejercicio 2 · http + fs · ${FECHA}</span>
          <h1 class="galeria-titulo mt-3">archivo <em>generado</em> por node.js</h1>
          <p class="galeria-texto">
            este html lo inventé en <code>Modules/ejercicio2/consigna2.js</code> usando <code>node:fs</code>
            y te lo estoy mostrando gracias a <code>node:http</code>.
          </p>
        </div>
        <div class="col-12 col-lg-5">
          <div class="galeria-stack">
            <div class="galeria-item"><span>generado</span><strong>${FECHA}</strong></div>
            <div class="galeria-item"><span>módulo</span><strong>node:fs</strong></div>
          </div>
        </div>
      </div>
      <a class="btn btn-outline-light btn-lg mt-4" href="http://127.0.0.1:3000/archivos">
        ← volver al sitio
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
      <span class="tag-chip">ejercicio 2 - ${FECHA}</span>
      <h1 class="page-title mt-2">http + file system</h1>
      <p class="page-sub">
        acá generamos un archivo de verdad y lo servimos como si nada.
      </p>
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-7">
        <div class="bloque-panel">
          <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
            <div>
              <span class="tag-chip">node:fs</span>
              <h2 class="bloque-titulo mt-2">archivo en el disco</h2>
              <p class="bloque-texto">
                usamos <code>crearGaleria()</code> para mandar el html a <code>Pages/ejercicio2/galeria.html</code>.
              </p>
            </div>
            <i class="bi bi-file-earmark-code-fill fs-2 text-warning"></i>
          </div>
          <div class="dato-lista mb-4">
            <div class="dato-fila"><span>módulo</span><strong>Modules/ejercicio2/archivos.js</strong></div>
            <div class="dato-fila"><span>fecha</span><strong>${FECHA}</strong></div>
          </div>
          <div class="aviso-strip">cada vez que levantas el server se pisa el archivo.</div>
        </div>
      </div>

      <div class="col-12 col-lg-5">
        <div class="bloque-clima">
          <div class="bloque-clima__header">
            <div>
              <span class="tag-chip tag-chip--blanco">node:http</span>
              <h2 class="bloque-titulo mt-2 text-white">todo en el mismo server</h2>
            </div>
            <i class="bi bi-hdd-network-fill bloque-clima__icon"></i>
          </div>
          <p class="bloque-clima__cond">la ruta <code>/vista.html</code> la maneja el servidor principal, nada de cosas raras.</p>
          <div class="dato-lista">
            <div class="dato-fila"><span>ruta</span><strong>/vista.html</strong></div>
            <div class="dato-fila"><span>módulo</span><strong>node:http</strong></div>
          </div>
          <a class="btn btn-light btn-sm mt-4" href="/vista.html" target="_blank">
            <i class="bi bi-box-arrow-up-right me-1"></i> abrir html generado
          </a>
        </div>
      </div>
    </div>
  `;
}
