// scripts/pagina-tiempo.js

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
    
    const btnAlerta = document.getElementById('btnAlerta');
    const btnIntervalo = document.getElementById('btnIntervalo');
    const btnDetener = document.getElementById('btnDetener');
    const timerDisplay = document.getElementById('timerDisplay');
    const notificacionArea = document.getElementById('notificacionArea');
    const panelLog = document.getElementById('panelLog');
    const btnLimpiar = document.getElementById('btnLimpiar');

    let intervaloId = null;
    let contador = 0;

    function registrarEvento(mensaje) {
        const entrada = document.createElement('div');
        entrada.style.marginBottom = '4px';
        const hora = new Date().toLocaleTimeString('es-ES', { hour12: false });
        entrada.innerHTML = `<span style="color: #64748b; margin-right: 8px;">[${hora}]</span> <span>${mensaje}</span>`;
        panelLog.prepend(entrada);
    }

    function mostrarNotificacion(texto) {
        const div = document.createElement('div');
        div.className = 'notificacion';
        div.textContent = texto;
        notificacionArea.innerHTML = '';
        notificacionArea.appendChild(div);
        
        setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 500);
        }, 3000);
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            panelLog.innerHTML = '';
        });
    }

    if (btnAlerta) {
        btnAlerta.addEventListener('click', () => {
            if (window.Inspector.estaActivo()) return;
            registrarEvento('setTimeout → Iniciando espera de 3 segundos...');
            setTimeout(() => {
                mostrarNotificacion('¡Este es un mensaje inyectado por un temporizador!');
                registrarEvento('setTimeout → Ejecutado después de 3s');
            }, 3000);
        });
    }

    if (btnIntervalo) {
        btnIntervalo.addEventListener('click', () => {
            if (window.Inspector.estaActivo()) return;
            if (intervaloId) return; // Evitar múltiples intervalos

            registrarEvento('setInterval → Iniciando contador de segundos');
            intervaloId = setInterval(() => {
                contador++;
                const mins = Math.floor(contador / 60).toString().padStart(2, '0');
                const secs = (contador % 60).toString().padStart(2, '0');
                timerDisplay.textContent = `${mins}:${secs}`;
                
                if (contador % 5 === 0) {
                    registrarEvento(`setInterval → ${contador} segundos transcurridos`);
                }
            }, 1000);
        });
    }

    if (btnDetener) {
        btnDetener.addEventListener('click', () => {
            if (window.Inspector.estaActivo()) return;
            if (intervaloId) {
                clearInterval(intervaloId);
                intervaloId = null;
                registrarEvento('clearInterval → Contador detenido');
            }
        });
    }
});
