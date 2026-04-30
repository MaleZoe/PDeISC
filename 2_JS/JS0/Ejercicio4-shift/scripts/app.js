/**
 * Ejercicio 4: Método shift()
 * Este script demuestra cómo eliminar el PRIMER elemento de un array.
 */
document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ESTADO DE LA APLICACIÓN
    // ==========================================
    const INITIAL_ENTEROS = [10, 20, 30, 40, 50];
    const INITIAL_MENSAJES = ['Hola!', '¿Cómo estás?', 'Bien, gracias.', '¿Y vos?', 'Todo bien!'];
    const INITIAL_COLA = ['Cliente 1', 'Cliente 2', 'Cliente 3', 'Cliente 4', 'Cliente 5'];

    let state = {
        numeros: [...INITIAL_ENTEROS],
        mensajes: [...INITIAL_MENSAJES],
        cola: [...INITIAL_COLA]
    };

    // ==========================================
    // FUNCIONES ATÓMICAS (LOGIC & UI)
    // ==========================================

    /**
     * Dibuja los elementos del array en pantalla
     */
    function renderArray(key) {
        const container = document.getElementById(`tracker${capitalize(key)}`);
        if (!container) return;
        container.innerHTML = '';
        const data = state[key];

        // Si no hay datos, deshabilitamos botones y mostramos mensaje
        if (data.length === 0) {
            container.innerHTML = `<span class="badge bg-secondary opacity-50">Array vacío [ ]</span>`;
            toggleDemoButtons(key, true);
            return;
        }

        toggleDemoButtons(key, false);

        // Generamos los elementos visuales uno por uno
        data.forEach((item, idx) => {
            const el = document.createElement(key === 'mensajes' ? 'div' : 'span');
            el.className = getElementClass(key, idx);
            el.id = `${key}-${idx}`;
            
            if (key === 'mensajes') {
                el.textContent = item;
            } else if (key === 'cola') {
                // En la cola, el índice 0 es quien está siendo atendido
                el.innerHTML = idx === 0 ? `🧑‍💼 <b>${item}</b> (Atendiendo)` : `👤 ${item}`;
            } else {
                el.textContent = item;
            }
            
            container.appendChild(el);
        });

        vincularEfectosVisuales();
    }

    const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
    
    // Asigna estilos según el tipo de dato y posición
    function getElementClass(key, idx) {
        if (key === 'numeros') return 'badge bg-primary elemento-array';
        if (key === 'mensajes') return 'p-2 bg-dark rounded border border-secondary text-light w-50 elemento-array';
        if (key === 'cola') return `badge ${idx === 0 ? 'bg-success' : 'bg-secondary'} elemento-array`;
        return 'elemento-array';
    }

    // Activa o desactiva botones según el estado del array
    function toggleDemoButtons(key, disabled) {
        if (key === 'cola') {
            const btn = document.getElementById('btnAtenderClick');
            if (btn) btn.disabled = disabled || state.cola.length === 0;
            return;
        }
        const prefix = key === 'numeros' ? 'btnShiftNumero' : 'btnEliminarMensaje';
        ['Context', 'Dbl'].forEach(s => {
            const btn = document.getElementById(`${prefix}${s}`);
            if (btn) btn.disabled = disabled;
        });
    }

    /**
     * Lógica central de .shift() con animación de salida hacia la izquierda
     */
    async function shiftElement(key, count = 1) {
        if (state[key].length === 0) return;

        for (let i = 0; i < count && state[key].length > 0; i++) {
            const firstDOM = document.getElementById(`${key}-0`);
            // Animamos el primer elemento antes de quitarlo
            if (firstDOM) {
                firstDOM.classList.add('anim-shift-out-left');
                await new Promise(r => setTimeout(r, 350));
            }
            
            // EL MÉTODO CLAVE: .shift() elimina el primer elemento y lo devuelve
            const removed = state[key].shift();
            
            renderArray(key);
        }
    }

    /**
     * Agrega un cliente al final de la cola usando .push()
     */
    function pushCliente(e) {
        if (e) e.preventDefault();
        const input = document.getElementById('inputCliente');
        const val = input.value.trim();
        if (!val) {
            animateError(input);
            return;
        }
        state.cola.push(val);
        input.value = '';
        renderArray('cola');
        
        // Animamos la entrada del nuevo elemento
        const last = document.getElementById(`cola-${state.cola.length - 1}`);
        if (last) last.classList.add('anim-push-in-right');
    }

    // Efecto de sacudida para errores
    function animateError(el) {
        el.classList.remove('shake-animation');
        void el.offsetWidth;
        el.classList.add('shake-animation');
    }

    // Validador de entrada para clientes
    function validateCliente() {
        const input = document.getElementById('inputCliente');
        if (!input) return;
        const val = input.value.trim();
        const btn = document.getElementById('btnAgregarClienteContext');
        if (btn) btn.disabled = val === '';
    }

    // ==========================================
    // ASIGNACIÓN DE EVENTOS (HANDLERS)
    // ==========================================

    function setupEvents() {
        const bindShift = (prefix, key, count = 1) => {
            const ctx = document.getElementById(`${prefix}Context`);
            const dbl = document.getElementById(`${prefix}Dbl`);

            // Evento de Click Derecho
            if (ctx) ctx.addEventListener('contextmenu', (e) => { e.preventDefault(); shiftElement(key, count); });
            // Evento de Doble Click
            if (dbl) dbl.addEventListener('dblclick', () => shiftElement(key, count));
        };

        bindShift('btnShiftNumero', 'numeros');
        bindShift('btnEliminarMensaje', 'mensajes');

        // Demo 3: Botones de Atender y Agregar
        const btnAtender = document.getElementById('btnAtenderClick');
        const btnAddCtx = document.getElementById('btnAgregarClienteContext');

        if (btnAtender) btnAtender.addEventListener('click', () => shiftElement('cola'));
        if (btnAddCtx) btnAddCtx.addEventListener('contextmenu', (e) => { e.preventDefault(); pushCliente(); });
        
        const inputCliente = document.getElementById('inputCliente');
        if (inputCliente) {
            inputCliente.addEventListener('input', validateCliente);
            validateCliente();
        }

        // Botones de Reiniciar
        document.querySelectorAll('.btn-reiniciar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demo = e.target.getAttribute('data-demo');
                const keys = ['numeros', 'mensajes', 'cola'];
                const key = keys[demo - 1];
                state[key] = [...(key === 'numeros' ? INITIAL_ENTEROS : key === 'mensajes' ? INITIAL_MENSAJES : INITIAL_COLA)];
                renderArray(key);
                if (key === 'cola') validateCliente();
            });
        });

        // Navbar auto-cierre
        document.querySelectorAll('.nav-link-auto-close').forEach(link => {
            link.addEventListener('click', () => {
                const menu = document.getElementById('navbarNav');
                if (menu && menu.classList.contains('show')) bootstrap.Collapse.getInstance(menu).hide();
            });
        });
    }

    // Efectos visuales de hover
    function vincularEfectosVisuales() {
        document.querySelectorAll('.btn, .elemento-array').forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transform = 'scale(1.05)';
                el.style.transition = 'transform 0.2s';
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'scale(1)';
            });
        });
    }

    // Inicialización de la aplicación
    setupEvents();
    renderArray('numeros');
    renderArray('mensajes');
    renderArray('cola');
});


