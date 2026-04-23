// scripts/pagina-mouse.js

// ============================================================
// SECCIÓN 1: CONTROL DEL INSPECTOR
// ============================================================
// Conecta el botón #btnModoInspector con window.Inspector

document.addEventListener('DOMContentLoaded', () => {
    const btnToggle = document.getElementById('btnModoInspector');

    if (btnToggle) {
        btnToggle.addEventListener('click', () => {
            if (window.Inspector.estaActivo()) {
                window.Inspector.desactivar();
                btnToggle.textContent = '🔍 Activar Inspector';
                btnToggle.classList.remove('btn-inspector-activo');
            } else {
                window.Inspector.activar();
                btnToggle.textContent = '✋ Desactivar Inspector';
                btnToggle.classList.add('btn-inspector-activo');
            }
        });
    }

    // ============================================================
    // SECCIÓN 2: DEMOS DE EVENTOS (Lógica de Proyecto 2)
    // ============================================================
    
    const area = document.getElementById('areaDemo');
    const badge = document.getElementById('coordsBadge');
    function registrarEvento(mensaje) {
        console.log(mensaje);
    }

    if (area) {
        area.addEventListener('mousemove', (e) => {
            // Pausar si el inspector está activo
            if (window.Inspector.estaActivo()) return;

            const rect = area.getBoundingClientRect();
            const x = Math.floor(e.clientX - rect.left);
            const y = Math.floor(e.clientY - rect.top);
            badge.textContent = `X: ${x}, Y: ${y}`;
            // Evitamos saturar el log con mousemove, solo actualizamos el badge
        });

        area.addEventListener('mousedown', (e) => {
            if (window.Inspector.estaActivo()) return;
            area.style.backgroundColor = 'var(--color-acento-primario)';
            registrarEvento(`mousedown → botón ${e.button}`);
        });

        area.addEventListener('mouseup', () => {
            if (window.Inspector.estaActivo()) return;
            area.style.backgroundColor = 'var(--color-superficie)';
            registrarEvento(`mouseup → botón liberado`);
        });

        area.addEventListener('mouseenter', () => {
            if (window.Inspector.estaActivo()) return;
            area.style.borderColor = 'var(--color-acento-primario)';
            registrarEvento(`mouseenter → cursor ingresó al área`);
        });

        area.addEventListener('mouseleave', () => {
            if (window.Inspector.estaActivo()) return;
            area.style.borderColor = '';
            badge.textContent = 'Mueve el mouse aquí';
            registrarEvento(`mouseleave → cursor salió del área`);
        });

        area.addEventListener('dblclick', (e) => {
            if (window.Inspector.estaActivo()) return;
            const rect = area.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const punto = document.createElement('div');
            punto.className = 'punto-click';
            punto.style.left = `${x}px`;
            punto.style.top = `${y}px`;
            area.appendChild(punto);
            
            setTimeout(() => { if (area.contains(punto)) area.removeChild(punto); }, 800);
            registrarEvento(`dblclick → punto en (${Math.floor(x)}, ${Math.floor(y)})`);
        });

        area.addEventListener('contextmenu', (e) => {
            if (window.Inspector.estaActivo()) return;
            e.preventDefault(); 
            registrarEvento(`contextmenu → menú personalizado interceptado`);
        });
    }
});
