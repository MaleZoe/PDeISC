/**
 * context/theme.js
 * ─────────────────────────────────────────────────────────────────
 * Módulo de gestión del tema visual (modo claro / modo oscuro).
 *
 * ARQUITECTURA:
 *   1. Este script se carga como <script inline> dentro del <head>
 *      de cada página (inyectado por layout.js).
 *   2. Lee localStorage para saber el tema guardado.
 *   3. Aplica el atributo data-theme="dark"|"light" en <html>
 *      para que los selectores CSS respondan instantáneamente.
 *   4. El botón #btn-theme del navbar llama a toggleTheme()
 *      que está definida en window para ser accesible desde HTML.
 *
 * CÓMO SE APLICA EL CSS:
 *   estilos.css define variables :root con el tema base (oscuro).
 *   light.css define [data-theme="light"] con variables sobreescritas.
 *   Cambiando data-theme en <html> se activa el tema correspondiente.
 * ─────────────────────────────────────────────────────────────────
 */

(function () {
  // Lee el tema guardado; oscuro por defecto (coincide con el diseño base).
  const saved = localStorage.getItem('njs2-theme') || 'dark';

  /**
   * Aplica el tema al documento:
   *   - Setea data-theme en <html> (los selectores CSS escuchan esto).
   *   - Actualiza el ícono del botón si ya existe en el DOM.
   *   - Persiste la elección en localStorage.
   * @param {string} theme - 'light' o 'dark'
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('njs2-theme', theme);

    // Actualiza el ícono del botón (puede no existir todavía si el DOM no cargó).
    const btn = document.getElementById('btn-theme');
    if (btn) {
      btn.textContent = theme === 'light' ? '☀️' : '🌙';
      btn.setAttribute('title', theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    }
  }

  // Aplica el tema guardado inmediatamente (antes del render → sin flash).
  applyTheme(saved);

  /**
   * Alterna entre modo claro y oscuro.
   * Expuesta en window para que el onclick del botón HTML la pueda llamar.
   */
  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
  };

  // También agrega el listener al botón cuando el DOM termina de cargar.
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('btn-theme');
    if (btn) {
      // Actualiza el ícono al tema actual.
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      btn.textContent = theme === 'light' ? '☀️' : '🌙';
      btn.setAttribute('title', theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');

      // Listener de click para toggle.
      btn.addEventListener('click', window.toggleTheme);
    }
  });
})();
