// acá armo la home del sitio, mezclando todo un poco
// muestro el clima para que veas que los módulos se pueden reusar

import { getClimaActual } from '../ejercicio1/clima.js';

const FECHA = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });

const ITEMS = [
  { href: '/calculo',  ejercicio: 'ejercicio 1', icono: 'calculator-fill',  titulo: 'módulos propios',     texto: 'cálculos y clima renderizados desde módulos propios.',      color: 'verde' },
  { href: '/archivos', ejercicio: 'ejercicio 2', icono: 'folder-fill',      titulo: 'http + file system',  texto: 'html generado en disco y servido por el mismo server.js.', color: 'rojo' },
  { href: '/url',      ejercicio: 'ejercicio 3', icono: 'link-45deg',       titulo: 'módulo url',          texto: 'host, pathname, parámetros y salida por consola.',         color: 'amarillo' },
  { href: '/npm',      ejercicio: 'ejercicio 4', icono: 'box-fill',         titulo: 'paquete npm',         texto: 'upper-case aplicado en una grilla de ejemplos.',           color: 'violeta' },
];

export function renderContenidoInicio() {
  const clima = getClimaActual('Mar del Plata');

  const cards = ITEMS.map((item) => `
    <div class="col-12 col-md-6">
      <a class="card card-ejercicio text-decoration-none h-100" href="${item.href}">
        <div class="card-body p-4">
          <div class="d-flex align-items-start justify-content-between gap-3 mb-3">
            <span class="tag-chip tag-chip--${item.color}">${item.ejercicio}</span>
            <i class="bi bi-${item.icono} fs-4" style="opacity:.6"></i>
          </div>
          <h3 class="card-titulo mb-2">${item.titulo}</h3>
          <p class="bloque-texto mb-3">${item.texto}</p>
          <span class="link-ir">ir al ejercicio <i class="bi bi-arrow-right ms-1"></i></span>
        </div>
      </a>
    </div>
  `).join('');

  return `
    <div class="hero-inicio mb-5">
      <span class="tag-chip mb-3">proyecto nodejs - ${FECHA}</span>
      <h1 class="hero-titulo">módulos<br><em>en acción</em></h1>
      <p class="hero-sub">nativos, del sistema de archivos, de url y de npm — todo acá nomás.</p>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-12">
        <div class="bloque-clima">
          <div class="bloque-clima__header">
            <div>
              <span class="tag-chip tag-chip--blanco">ejercicio 1 en home</span>
              <h2 class="bloque-titulo mt-2 text-white">clima — ${clima.ciudad}</h2>
              <p class="bloque-clima__cond">${clima.condicion}, ${clima.pais}</p>
            </div>
            <i class="bi bi-cloud-sun bloque-clima__icon"></i>
          </div>
          <div class="bloque-clima__temp">${clima.temperaturaC}<sup>°C</sup></div>
          <div class="dato-lista mt-3">
            <div class="dato-fila"><span>módulo</span><strong>Modules/ejercicio1/clima.js</strong></div>
            <div class="dato-fila"><span>actualizado</span><strong>${FECHA}</strong></div>
          </div>
        </div>
      </div>
    </div>

    <div class="bloque-panel mb-4">
      <span class="tag-chip mb-3">ejercicio 5 — sitio web</span>
      <h2 class="bloque-titulo mb-4">las 5 páginas del proyecto</h2>
      <div class="row g-4">
        ${cards}
      </div>
    </div>
  `;
}
