// Modulo del ejercicio 4.
// Usa el paquete upper-case instalado con NPM y arma el contenido de la pagina.

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

  console.log('\n[NPM] upper-case en accion:');
  transformados.forEach(({ original, transformado }) => {
    console.log(`  "${original}" -> "${transformado}"`);
  });

  const cards = transformados.map(({ original, transformado }, index) => `
    <div class="col-12 col-md-6 col-xl-4">
      <div class="op-card op-card--violeta h-100">
        <div class="op-card__top mb-3">
          <span class="op-label">Ejemplo ${index + 1}</span>
          <i class="bi bi-type op-icon"></i>
        </div>
        <p class="bloque-texto mb-3">${original}</p>
        <div class="op-resultado op-resultado--sm">${transformado}</div>
      </div>
    </div>
  `).join('');

  return `
    <div class="page-header mb-5">
      <span class="tag-chip">Ejercicio 4</span>
      <h1 class="page-title mt-2">Paquete <em>NPM</em></h1>
      <p class="page-sub">
        <code>upper-case</code> fue instalado con <code>npm install upper-case</code> y transforma textos a mayusculas.
      </p>
    </div>

    <div class="bloque-panel mb-4">
      <div class="row g-4 align-items-center">
        <div class="col-12 col-lg-7">
          <span class="tag-chip">Instalacion</span>
          <h2 class="bloque-titulo mt-2">Un paquete, multiples transformaciones</h2>
          <p class="bloque-texto mb-0">El paquete convierte cualquier texto a mayusculas con <code>upperCase(texto)</code>. Fue gestionado con el gestor de paquetes NPM.</p>
        </div>
        <div class="col-12 col-lg-5">
          <div class="dato-lista">
            <div class="dato-fila"><span>Paquete</span><strong>upper-case</strong></div>
            <div class="dato-fila"><span>Comando</span><strong>npm install upper-case</strong></div>
            <div class="dato-fila"><span>Funcion</span><strong>upperCase(texto)</strong></div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      ${cards}
    </div>
  `;
}
