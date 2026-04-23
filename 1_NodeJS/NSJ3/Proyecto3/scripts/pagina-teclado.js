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
    function registrarEvento(mensaje) {
        console.log(mensaje);
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
