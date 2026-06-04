/**
 * Módulo: app.js
 * Responsabilidad: Lógica del hub index.html y ranking.
 */

/**
 * Cierra el menú hamburguesa al hacer clic en un enlace.
 */
function cerrarNavbarAlClick() {
  document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      const collapse = document.querySelector('.navbar-collapse');
      if (collapse?.classList.contains('show')) {
        const inst = bootstrap.Collapse.getInstance(collapse);
        inst?.hide();
      }
    });
  });
}


/**
 * Carga y muestra el ranking en el modal.
 * @param {string} juego - 'snake' | 'pacman'
 */
async function cargarRanking(juego) {
  const tbody = document.getElementById('tablaRankingBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6">Cargando...</td></tr>';

  try {
    const res = await fetch(`/api/ranking?juego=${juego}`);
    const datos = await res.json();
    tbody.innerHTML = '';

    if (datos.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6">Sin registros aún</td></tr>';
      return;
    }

    datos.forEach((r, i) => {
      const tr = document.createElement('tr');
      if (i === 0) tr.classList.add('oro');
      else if (i === 1) tr.classList.add('plata');
      else if (i === 2) tr.classList.add('bronce');
      tr.style.animationDelay = `${i * 0.08}s`;
      tr.classList.add('fila-ranking');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${r.nombre}</td>
        <td>${r.puntaje}</td>
        <td>${r.nivel}</td>
        <td>${r.modo}</td>
        <td>${r.fecha} ${r.hora}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    tbody.innerHTML =
      '<tr><td colspan="6">Error al cargar ranking</td></tr>';
    console.error('Error ranking:', e.message);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  cerrarNavbarAlClick();

  let juegoActivo = 'snake';
  document.getElementById('tabSnake')?.addEventListener('click', () => {
    juegoActivo = 'snake';
    cargarRanking('snake');
  });
  document.getElementById('tabPacman')?.addEventListener('click', () => {
    juegoActivo = 'pacman';
    cargarRanking('pacman');
  });

  document.getElementById('btnVerRanking')?.addEventListener('click', () => {
    cargarRanking(juegoActivo);
  });

  const modalRanking = document.getElementById('modalRanking');
  if (modalRanking) {
    modalRanking.addEventListener('show.bs.modal', () => {
      cargarRanking(juegoActivo);
    });
  }
});
