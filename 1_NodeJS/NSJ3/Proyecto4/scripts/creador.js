
(function() {
    const nodosCreados = {};
    const contenedor = document.getElementById('tableroNodos');
    const controles = document.getElementById('controlesCreacion');

    function inicializarBotones() {
        if (!controles) return;
        window.BLUEPRINTS_NODOS.forEach(b => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-outline-primary btn-sm text-start';
            btn.id = `btn-crear-${b.id}`;
            btn.innerHTML = `<span>${b.icono} Crear ${b.texto}</span><br><small class="text-muted">${b.descripcion}</small>`;
            btn.onclick = () => crearNodo(b.id);
            controles.appendChild(btn);
        });
    }

    function crearNodo(id) {
        const blueprint = window.BLUEPRINTS_NODOS.find(b => b.id === id);
        if (!blueprint) return;
        
        if (nodosCreados[id]) {
            const tarjeta = document.querySelector(`[data-nodo-id="${id}"]`);
            tarjeta?.classList.add('ya-existe');
            setTimeout(() => tarjeta?.classList.remove('ya-existe'), 800);
            window.Auditoria.registrarAdvertencia(`El nodo "${blueprint.texto}" ya existe.`);
            return;
        }

        const a = document.createElement('a');
        Object.entries(blueprint.atributos).forEach(([k, v]) => a.setAttribute(k, v));
        a.textContent = blueprint.texto;
        nodosCreados[id] = a;

        renderizarTarjeta(blueprint, a);
        
        const btn = document.getElementById(`btn-crear-${id}`);
        if (btn) {
            btn.disabled = true;
            btn.className = 'btn btn-success btn-sm text-start';
            btn.innerHTML = `✓ ${blueprint.texto} creado`;
        }

        if (window.Modificador) window.Modificador.habilitarMutaciones(id);
        if (window.Auditoria) window.Auditoria.registrarCreacion(blueprint, a);
    }

    function renderizarTarjeta(b, a) {
        if (!contenedor) return;
        if (contenedor.querySelector('.placeholder-vacio')) contenedor.innerHTML = '';
        
        const card = document.createElement('div');
        const tipoClase = b.atributos.class.split(' ').find(c => c.startsWith('nodo-')) || '';
        card.className = `tarjeta-nodo entrada-nodo ${tipoClase}`;
        card.setAttribute('data-nodo-id', b.id);
        
        const header = document.createElement('div');
        header.className = 'd-flex justify-content-between mb-2';
        header.innerHTML = `<span>${b.icono} <b>${b.id}</b></span>`;
        
        const tabla = document.createElement('div');
        tabla.className = 'tabla-atributos';
        Object.entries(b.atributos).forEach(([k, v]) => {
            tabla.innerHTML += `<div class="d-flex justify-content-between mb-1">
                <span>${k}:</span>
                <span class="attr-badge" data-attr="${k}">${v}</span>
            </div>`;
        });

        card.appendChild(header);
        card.appendChild(a); // El nodo real
        card.appendChild(tabla);
        contenedor.appendChild(card);
    }

    window.Creador = {
        obtenerNodo: (id) => nodosCreados[id],
        actualizarBadgeAtributo: (idNodo, attr, valor) => {
            const badge = document.querySelector(`[data-nodo-id="${idNodo}"] [data-attr="${attr}"]`);
            if (badge) {
                badge.textContent = valor;
                badge.classList.add('badge-actualizado');
                setTimeout(() => badge.classList.remove('badge-actualizado'), 800);
            }
        }
    };

    document.addEventListener('DOMContentLoaded', inicializarBotones);
})();
