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
    const areaDemo = document.getElementById('areaDemo');
    let panelLog = document.getElementById('panelLog');

    if (!panelLog && areaDemo) {
        const titulo = document.createElement('h3');
        titulo.textContent = 'Mini Consola de Eventos';
        titulo.style.color = '#cbd5e1';
        titulo.style.fontSize = '0.9rem';
        titulo.style.marginTop = '20px';
        titulo.style.marginBottom = '8px';
        areaDemo.appendChild(titulo);

        panelLog = document.createElement('div');
        panelLog.id = 'panelLog';
        panelLog.style.background = '#0f172a';
        panelLog.style.color = '#38bdf8';
        panelLog.style.padding = '10px';
        panelLog.style.borderRadius = '8px';
        panelLog.style.height = '150px';
        panelLog.style.overflowY = 'auto';
        panelLog.style.fontFamily = 'monospace';
        panelLog.style.fontSize = '0.85rem';
        panelLog.style.border = '1px solid #334155';
        panelLog.style.textAlign = 'left';
        areaDemo.appendChild(panelLog);
    }

    function registrarEvento(mensaje) {
        if (panelLog) {
            const entrada = document.createElement('div');
            entrada.style.marginBottom = '4px';
            const hora = new Date().toLocaleTimeString('es-ES', { hour12: false });
            entrada.innerHTML = `<span style="color: #94a3b8; margin-right: 8px;">[${hora}]</span> <span>${mensaje}</span>`;
            panelLog.prepend(entrada);
        }
        console.log(mensaje);
    }

    function actualizarDimensiones() {
        spanWidth.textContent = window.innerWidth;
        spanHeight.textContent = window.innerHeight;
    }



    // Inicializar valores
    actualizarDimensiones();
    spanScrollY.textContent = Math.floor(window.scrollY);

    const ventanaInfo = document.getElementById('ventanaInfo');
    if (ventanaInfo) {
        ventanaInfo.style.transition = 'all 0.2s ease';
    }

    window.addEventListener('resize', () => {
        if (window.Inspector.estaActivo()) return;
        actualizarDimensiones();
        
        // Efecto visual basado en el ancho de la ventana
        if (ventanaInfo) {
            const hue = window.innerWidth % 360;
            ventanaInfo.style.borderLeft = `8px solid hsl(${hue}, 70%, 50%)`;
            ventanaInfo.style.boxShadow = `0 4px 15px hsl(${hue}, 70%, 80%)`;
        }

        console.log(`Resize: ${window.innerWidth}x${window.innerHeight}`);
    });

    window.addEventListener('scroll', () => {
        if (window.Inspector.estaActivo()) return;
        const actualScroll = Math.floor(window.scrollY);
        spanScrollY.textContent = actualScroll;
        
        // Efecto visual basado en el scroll
        if (ventanaInfo) {
            // Desplazar el panel ligeramente según el scroll
            const translateY = Math.min(actualScroll / 2, 50); // máx 50px de desplazamiento
            ventanaInfo.style.transform = `translateY(${translateY}px)`;
        }

        if (actualScroll % 50 === 0) {
            registrarEvento(`scroll → Posición vertical: ${actualScroll}px`);
        }
    });

    window.addEventListener('load', () => {
        registrarEvento(`load → Página completamente cargada`);
    });
});
