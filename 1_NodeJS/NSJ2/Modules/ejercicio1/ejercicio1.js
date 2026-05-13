// armo el html del primer ejercicio con los calculos y el clima
import { sumar, restar, multiplicar, dividir, potencia } from './calculadora.js';
import { getClimaActual } from './clima.js';

export function renderContenidoEjercicio1() {
  const a = 12;
  const b = 4;
  const clima = getClimaActual('Mar del Plata');
  // acá saco la fecha en el formato que pedí, no es fisica nuclear
  const fechaHoy = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });

  const operaciones = [
    { label: 'Suma',           expr: `${a} + ${b}`,  resultado: sumar(a, b),         icono: 'plus-lg',         color: 'verde' },
    { label: 'Resta',          expr: `${a} - ${b}`,  resultado: restar(a, b),        icono: 'dash-lg',         color: 'rojo' },
    { label: 'Multiplicacion', expr: `${a} × ${b}`,  resultado: multiplicar(a, b),   icono: 'x-lg',            color: 'amarillo' },
    { label: 'Division',       expr: `${a} ÷ ${b}`,  resultado: dividir(a, b),       icono: 'slash-lg',        color: 'azul' },
    { label: 'Potencia',       expr: `${a} ^ ${b}`,  resultado: potencia(a, b),      icono: 'lightning-fill',  color: 'violeta' },
  ];

  return `
    <div class="page-header mb-5">
      <span class="tag-chip">ejercicio 1 - ${fechaHoy}</span>
      <h1 class="page-title mt-2">módulos <em>propios</em></h1>
      <p class="page-sub">
        usamos archivos separados para no tener un espagueti de código.
      </p>
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-5">
        <div class="bloque-clima">
          <div class="bloque-clima__header">
            <div>
              <span class="tag-chip tag-chip--blanco">clima.js</span>
              <h2 class="bloque-titulo mt-2">clima — ${clima.ciudad}</h2>
            </div>
            <i class="bi bi-cloud-sun bloque-clima__icon"></i>
          </div>
          <div class="bloque-clima__temp">${clima.temperaturaC}<sup>°C</sup></div>
          <p class="bloque-clima__cond">${clima.condicion}</p>
          <div class="dato-lista">
            <div class="dato-fila"><span>módulo</span><strong>Modules/ejercicio1/clima.js</strong></div>
            <div class="dato-fila"><span>ciudad</span><strong>${clima.ciudad}, ${clima.pais}</strong></div>
            <div class="dato-fila"><span>fecha</span><strong>${fechaHoy}</strong></div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-7">
        <div class="bloque-panel">
          <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
            <div>
              <span class="tag-chip">calculadora.js</span>
              <h2 class="bloque-titulo mt-2">operaciones matemáticas</h2>
            </div>
            <span class="valor-chip">base: ${a} y ${b}</span>
          </div>
          <div class="row g-3">
            ${operaciones.map(op => `
              <div class="col-12 col-sm-6">
                <div class="op-card op-card--${op.color}">
                  <div class="op-card__top">
                    <span class="op-label">${op.label}</span>
                    <i class="bi bi-${op.icono} op-icon"></i>
                  </div>
                  <div class="op-resultado">${op.resultado}</div>
                  <div class="op-expr">${op.expr}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
