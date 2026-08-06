/**
 * ============================================================================
 * GESTOR DE TEMA Y SCROLL (/scripts/themeManager.js)
 * ============================================================================
 * Explicación didáctica:
 * Controla dos de los requisitos obligatorios de experiencia de usuario (UX):
 * 1. Modo claro/oscuro con persistencia en el navegador (`localStorage`) aplicando
 *    el atributo estándar `data-bs-theme` de Bootstrap 5.
 * 2. Botón "Volver arriba" con ícono Lucide que aparece dinámicamente al hacer
 *    scroll sobre la página.
 */

export function inicializarTemaYScroll() {
  // 1. GESTIÓN DEL MODO OSCURO / CLARO
  const htmlElement = document.documentElement;
  const btnToggleTema = document.getElementById('btn-toggle-theme');
  const CLAVE_LOCAL_STORAGE = 'ahorcado_tema_preferido';

  // Obtener tema previo guardado o usar 'dark' por defecto (apariencia profesional pizarrón digital)
  const temaGuardado = localStorage.getItem(CLAVE_LOCAL_STORAGE) || 'dark';
  aplicarTema(temaGuardado);

  if (btnToggleTema) {
    btnToggleTema.addEventListener('click', () => {
      const temaActual = htmlElement.getAttribute('data-bs-theme') || 'dark';
      const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';
      aplicarTema(nuevoTema);
    });
  }

  function aplicarTema(tema) {
    htmlElement.setAttribute('data-bs-theme', tema);
    localStorage.setItem(CLAVE_LOCAL_STORAGE, tema);

    if (btnToggleTema) {
      const esDark = tema === 'dark';
      btnToggleTema.innerHTML = esDark 
        ? `<i data-lucide="sun" class="icon-theme text-warning" title="Cambiar a Modo Claro"></i>`
        : `<i data-lucide="moon" class="icon-theme text-info" title="Cambiar a Modo Oscuro"></i>`;
      
      btnToggleTema.className = esDark 
        ? 'btn btn-outline-warning d-flex align-items-center justify-content-center rounded-pill px-3 py-2 shadow-sm'
        : 'btn btn-outline-info d-flex align-items-center justify-content-center rounded-pill px-3 py-2 shadow-sm';
      
      // Re-crear íconos Lucide inmediatamente y con un ligero retardo por seguridad
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
        setTimeout(() => window.lucide.createIcons(), 20);
      }
    }
  }

  // 2. GESTIÓN DEL BOTÓN "VOLVER ARRIBA" CON ICONO LUCIDE
  const btnVolverArriba = document.getElementById('btn-back-to-top');

  if (btnVolverArriba) {
    window.addEventListener('scroll', () => {
      // Mostrar el botón si el usuario ha hecho scroll más de 250px hacia abajo
      if (window.scrollY > 250) {
        btnVolverArriba.classList.remove('d-none');
        btnVolverArriba.classList.add('fade-in');
      } else {
        btnVolverArriba.classList.add('d-none');
        btnVolverArriba.classList.remove('fade-in');
      }
    });

    btnVolverArriba.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Auto-inicializar al cargar el DOM si el archivo se importa como módulo principal
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', inicializarTemaYScroll);
}

export default inicializarTemaYScroll;
