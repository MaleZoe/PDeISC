document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ESTADOS INMUTABLES (BASE)
    // ==========================================
    const BASES = {
        demo1: [2, 5, 8, 11, 14, 17],
        demo2: ['alicia', 'bernardo', 'claudia', 'diego', 'elena'],
        demo3: [100, 250, 80, 320, 150]
    };

    // ==========================================
    // FUNCIONES ATÓMICAS (LOGIC & UI)
    // ==========================================

    function renderArray(demoNum, array, containerSuffix = 'Base', prefix = '') {
        const containerId = containerSuffix === 'Base' ? `trackerBase${demoNum}` : `trackerResultado${demoNum}`;
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        array.forEach((item, idx) => {
            const span = document.createElement('span');
            const isResult = containerSuffix !== 'Base';
            span.className = `badge ${isResult ? 'bg-primary anim-fade-in' : 'bg-secondary opacity-75'} elemento-array mb-2`;
            span.textContent = `${prefix}${item}`;
            span.id = `d${demoNum}-${containerSuffix}-${idx}`;
            container.appendChild(span);
        });
        vincularEfectosVisuales();
    }

    function runDemo1() {
        const m = parseInt(document.getElementById('selectMultiplicador').value, 10);
        const nuevoArray = BASES.demo1.map(n => n * m);
        renderArray(1, nuevoArray, 'Resultado');
        toggleButtons('btnMultiplicar', true);
    }

    function runDemo2(upper = true) {
        const nuevoArray = BASES.demo2.map(str => upper ? str.toUpperCase() : str.toLowerCase());
        renderArray(2, nuevoArray, 'Resultado');
        const container = document.getElementById('trackerResultado2').parentElement;
        container.classList.toggle('bg-info', upper);
        container.classList.toggle('bg-opacity-10', true);
        toggleButtons('btnMayusculas', true);
    }

    function runDemo3() {
        const iva = parseFloat(document.getElementById('inputIVA').value) || 0;
        const factor = 1 + (iva / 100);
        const nuevoArray = BASES.demo3.map(precio => (precio * factor).toFixed(2));
        renderArray(3, nuevoArray, 'Resultado', '$');
        toggleButtons('btnAplicarIVA', true);
    }

    function toggleButtons(prefix, disabled) {
        ['Dbl', 'Down'].forEach(s => {
            const btn = document.getElementById(`${prefix}${s}`);
            if (btn) btn.disabled = disabled;
        });
    }

    // ==========================================
    // ASIGNACIÓN DE EVENTOS (HANDLERS)
    // ==========================================

    function setupEvents() {
        const bind = (id, action, type) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener(type, action);
        };

        // Demo 1
        bind('btnMultiplicarDbl', runDemo1, 'dblclick');
        bind('btnMultiplicarDown', runDemo1, 'mousedown');

        // Demo 2
        bind('btnMayusculasDbl', () => runDemo2(true), 'dblclick');
        bind('btnMayusculasDown', () => runDemo2(true), 'mousedown');

        // Demo 3
        bind('btnAplicarIVADbl', runDemo3, 'dblclick');
        bind('btnAplicarIVADown', runDemo3, 'mousedown');

        // Reinicio
        document.querySelectorAll('.btn-reiniciar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demo = e.target.getAttribute('data-demo');
                const prefix = demo === '1' ? 'btnMultiplicar' : (demo === '2' ? 'btnMayusculas' : 'btnAplicarIVA');
                toggleButtons(prefix, false);
                document.getElementById(`trackerResultado${demo}`).innerHTML = '<span class="opacity-50 small">Esperando acción...</span>';
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
    renderArray(1, BASES.demo1);
    renderArray(2, BASES.demo2);
    renderArray(3, BASES.demo3, 'Base', '$');
    vincularEfectosVisuales();
});
