/**
 * Ejercicio 5: Método splice()
 * Este script demuestra el método más versátil de los arrays: .splice(),
 * que sirve para eliminar, insertar o reemplazar elementos en cualquier posición.
 */
document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ESTADO DE LA APLICACIÓN
    // ==========================================
    const INITIAL_LETRAS = ['A', 'B', 'C', 'D', 'E'];
    const INITIAL_ORDINALES = ['Primero', 'Tercero', 'Cuarto'];
    const INITIAL_VIEJOS = ['Viejo1', 'Viejo2', 'Viejo3', 'Viejo4'];

    let state = {
        letras: [...INITIAL_LETRAS],
        ordinales: [...INITIAL_ORDINALES],
        viejos: [...INITIAL_VIEJOS]
    };

    // ==========================================
    // FUNCIONES ATÓMICAS (LOGIC & UI)
    // ==========================================

    const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

    // Determina el color y estilo de cada elemento en la interfaz
    function getBadgeClass(key, idx, highlights) {
        if (key === 'letras') return 'bg-primary';
        if (key === 'ordinales') return 'bg-info text-dark' + (highlights.includes(idx) ? ' anim-pulse-green' : '');
        if (key === 'viejos') return highlights.includes(idx) ? 'bg-success anim-pulse-green' : 'bg-secondary';
        return '';
    }

    /**
     * Renderiza el array en pantalla con posibilidad de resaltar elementos nuevos
     */
    function renderArray(key, highlightedIndices = []) {
        const container = document.getElementById(`tracker${capitalize(key === 'letras' ? 'Letras' : key === 'ordinales' ? 'Ordinales' : 'Reemplazo')}`);
        if (!container) return;
        container.innerHTML = '';
        const data = state[key];

        if (data.length === 0) {
            container.innerHTML = `<span class="badge bg-secondary opacity-50">Array vacío [ ]</span>`;
            return;
        }

        data.forEach((item, idx) => {
            const span = document.createElement('span');
            span.className = `badge elemento-array ${getBadgeClass(key, idx, highlightedIndices)}`;
            span.textContent = item;
            span.id = `${key}-${idx}`;
            container.appendChild(span);
        });

        vincularEfectosVisuales();
    }

    /**
     * Demo 1: ELIMINAR con .splice(inicio, cantidad)
     */
    async function spliceEliminar() {
        if (state.letras.length <= 1) return;
        const inicio = 1, cantidad = 2; // Eliminar 2 elementos desde la posición 1
        
        // Animamos los elementos que van a desaparecer
        for (let i = inicio; i < inicio + cantidad && i < state.letras.length; i++) {
            const el = document.getElementById(`letras-${i}`);
            if (el) el.classList.add('anim-fade-out-red');
        }

        await new Promise(r => setTimeout(r, 400));
        
        // EL MÉTODO CLAVE: .splice(posicion, cuantos)
        state.letras.splice(inicio, cantidad);
        renderArray('letras');
    }

    /**
     * Demo 2: INSERTAR con .splice(inicio, 0, nuevoElemento)
     */
    function spliceInsertar() {
        const input = document.getElementById('inputInsertar');
        const val = input.value.trim();
        if (!val) {
            animateError(input);
            return;
        }
        const pos = 1; // Insertar siempre en la posición 1
        
        // EL MÉTODO CLAVE: .splice(posicion, 0, item) -> El '0' significa no borrar nada
        state.ordinales.splice(pos, 0, val);
        input.value = '';
        renderArray('ordinales', [pos]);
        validateInputs();
    }

    /**
     * Demo 3: REEMPLAZAR con .splice(inicio, cantidad, ...nuevosElementos)
     */
    async function spliceReemplazar() {
        if (state.viejos.length <= 1) return;
        const inputA = document.getElementById('inputReemplazoA');
        const inputB = document.getElementById('inputReemplazoB');
        const valA = inputA.value.trim() || 'NuevoA';
        const valB = inputB.value.trim() || 'NuevoB';
        const inicio = 1, cantidad = 2;

        // Animación de los que se van
        for (let i = inicio; i < inicio + cantidad && i < state.viejos.length; i++) {
            const el = document.getElementById(`viejos-${i}`);
            if (el) el.classList.add('anim-fade-out-red');
        }

        await new Promise(r => setTimeout(r, 400));
        
        // EL MÉTODO CLAVE: .splice(pos, cuantos, item1, item2...) reemplaza 'cuantos' por los nuevos items
        state.viejos.splice(inicio, cantidad, valA, valB);
        inputA.value = '';
        inputB.value = '';
        renderArray('viejos', [inicio, inicio + 1]);
        updatePreviewReemplazo();
    }

    // Efecto de error visual
    function animateError(el) {
        el.classList.remove('shake-animation');
        void el.offsetWidth;
        el.classList.add('shake-animation');
    }

    // Valida estados de botones y muestra vistas previas
    function validateInputs() {
        // Demo 1
        ['Down', 'Context'].forEach(s => {
            const btn = document.getElementById(`btnEliminarSplice${s}`);
            if (btn) btn.disabled = state.letras.length <= 1;
        });

        // Demo 2
        const inputIns = document.getElementById('inputInsertar');
        if (inputIns) {
            const val = inputIns.value.trim();
            const btns = ['btnInsertarDown', 'btnInsertarInput'].map(id => document.getElementById(id));
            const preview = document.getElementById('previewInsertar');
            btns.forEach(btn => { if (btn) btn.disabled = !val; });
            if (preview) preview.textContent = val ? `Se insertará '${val}' en posición 1` : '';
        }

        // Demo 3
        ['Down', 'Context'].forEach(s => {
            const btn = document.getElementById(`btnReemplazar${s}`);
            if (btn) btn.disabled = state.viejos.length <= 1;
        });
    }

    // Muestra cómo quedaría la llamada al método en el código
    function updatePreviewReemplazo() {
        const valA = document.getElementById('inputReemplazoA').value || 'A';
        const valB = document.getElementById('inputReemplazoB').value || 'B';
        const p = document.getElementById('previewReemplazo');
        if (p) p.textContent = `Operación: splice(1, 2, '${valA}', '${valB}')`;
    }

    // ==========================================
    // ASIGNACIÓN DE EVENTOS (HANDLERS)
    // ==========================================

    function setupEvents() {
        const bindEvents = (prefix, action, events) => {
            events.forEach(ev => {
                const el = document.getElementById(`${prefix}${ev.id}`);
                if (el) el.addEventListener(ev.type, (e) => {
                    if (ev.type === 'contextmenu') e.preventDefault();
                    action();
                });
            });
        };
        
        bindEvents('btnEliminarSplice', spliceEliminar, [{id: 'Down', type: 'mousedown'}, {id: 'Context', type: 'contextmenu'}]);
        bindEvents('btnInsertar', spliceInsertar, [{id: 'Down', type: 'mousedown'}, {id: 'Input', type: 'input'}]);
        bindEvents('btnReemplazar', spliceReemplazar, [{id: 'Down', type: 'mousedown'}, {id: 'Context', type: 'contextmenu'}]);

        document.getElementById('inputInsertar').addEventListener('input', validateInputs);
        validateInputs();

        [document.getElementById('inputReemplazoA'), document.getElementById('inputReemplazoB')].forEach(input => {
            input.addEventListener('input', updatePreviewReemplazo);
        });

        // Botones de Reiniciar
        document.querySelectorAll('.btn-reiniciar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demo = e.target.getAttribute('data-demo');
                if (demo === '1') state.letras = [...INITIAL_LETRAS];
                if (demo === '2') state.ordinales = [...INITIAL_ORDINALES];
                if (demo === '3') state.viejos = [...INITIAL_VIEJOS];
                
                const keys = ['letras', 'ordinales', 'viejos'];
                renderArray(keys[demo - 1]);
                validateInputs();
                if (demo === '3') updatePreviewReemplazo();
            });
        });

        // Autocierre del menú móvil
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

    // Inicialización
    setupEvents();
    renderArray('letras');
    renderArray('ordinales');
    renderArray('viejos');
    validateInputs();
});

