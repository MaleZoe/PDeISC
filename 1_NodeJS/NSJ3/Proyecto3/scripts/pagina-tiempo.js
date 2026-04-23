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
    let intervaloId = null;
    let contador = 0;

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



    if (btnAlerta) {
        btnAlerta.addEventListener('click', () => {
            if (window.Inspector.estaActivo()) return;
            
            const textoOriginal = btnAlerta.textContent;
            btnAlerta.textContent = '⏳ Esperando 3s...';
            btnAlerta.disabled = true;
            btnAlerta.style.opacity = '0.7';

            registrarEvento('setTimeout → Iniciando espera de 3 segundos...');
            setTimeout(() => {
                mostrarNotificacion('¡Este es un mensaje inyectado por un temporizador!');
                registrarEvento('setTimeout → Ejecutado después de 3s');
                
                btnAlerta.textContent = textoOriginal;
                btnAlerta.disabled = false;
                btnAlerta.style.opacity = '1';
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
                
                // Efecto visual: pulsación y cambio de color
                const hue = (contador * 15) % 360;
                timerDisplay.style.backgroundColor = `hsl(${hue}, 80%, 90%)`;
                timerDisplay.style.color = `hsl(${hue}, 80%, 30%)`;
                timerDisplay.style.transform = contador % 2 === 0 ? 'scale(1.05)' : 'scale(1)';
                timerDisplay.style.transition = 'all 0.3s ease';

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
                
                // Restaurar estilos
                timerDisplay.style.backgroundColor = '';
                timerDisplay.style.color = '';
                timerDisplay.style.transform = 'scale(1)';
            }
        });
    }
});
