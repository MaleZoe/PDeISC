// Este script sirve para probar cómo reacciona el navegador a los movimientos del mouse.
// Registra cada movimiento, clic o entrada en un área gris para que veamos qué evento se dispara.

document.addEventListener('DOMContentLoaded', () => {
  // Traemos los elementos de la pantalla que vamos a usar
  const area = document.getElementById('areaDemo');
  const badge = document.getElementById('coordsBadge');
  const panelLog = document.getElementById('panelLog');
  const btnLimpiar = document.getElementById('btnLimpiar');

  // Función para escribir en el registro de la derecha qué pasó
  function registrarEvento(mensaje) {
    const entrada = document.createElement('div');
    entrada.className = 'd-flex mb-1 align-items-start';
    const hora = new Date().toLocaleTimeString('es-ES', { hour12: false });
    entrada.innerHTML = `<span class="text-muted me-2 font-mono">>[${hora}]</span> <span>${mensaje}</span>`;
    panelLog.prepend(entrada); // Ponemos el mensaje arriba de todo
  }

  // Borrar el historial cuando toquemos el botón de limpiar
  btnLimpiar.addEventListener('click', () => {
    panelLog.innerHTML = '';
  });

  // Detecta cuando movemos el mouse por encima del cuadro
  area.addEventListener('mousemove', (e) => {
    const rect = area.getBoundingClientRect(); // Calculamos dónde está el cuadro en la pantalla
    const x = Math.floor(e.clientX - rect.left); // Posición X dentro del cuadro
    const y = Math.floor(e.clientY - rect.top);  // Posición Y dentro del cuadro
    badge.textContent = `X: ${x}, Y: ${y}`;
    registrarEvento(`mousemove → X: ${x}, Y: ${y}`);
  });

  // Cuando apretamos el botón del mouse (cualquiera)
  area.addEventListener('mousedown', (e) => {
    area.style.backgroundColor = 'var(--color-primario)'; // Cambiamos el color de fondo
    registrarEvento(`mousedown → botón ${e.button}`);
  });

  // Cuando soltamos el botón del mouse
  area.addEventListener('mouseup', () => {
    area.style.backgroundColor = 'var(--color-superficie)'; // Volvemos al color original
    registrarEvento(`mouseup → botón liberado`);
  });

  // Cuando el cursor entra al área del cuadro
  area.addEventListener('mouseenter', () => {
    area.style.transform = 'scale(1.02)'; // Se agranda un poquito
    area.style.borderColor = 'var(--color-secundario)';
    registrarEvento(`mouseenter → cursor ingresó al área`);
  });

  // Cuando el cursor sale del área del cuadro
  area.addEventListener('mouseleave', () => {
    area.style.transform = 'scale(1)'; // Vuelve a su tamaño normal
    area.style.borderColor = '';
    badge.textContent = 'Mueve el mouse aquí';
    registrarEvento(`mouseleave → cursor salió del área`);
  });

  // Doble clic: crea un puntito rojo donde hicimos el clic
  area.addEventListener('dblclick', (e) => {
    const rect = area.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const punto = document.createElement('div');
    punto.className = 'punto-click';
    punto.style.left = `${x}px`;
    punto.style.top = `${y}px`;
    area.appendChild(punto);
    
    // Lo borramos después de un ratito para no llenar la pantalla de puntos
    setTimeout(() => { if (area.contains(punto)) area.removeChild(punto); }, 800);
    registrarEvento(`dblclick → punto en (${Math.floor(x)}, ${Math.floor(y)})`);
  });

  // Intercepta el clic derecho para que no aparezca el menú normal del navegador
  area.addEventListener('contextmenu', (e) => {
    e.preventDefault(); 
    registrarEvento(`contextmenu → menú personalizado interceptado`);
  });
});
