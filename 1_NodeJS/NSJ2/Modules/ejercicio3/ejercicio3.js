// Renderiza el contenido HTML del ejercicio 3 usando el analisis del modulo URL.

import { analizarURL, URL_EJEMPLO } from './url.js';

export function renderContenidoEjercicio3() {
  const datos = analizarURL();

  const filas = [
    ['href', datos.href],
    ['protocol', datos.protocol],
    ['host', datos.host],
    ['hostname', datos.hostname],
    ['port', datos.port],
    ['pathname', datos.pathname],
    ['search', datos.search],
    ['hash', datos.hash],
    ['origin', datos.origin],
  ].map(([k, v]) => `
    <tr>
      <td><code>${k}</code></td>
      <td class="text-break">${v}</td>
    </tr>
  `).join('');

  const paramRows = Object.entries(datos.params)
    .filter(([k]) => k !== 'searchState')
    .map(([k, v]) => `
      <tr>
        <td><code class="text-warning">param: ${k}</code></td>
        <td class="text-break">${v}</td>
      </tr>
    `)
    .join('');

  return `
    <div class="page-header mb-5">
      <span class="tag-chip">Ejercicio 3</span>
      <h1 class="page-title mt-2">Modulo <em>URL</em></h1>
      <p class="page-sub">
        El modulo analiza la URL con <code>new URL()</code> y muestra todos sus componentes en pagina y en consola.
      </p>
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-8">
        <div class="bloque-panel">
          <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
            <div>
              <span class="tag-chip">url.js</span>
              <h2 class="bloque-titulo mt-2">Desglose completo</h2>
            </div>
          </div>
          <div class="url-pill mb-4">${URL_EJEMPLO}</div>
          <div class="table-responsive">
            <table class="table tabla-ui align-middle mb-0">
              <tbody>
                ${filas}
                ${paramRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="op-card op-card--azul h-100">
          <div class="op-card__top mb-3">
            <span class="op-label">Consola</span>
            <i class="bi bi-terminal-fill op-icon"></i>
          </div>
          <h2 class="bloque-titulo mb-3">Salida de terminal</h2>
          <p class="bloque-texto mb-4">Al arrancar el servidor, <code>analizarURL()</code> imprime host, pathname, protocolo y parametros via <code>console.log()</code>.</p>
          <div class="dato-lista">
            <div class="dato-fila"><span>API usada</span><strong>new URL()</strong></div>
            <div class="dato-fila"><span>Salida</span><strong>console.log()</strong></div>
            <div class="dato-fila"><span>Modulo</span><strong>Modules/ejercicio3/url.js</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;
}
