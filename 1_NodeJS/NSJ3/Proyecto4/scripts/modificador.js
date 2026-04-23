// scripts/modificador.js
(function() {
    const mutacionesAplicadas = {};
    const MUTACIONES = [
        { id: 'mut-google-href', idNodo: 'enlace-google', atributo: 'href', valorNuevo: 'https://www.google.com.ar', descripcion: 'Google Argentina' },
        { id: 'mut-google-target', idNodo: 'enlace-google', atributo: 'target', valorNuevo: '_self', descripcion: 'Misma pestaña' },
        { id: 'mut-wiki-href', idNodo: 'enlace-wiki', atributo: 'href', valorNuevo: 'https://es.wikipedia.org', descripcion: 'Wiki Español' },
        { id: 'mut-wiki-texto', idNodo: 'enlace-wiki', atributo: 'textContent', valorNuevo: 'Wikipedia ES', descripcion: 'Renombrar Wiki' },
        { id: 'mut-github-title', idNodo: 'enlace-github', atributo: 'title', valorNuevo: 'Explorar Código', descripcion: 'Cambiar Tooltip' },
        { id: 'mut-youtube-class', idNodo: 'enlace-youtube', atributo: 'class', valorNuevo: 'enlace-vivo nodo-video nodo-destacado', descripcion: 'Destacar Video' },
        { id: 'mut-noticias-href', idNodo: 'enlace-noticias', atributo: 'href', valorNuevo: 'https://www.infobae.com', descripcion: 'Cambiar a Infobae' },
        { id: 'mut-noticias-target', idNodo: 'enlace-noticias', atributo: 'target', valorNuevo: '_blank', descripcion: 'Nueva pestaña' }
    ];

    const contenedor = document.getElementById('controlesMutacion');

    function inicializarBotones() {
        if (!contenedor) return;
        MUTACIONES.forEach(m => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-outline-warning btn-sm text-start opacity-50';
            btn.disabled = true;
            btn.id = `btn-mut-${m.id}`;
            btn.setAttribute('data-nodo-id', m.idNodo);
            btn.innerHTML = `
                <span>Aplicar → ${m.descripcion}</span>
                <span class="badge-atributo">atributo: ${m.atributo}</span>
            `;
            btn.onclick = () => aplicarMutacion(m.id);
            contenedor.appendChild(btn);
        });
    }

    function aplicarMutacion(idMutacion) {
        const mutacion = MUTACIONES.find(m => m.id === idMutacion);
        if (!mutacion) return;

        const nodo = window.Creador.obtenerNodo(mutacion.idNodo);
        if (!nodo) return;
        
        const valorRealAnterior = mutacion.atributo === 'textContent' 
            ? nodo.textContent 
            : nodo.getAttribute(mutacion.atributo);

        if (mutacion.atributo === 'textContent') {
            nodo.textContent = mutacion.valorNuevo;
        } else {
            nodo.setAttribute(mutacion.atributo, mutacion.valorNuevo);
        }

        mutacionesAplicadas[idMutacion] = true;

        if (window.Creador) window.Creador.actualizarBadgeAtributo(mutacion.idNodo, mutacion.atributo, mutacion.valorNuevo);
        if (window.Auditoria) window.Auditoria.registrarMutacion(mutacion, valorRealAnterior, mutacion.valorNuevo);

        const btn = document.getElementById(`btn-mut-${idMutacion}`);
        if (btn) {
            btn.disabled = true;
            btn.className = 'btn btn-warning btn-sm text-start';
            btn.innerHTML = `✓ Aplicada`;
        }
    }

    window.Modificador = {
        habilitarMutaciones: (idNodo) => {
            const btns = document.querySelectorAll(`button[data-nodo-id="${idNodo}"]`);
            btns.forEach(b => {
                b.disabled = false;
                b.classList.remove('opacity-50');
                b.classList.add('entrada-nodo'); // Reusar animación
            });
        },
        aplicarMutacion
    };

    document.addEventListener('DOMContentLoaded', inicializarBotones);
})();
