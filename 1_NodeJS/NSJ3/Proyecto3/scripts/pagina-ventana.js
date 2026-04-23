// scripts/pagina-ventana.js

// ============================================================
// SECCIÓN 1: CONTROL DEL INSPECTOR
// ============================================================

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
    
    const spanWidth = document.getElementById('windowWidth');
    const spanHeight = document.getElementById('windowHeight');
    const spanScrollY = document.getElementById('scrollY');
    const panelLog = document.getElementById('panelLog');
    const btnLimpiar = document.getElementById('btnLimpiar');

    function registrarEvento(mensaje) {
        const entrada = document.createElement('div');
        entrada.style.marginBottom = '4px';
        const hora = new Date().toLocaleTimeString('es-ES', { hour12: false });
        entrada.innerHTML = `<span style="color: #64748b; margin-right: 8px;">[${hora}]</span> <span>${mensaje}</span>`;
        panelLog.prepend(entrada);
    }

    function actualizarDimensiones() {
        spanWidth.textContent = window.innerWidth;
        spanHeight.textContent = window.innerHeight;
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            panelLog.innerHTML = '';
        });
    }

    // Inicializar valores
    actualizarDimensiones();
    spanScrollY.textContent = Math.floor(window.scrollY);

    window.addEventListener('resize', () => {
        if (window.Inspector.estaActivo()) return;
        actualizarDimensiones();
        // Usamos un pequeño delay o simplemente registramos el cambio final
        console.log(`Resize: ${window.innerWidth}x${window.innerHeight}`);
    });

    window.addEventListener('scroll', () => {
        if (window.Inspector.estaActivo()) return;
        const actualScroll = Math.floor(window.scrollY);
        spanScrollY.textContent = actualScroll;
        
        // Solo registramos en el log si el cambio es significativo para no saturar
        if (actualScroll % 50 === 0) {
            registrarEvento(`scroll → Posición vertical: ${actualScroll}px`);
        }
    });

    window.addEventListener('load', () => {
        registrarEvento(`load → Página completamente cargada`);
    });
});
