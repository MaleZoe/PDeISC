// scripts/inspector.js
// Funcionalidad simplificada para contar hijos de un elemento al hacer clic

(function() {
    /**
     * Manejador central: recibe el click y muestra el conteo de hijos
     */
    function manejarClick(evento) {
        // Evitamos que el click dispare acciones no deseadas durante la inspección
        const el = evento.target;

        // Ignorar elementos de la interfaz del sistema
        if (el.id === 'panelInspector' || el.closest('.navbar') || el.tagName === 'HTML' || el.tagName === 'BODY') {
            return;
        }

        // Conteo de hijos directos (children)
        const cantidadHijos = el.children.length;
        
        actualizarPanel(el, cantidadHijos);
    }

    /**
     * Actualiza el panel informativo con el resultado
     */
    function actualizarPanel(el, cantidad) {
        const panel = document.getElementById('panelInspector');
        if (!panel) return;

        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const clases = el.className ? `.${el.className.split(' ').join('.')}` : '';

        panel.innerHTML = `
            <div class="resultado-conteo">
                <h6>Elemento: <code>&lt;${tag}${id}${clases}&gt;</code></h6>
                <p class="fs-4">Tiene <strong>${cantidad}</strong> hijos directos.</p>
                <small class="text-muted">Evento detectado por fase de burbuja.</small>
            </div>
        `;
        
        // Efecto visual temporal en el elemento cliqueado
        const originalOutline = el.style.outline;
        el.style.outline = '2px solid #6366f1';
        setTimeout(() => el.style.outline = originalOutline, 800);
    }

    // Registrar el evento de click en el documento
    document.addEventListener('click', manejarClick);
    
    console.log('[SISTEMA] Contador de hijos activo. Haz clic en cualquier elemento.');
})();
