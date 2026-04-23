// scripts/pagina-teclado.js

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
    
    const input = document.getElementById('inputTeclado');
    const display = document.getElementById('teclaDisplay');
    const panelLog = document.getElementById('panelLog');
    const btnLimpiar = document.getElementById('btnLimpiar');

    function registrarEvento(mensaje) {
        const entrada = document.createElement('div');
        entrada.style.marginBottom = '4px';
        const hora = new Date().toLocaleTimeString('es-ES', { hour12: false });
        entrada.innerHTML = `<span style="color: #64748b; margin-right: 8px;">[${hora}]</span> <span>${mensaje}</span>`;
        panelLog.prepend(entrada);
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            panelLog.innerHTML = '';
        });
    }

    if (input) {
        input.addEventListener('keydown', (e) => {
            if (window.Inspector.estaActivo()) return;
            display.textContent = e.key === ' ' ? 'Espacio' : e.key;
            registrarEvento(`keydown → Tecla: ${e.key} (Código: ${e.code})`);
        });

        input.addEventListener('keyup', (e) => {
            if (window.Inspector.estaActivo()) return;
            registrarEvento(`keyup → Tecla liberada: ${e.key}`);
        });

        input.addEventListener('keypress', (e) => {
            if (window.Inspector.estaActivo()) return;
            // keypress está obsoleta pero se incluye por compatibilidad con la demo
            registrarEvento(`keypress → Caracter producido: ${String.fromCharCode(e.charCode)}`);
        });

        input.addEventListener('focus', () => {
            if (window.Inspector.estaActivo()) return;
            input.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
            registrarEvento(`focus → Input seleccionado`);
        });

        input.addEventListener('blur', () => {
            if (window.Inspector.estaActivo()) return;
            input.style.boxShadow = 'none';
            registrarEvento(`blur → Input perdió el foco`);
        });
    }
});
