// Modulo de la pagina de inicio.
// Resume los ejercicios del proyecto y muestra el clima integrado en la home.

import { getClimaActual } from '../ejercicio1/clima.js';

const ITEMS = [
  { href: '/calculo',  ejercicio: 'Ejercicio 1', icono: 'calculator-fill',  titulo: 'Modulos propios',     texto: 'Calculo y clima renderizados desde modulos propios.',      color: 'verde' },
  { href: '/archivos', ejercicio: 'Ejercicio 2', icono: 'folder-fill',      titulo: 'HTTP + File System',  texto: 'HTML generado en disco y servido por el mismo server.js.', color: 'rojo' },
  { href: '/url',      ejercicio: 'Ejercicio 3', icono: 'link-45deg',       titulo: 'Modulo URL',          texto: 'Host, pathname, parametros y salida por consola.',         color: 'amarillo' },
  { href: '/npm',      ejercicio: 'Ejercicio 4', icono: 'box-fill',         titulo: 'Paquete NPM',         texto: 'upper-case aplicado en una grilla de ejemplos.',           color: 'violeta' },
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
          <span class="link-ir">Ir al ejercicio <i class="bi bi-arrow-right ms-1"></i></span>
        </div>
      </a>
    </div>
  `).join('');

  return `
    <div class="hero-inicio mb-5">
      <span class="tag-chip mb-3">Proyecto NodeJS</span>
      <h1 class="hero-titulo">Modulos<br><em>en accion</em></h1>
      <p class="hero-sub">Nativos, del sistema de archivos, de URL y de NPM — todo en un solo proyecto.</p>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-12">
        <div class="bloque-clima">
          <div class="bloque-clima__header">
            <div>
              <span class="tag-chip tag-chip--blanco">Ejercicio 1 en home</span>
              <h2 class="bloque-titulo mt-2 text-white">Clima — ${clima.ciudad}</h2>
              <p class="bloque-clima__cond">${clima.condicion}, ${clima.pais}</p>
            </div>
            <i class="bi bi-cloud-sun bloque-clima__icon"></i>
          </div>
          <div class="bloque-clima__temp">${clima.temperaturaC}<sup>°C</sup></div>
          <div class="dato-lista mt-3">
            <div class="dato-fila"><span>Modulo</span><strong>Modules/ejercicio1/clima.js</strong></div>
            <div class="dato-fila"><span>Actualizado</span><strong>${clima.actualizado}</strong></div>
          </div>
        </div>
      </div>
    </div>

    <div class="bloque-panel mb-4">
      <span class="tag-chip mb-3">Ejercicio 5 — Sitio web</span>
      <h2 class="bloque-titulo mb-4">Las 5 paginas del proyecto</h2>
      <div class="row g-4">
        ${cards}
      </div>
    </div>
  `;
}
