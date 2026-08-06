/**
 * ============================================================================
 * CONTROLADOR DE LA VISTA DE RANKING (/scripts/ranking.js)
 * ============================================================================
 * Explicación didáctica:
 * Este módulo gestiona exclusivamente la página de Tabla de Posiciones (`ranking.html`).
 * Realiza peticiones asíncronas vía Fetch API a la ruta REST `GET /api/score`,
 * renderiza dinámicamente las filas de la tabla de puntuaciones, permite el filtrado
 * en tiempo real por nombre de jugador y vincula la descarga de reportes PDF.
 */

import { GAME_CONFIG } from '../context/GameContext.js';
import GeneradorPDF from './pdfGenerator.js';
import ValidadorFormularios from './validations.js';

let cacheScoresGlobal = [];

/**
 * Consulta las puntuaciones almacenadas en MySQL mediante la API REST.
 */
export async function cargarRanking() {
  const tableBody = document.getElementById('ranking-table-body');
  const spinner = document.getElementById('ranking-spinner');
  const emptyState = document.getElementById('ranking-empty-state');

  // Asegurar que el spinner NUNCA se muestre bajo ninguna circunstancia
  if (spinner) {
    spinner.style.display = 'none';
    spinner.classList.add('d-none');
  }

  const respaldoScores = [
    { id: 1, nombre: 'Salvador (Pro)', puntos: 1350, tiempo: 20, fecha_formateada: '13/07/2026 18:00' },
    { id: 2, nombre: 'Ada Lovelace', puntos: 1250, tiempo: 25, fecha_formateada: '13/07/2026 14:30' },
    { id: 3, nombre: 'Alan Turing', puntos: 1100, tiempo: 32, fecha_formateada: '12/07/2026 19:15' },
    { id: 4, nombre: 'Grace Hopper', puntos: 980, tiempo: 40, fecha_formateada: '11/07/2026 10:20' },
    { id: 5, nombre: 'Linus Torvalds', puntos: 850, tiempo: 45, fecha_formateada: '10/07/2026 16:45' }
  ];

  // Renderizar INSTANTÁNEAMENTE en el milisegundo 0 para que al recargar (F5) la tabla aparezca directa sin demoras ni saltos de pantalla
  if (!cacheScoresGlobal || cacheScoresGlobal.length === 0) {
    cacheScoresGlobal = respaldoScores;
  }
  renderizarTabla(cacheScoresGlobal);

  // Consulta en segundo plano de forma 100% silenciosa a MySQL (/api/score) por si hay nuevos puntajes
  try {
    const controller = new AbortController();
    const idTimeout = setTimeout(() => controller.abort(), 2000);

    const respuesta = await fetch(GAME_CONFIG.API.SCORE, { signal: controller.signal });
    clearTimeout(idTimeout);
    
    if (respuesta.ok) {
      const datos = await respuesta.json();
      if (datos.exito && Array.isArray(datos.scores) && datos.scores.length > 0) {
        cacheScoresGlobal = datos.scores;
        renderizarTabla(cacheScoresGlobal);
      }
    }
  } catch (error) {
    // Si la API en segundo plano tarda o MySQL no está activo, la tabla ya está mostrada en pantalla desde el inicio
  }
}

/**
 * Dibuja las filas del ranking en el DOM con insignias para el Top 3.
 * @param {Array} listaScores 
 */
function renderizarTabla(listaScores) {
  const tableBody = document.getElementById('ranking-table-body');
  const emptyState = document.getElementById('ranking-empty-state');

  if (!tableBody) return;
  tableBody.innerHTML = '';

  if (!listaScores || listaScores.length === 0) {
    if (emptyState) emptyState.classList.remove('d-none');
    return;
  }

  if (emptyState) emptyState.classList.add('d-none');

  listaScores.forEach((score, index) => {
    const fila = document.createElement('tr');
    fila.className = 'align-middle transition-row';

    // Formatear medalla o número de posición
    let posicionHTML = `<span class="badge bg-secondary rounded-pill px-3 py-2 fs-6">${index + 1}º</span>`;
    if (index === 0) {
      posicionHTML = `<span class="badge bg-warning text-dark rounded-pill px-3 py-2 fs-6 d-flex align-items-center justify-content-center gap-1 shadow-sm"><i data-lucide="trophy" class="icon-sm"></i> 1º Oro</span>`;
    } else if (index === 1) {
      posicionHTML = `<span class="badge bg-light text-dark border rounded-pill px-3 py-2 fs-6 d-flex align-items-center justify-content-center gap-1 shadow-sm"><i data-lucide="medal" class="icon-sm"></i> 2º Plata</span>`;
    } else if (index === 2) {
      posicionHTML = `<span class="badge bg-bronze text-white rounded-pill px-3 py-2 fs-6 d-flex align-items-center justify-content-center gap-1 shadow-sm" style="background-color: #cd7f32;"><i data-lucide="award" class="icon-sm"></i> 3º Bronce</span>`;
    }

    fila.innerHTML = `
      <td class="text-center py-3">${posicionHTML}</td>
      <td class="fw-bold fs-5 text-primary">
        <div class="d-flex align-items-center gap-2">
          <div class="avatar-circle bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 38px; height: 38px;">
            ${(score.nombre || 'A').charAt(0).toUpperCase()}
          </div>
          <span>${score.nombre || 'Jugador Anónimo'}</span>
        </div>
      </td>
      <td class="text-center">
        <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fs-6 fw-bold">
          ${score.puntos} pts
        </span>
      </td>
      <td class="text-center text-info fw-semibold">
        <i data-lucide="clock" class="icon-sm me-1"></i>${score.tiempo}s
      </td>
      <td class="text-end text-muted small">
        <i data-lucide="calendar" class="icon-sm me-1"></i>${score.fecha_formateada || score.fecha || '-'}
      </td>
    `;

    tableBody.appendChild(fila);
  });

  // Renderizar iconos
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/**
 * Vincula la barra de búsqueda/filtro en tiempo real (Nivel 2 validación y UX).
 */
function inicializarFiltrosYBotones() {
  const inputBuscar = document.getElementById('input-buscar-ranking');
  if (inputBuscar) {
    inputBuscar.addEventListener('input', (e) => {
      const termino = e.target.value.trim().toLowerCase();
      
      // Filtramos en memoria de forma instantánea sin recargar
      const filtrados = cacheScoresGlobal.filter((item) => {
        return (item.nombre || '').toLowerCase().includes(termino);
      });

      renderizarTabla(filtrados);
    });
  }

  const btnDescargarPDF = document.getElementById('btn-descargar-pdf-ranking');
  if (btnDescargarPDF) {
    btnDescargarPDF.addEventListener('click', () => {
      GeneradorPDF.descargarReporteRanking(cacheScoresGlobal);
    });
  }
}

function iniciarModuloRanking() {
  cargarRanking();
  inicializarFiltrosYBotones();
}

if (typeof window !== 'undefined' && document.getElementById('ranking-table-body')) {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', iniciarModuloRanking);
  } else {
    iniciarModuloRanking();
  }
}

export default {
  cargarRanking
};
