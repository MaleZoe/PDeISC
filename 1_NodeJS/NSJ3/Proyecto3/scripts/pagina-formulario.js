// scripts/pagina-formulario.js

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
    
    const form = document.getElementById('formularioDemo');
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

    if (form) {
        form.addEventListener('submit', (e) => {
            if (window.Inspector.estaActivo()) return;
            e.preventDefault();
            const formData = new FormData(form);
            const nombre = formData.get('nombre');
            registrarEvento(`submit → Formulario enviado. Nombre: ${nombre}`);
            // No usamos alert() por restricción de proyecto
            console.log('Formulario enviado:', Object.fromEntries(formData));
        });

        form.addEventListener('reset', () => {
            if (window.Inspector.estaActivo()) return;
            registrarEvento(`reset → Formulario reiniciado`);
        });

        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('change', (e) => {
                if (window.Inspector.estaActivo()) return;
                registrarEvento(`change → Campo ${e.target.name} cambiado a: ${e.target.value}`);
            });

            input.addEventListener('input', (e) => {
                if (window.Inspector.estaActivo()) return;
                // Registramos solo en consola para no saturar el log visual
                console.log(`Input en ${e.target.name}: ${e.target.value}`);
            });
        });
    }
});
