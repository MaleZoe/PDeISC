document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ESTADO DE LA APLICACIÓN (STATE)
    // ==========================================
    const INITIAL_AMIGOS = ['Carlos', 'Lucía', 'Martín'];
    const INITIAL_NUMEROS = [3, 7, 12];
    
    let state = {
        frutas: [],
        amigos: [...INITIAL_AMIGOS],
        numeros: [...INITIAL_NUMEROS]
    };

    // ==========================================
    // CONFIGURACIÓN DE UI
    // ==========================================
    const trackers = {
        frutas: { id: 'trackerFrutas', color: 'bg-primary' },
        amigos: { id: 'trackerAmigos', color: 'bg-info text-dark' },
        numeros: { id: 'trackerNumeros', color: 'bg-success' }
    };

    // ==========================================
    // FUNCIONES ATÓMICAS (LOGIC & UI)
    // ==========================================

    /**
     * Renderiza un array en un contenedor específico
     */
    function renderArray(key) {
        const { id, color } = trackers[key];
        const container = document.getElementById(id);
        const data = state[key];
        
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = '<span class="badge bg-secondary opacity-50">Array vacío [ ]</span>';
            return;
        }

        data.forEach(item => {
            const span = document.createElement('span');
            span.className = `badge ${color} elemento-array`;
            span.textContent = item;
            container.appendChild(span);
        });
        
        // Re-vincular efectos visuales a nuevos elementos
        vincularEfectosVisuales();
    }

    /**
     * Valida y agrega una fruta
     */
    function pushFruta() {
        const select = document.getElementById('selectFruta');
        const icono = select.value;
        const nombre = select.options[select.selectedIndex].text.split(' ')[1];
        
        state.frutas.push(`${icono} ${nombre}`);
        renderArray('frutas');
    }

    /**
     * Valida y agrega un amigo
     */
    function pushAmigo() {
        const input = document.getElementById('inputAmigo');
        const nombre = input.value.trim();
        
        if (!nombre || isDuplicate(nombre, state.amigos)) {
            animateError(input);
            return;
        }

        state.amigos.push(nombre);
        input.value = '';
        validateAmigoInput();
        renderArray('amigos');
        input.focus();
    }

    /**
     * Valida y agrega un número
     */
    function pushNumero() {
        const input = document.getElementById('inputNumero');
        const val = parseInt(input.value, 10);
        const ultimo = state.numeros[state.numeros.length - 1] || 0;

        if (isNaN(val) || val <= ultimo) {
            animateError(input);
            return;
        }

        state.numeros.push(val);
        input.value = '';
        updateNumeroPreview();
        renderArray('numeros');
    }

    // --- Helpers ---

    const isDuplicate = (val, arr) => arr.some(item => item.toLowerCase() === val.toLowerCase());

    function animateError(el) {
        el.classList.remove('shake-animation');
        void el.offsetWidth; // Force reflow
        el.classList.add('shake-animation');
    }

    function validateAmigoInput() {
        const input = document.getElementById('inputAmigo');
        const val = input.value.trim();
        const alert = document.getElementById('alertaDuplicado');
        const btns = [
            document.getElementById('btnAgregarAmigoClick'),
            document.getElementById('btnAgregarAmigoContext')
        ];

        const duplicate = isDuplicate(val, state.amigos);
        const empty = val === '';

        btns.forEach(btn => btn.classList.toggle('disabled', duplicate || empty));
        alert.classList.toggle('d-none', !duplicate);
    }

    function updateNumeroPreview() {
        const input = document.getElementById('inputNumero');
        const preview = document.getElementById('previaCondicion');
        const val = parseInt(input.value, 10);
        const ultimo = state.numeros[state.numeros.length - 1] || 0;

        const btns = [
            document.getElementById('btnAgregarNumeroClick'),
            document.getElementById('btnAgregarNumeroContext')
        ];

        if (isNaN(val)) {
            preview.textContent = '';
            btns.forEach(btn => btn.disabled = true);
            return;
        }

        const valid = val > ultimo;
        preview.textContent = `¿Es ${val} > ${ultimo}? ${valid ? '✓ Sí' : '✗ No'}`;
        preview.className = `${valid ? 'text-success' : 'text-danger'} small fw-bold`;
        btns.forEach(btn => btn.disabled = !valid);
    }

    // ==========================================
    // ASIGNACIÓN DE EVENTOS (HANDLERS)
    // ==========================================

    function setupEvents() {
        // --- Demo 1: Frutas ---
        const setupDemo = (btnClick, btnContext, action) => {
            const bc = document.getElementById(btnClick);
            const ctx = document.getElementById(btnContext);

            bc.addEventListener('click', action);
            ctx.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                action();
            });
        };

        setupDemo('btnPushClick', 'btnPushContext', pushFruta);
        setupDemo('btnAgregarAmigoClick', 'btnAgregarAmigoContext', pushAmigo);
        setupDemo('btnAgregarNumeroClick', 'btnAgregarNumeroContext', pushNumero);

        // Inputs
        document.getElementById('inputAmigo').addEventListener('input', validateAmigoInput);
        document.getElementById('inputNumero').addEventListener('input', updateNumeroPreview);

        // Reinicio
        document.querySelectorAll('.btn-reiniciar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demo = e.target.getAttribute('data-demo');
                if (demo === '1') state.frutas = [];
                if (demo === '2') state.amigos = [...INITIAL_AMIGOS];
                if (demo === '3') state.numeros = [...INITIAL_NUMEROS];
                
                const keys = ['frutas', 'amigos', 'numeros'];
                renderArray(keys[demo - 1]);
                if (demo === '2') validateAmigoInput();
                if (demo === '3') updateNumeroPreview();
            });
        });

        // Navbar auto-close
        document.querySelectorAll('.nav-link-auto-close').forEach(link => {
            link.addEventListener('click', () => {
                const menu = document.getElementById('navbarNav');
                if (menu.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(menu).hide();
                }
            });
        });
    }

    // ==========================================
    // ESTÉTICA Y MICRO-INTERACCIONES
    // ==========================================
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

    // --- Inicialización ---
    setupEvents();
    renderArray('frutas');
    renderArray('amigos');
    renderArray('numeros');
});
