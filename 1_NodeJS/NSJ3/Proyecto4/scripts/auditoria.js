
(function() {
    let contador = 0;
    const panel = document.getElementById('panelAuditoria');
    const badgeContador = document.getElementById('contadorEventos');

    function obtenerFecha() {
        return new Date().toLocaleTimeString('es-AR');
    }

    function registrar(tipo, titulo, contenido) {
        contador++;
        if (badgeContador) badgeContador.textContent = contador;
        
        const entrada = document.createElement('div');
        entrada.className = `entrada-log ${tipo}`;
        entrada.innerHTML = `
            <div class="fw-bold d-flex justify-content-between">
                <span>[${obtenerFecha()}] ${titulo}</span>
                <span class="text-muted">#${contador}</span>
            </div>
            <div class="mt-1">${contenido}</div>
        `;

        if (panel && panel.querySelector('.placeholder-log')) {
            panel.innerHTML = '';
        }
        if (panel) {
            panel.prepend(entrada);
            // Limitar a 50 entradas - eliminar la más antigua si se excede
            if (panel.children.length > 50) {
                panel.lastElementChild.remove();
            }
        }
    }

    window.Auditoria = {
        registrarCreacion: (blueprint, el) => {
            let attrs = Object.entries(blueprint.atributos)
                .map(([k, v]) => `<div>&nbsp;&nbsp;${k} = "${v}"</div>`).join('');
            registrar('creacion', 'CREACIÓN', `Nodo: &lt;a id="${blueprint.id}"&gt;<br>Atributos iniciales:${attrs}`);
        },
        registrarMutacion: (mutacion, anterior, nuevo) => {
            registrar('mutacion', 'MUTACIÓN', `
                Nodo: ${mutacion.idNodo}<br>
                Atributo: <b>${mutacion.atributo}</b><br>
                Anterior: <span class="valor-anterior">${anterior}</span><br>
                Nuevo: <span class="valor-nuevo">${nuevo}</span>
            `);
        },
        registrarAdvertencia: (msj) => {
            registrar('advertencia', 'ADVERTENCIA', `⚠️ ${msj}`);
        },
        limpiarLog: () => {
        
            if (panel) panel.innerHTML = '<div class="placeholder-log">Registro vacío.</div>';
            contador = 0;
            if (badgeContador) badgeContador.textContent = 0;
            console.log('[AUDITORÍA] Registro limpiado');
        },
        exportarComoTexto: () => {
            if (!panel) return;
            const texto = Array.from(panel.children).map(e => e.innerText).join('\n' + '-'.repeat(30) + '\n');
            const ventana = window.open('', '_blank');
            if (ventana) ventana.document.write(`<pre>${texto}</pre>`);
        }
    };

    document.getElementById('btnLimpiarLog')?.addEventListener('click', window.Auditoria.limpiarLog);
    document.getElementById('btnExportarLog')?.addEventListener('click', window.Auditoria.exportarComoTexto);
})();
