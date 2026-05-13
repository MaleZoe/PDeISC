// acá usamos un paquete de npm para no escribir todo a mano
// upper-case sirve para pasar a mayúsculas, nada del otro mundo

import { upperCase } from 'upper-case';

const EJEMPLOS = [
  'node.js es genial',
  'modulos nativos de node',
  'upper-case instalado con npm',
  'http · fs · url · path',
  'proyecto nodejs practico',
];

export function renderContenidoNPM() {
  const transformados = EJEMPLOS.map((texto) => ({
    original: texto,
    transformado: upperCase(texto),
  }));

  console.log('\n[npm] gritando con upper-case:');
  transformados.forEach(({ original, transformado }) => {
    console.log(`  "${original}" -> "${transformado}"`);
  });

  const cards = transformados.map(({ original, transformado }, index) => `
    <div class="col-12 col-md-6 col-xl-4">
      <div class="op-card op-card--violeta h-100">
        <div class="op-card__top mb-3">
          <span class="op-label">ejemplo ${index + 1}</span>
          <i class="bi bi-type op-icon"></i>
        </div>
        <p class="bloque-texto mb-3">${original}</p>
        <div class="op-resultado op-resultado--sm">${transformado}</div>
      </div>
    </div>
  `).join('');

  return `
    <div class="page-header mb-5">
      <span class="tag-chip">ejercicio 4</span>
      <h1 class="page-title mt-2">paquete <em>npm</em></h1>
      <p class="page-sub">
        <code>upper-case</code> lo bajamos con <code>npm install</code> y hace esto.
      </p>
    </div>

    <div class="bloque-panel mb-4">
      <div class="row g-4 align-items-center">
        <div class="col-12 col-lg-7">
          <span class="tag-chip">instalación</span>
          <h2 class="bloque-titulo mt-2">un paquete, varias transformaciones</h2>
          <p class="bloque-texto mb-0">el paquete convierte cualquier cosa a mayúsculas con la función <code>upperCase()</code>.</p>
        </div>
        <div class="col-12 col-lg-5">
          <div class="dato-lista">
            <div class="dato-fila"><span>paquete</span><strong>upper-case</strong></div>
            <div class="dato-fila"><span>comando</span><strong>npm i upper-case</strong></div>
            <div class="dato-fila"><span>función</span><strong>upperCase()</strong></div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      ${cards}
    </div>
  `;
}
