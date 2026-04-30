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

    function renderArray(key) {
        const container = document.getElementById(`tracker${capitalize(key)}`);
        if (!container) return;
        container.innerHTML = '';
        const data = state[key];

        if (data.length === 0) {
            container.innerHTML = `<span class="badge bg-secondary opacity-50">Array vacío [ ]</span>`;
            toggleDemoButtons(key, true);
            return;
        }

        toggleDemoButtons(key, false);

        data.forEach((item, idx) => {
            const el = document.createElement(key === 'mensajes' ? 'div' : 'span');
            el.className = getElementClass(key, idx);
            el.id = `${key}-${idx}`;
            
            if (key === 'mensajes') {
                el.textContent = item;
            } else if (key === 'cola') {
                el.innerHTML = idx === 0 ? `🧑‍💼 <b>${item}</b> (Atendiendo)` : `👤 ${item}`;
            } else {
                el.textContent = item;
            }
            
            container.appendChild(el);
        });

        updatePreviews(key);
        vincularEfectosVisuales();
    }

    const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
    
    function getElementClass(key, idx) {
        if (key === 'numeros') return 'badge bg-primary elemento-array';
        if (key === 'mensajes') return 'p-2 bg-dark rounded border border-secondary text-light w-50 elemento-array';
        if (key === 'cola') return `badge ${idx === 0 ? 'bg-success' : 'bg-secondary'} elemento-array`;
        return 'elemento-array';
    }

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

    function updatePreviews(key) {
        // Previsualizaciones eliminadas por solicitud
    }

    /**
     * Lógica central de shift con animación
     */
    async function shiftElement(key, count = 1) {
        if (state[key].length === 0) return;

        for (let i = 0; i < count && state[key].length > 0; i++) {
            const firstDOM = document.getElementById(`${key}-0`);
            if (firstDOM) {
                firstDOM.classList.add('anim-shift-out-left');
                await new Promise(r => setTimeout(r, 350));
            }
            
            const removed = state[key].shift();
            
            renderArray(key);
        }
    }



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
        // Animar el último que entró
        const last = document.getElementById(`cola-${state.cola.length - 1}`);
        if (last) last.classList.add('anim-push-in-right');
    }

    function animateError(el) {
        el.classList.remove('shake-animation');
        void el.offsetWidth;
        el.classList.add('shake-animation');
    }

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

            if (ctx) ctx.addEventListener('contextmenu', (e) => { e.preventDefault(); shiftElement(key, count); });
            if (dbl) dbl.addEventListener('dblclick', () => shiftElement(key, count));
        };

        bindShift('btnShiftNumero', 'numeros');
        bindShift('btnEliminarMensaje', 'mensajes');

        // Demo 3: Atender (Click) y Agregar (Clic Der)
        const btnAtender = document.getElementById('btnAtenderClick');
        const btnAddCtx = document.getElementById('btnAgregarClienteContext');

        if (btnAtender) btnAtender.addEventListener('click', () => shiftElement('cola'));
        if (btnAddCtx) btnAddCtx.addEventListener('contextmenu', (e) => { e.preventDefault(); pushCliente(); });
        
        const inputCliente = document.getElementById('inputCliente');
        if (inputCliente) {
            inputCliente.addEventListener('input', validateCliente);
            validateCliente();
        }

        // Reinicio
        document.querySelectorAll('.btn-reiniciar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demo = e.target.getAttribute('data-demo');
                const keys = ['numeros', 'mensajes', 'cola'];
                const key = keys[demo - 1];
                state[key] = [...(key === 'numeros' ? INITIAL_ENTEROS : key === 'mensajes' ? INITIAL_MENSAJES : INITIAL_COLA)];
                if (key === 'mensajes') document.getElementById('bubbleEliminado').classList.add('d-none');
                renderArray(key);
                if (key === 'cola') validateCliente();
            });
        });

        // Navbar
        document.querySelectorAll('.nav-link-auto-close').forEach(link => {
            link.addEventListener('click', () => {
                const menu = document.getElementById('navbarNav');
                if (menu && menu.classList.contains('show')) bootstrap.Collapse.getInstance(menu).hide();
            });
        });
    }

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

    setupEvents();
    renderArray('numeros');
    renderArray('mensajes');
    renderArray('cola');
});

