document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ESTADO DE LA APLICACIÓN
    // ==========================================
    const BASES = {
        demo1: [3, 15, 7, 42, 9, 28, 11, 5, 33, 18],
        demo2: ['sol', 'computadora', 'paz', 'javascript', 'mar', 'programar', 'luz', 'algoritmo', 'red', 'función'],
        demo3: [
            {nombre:'Ana', activo:true}, 
            {nombre:'Bruno', activo:false}, 
            {nombre:'Carla', activo:true}, 
            {nombre:'Diego', activo:false}, 
            {nombre:'Elena', activo:true}, 
            {nombre:'Fabio', activo:false}
        ]
    };
    
    let state3 = JSON.parse(JSON.stringify(BASES.demo3));

    // ==========================================
    // FUNCIONES ATÓMICAS (LOGIC & UI)
    // ==========================================

    function renderArray(demoNum, array, containerSuffix = 'Base', colorOverride = '') {
        const containerId = containerSuffix === 'Base' ? `trackerBase${demoNum}` : `trackerResultado${demoNum}`;
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        if (containerSuffix !== 'Base' && array.length === 0) {
            container.innerHTML = '<span class="opacity-50 small">Ningún elemento coincide.</span>';
            return;
        }

        array.forEach((item, idx) => {
            const span = document.createElement('span');
            const isResult = containerSuffix !== 'Base';
            let colorClass = isResult ? (colorOverride || 'bg-primary') : 'bg-secondary opacity-75';
            
            // Special case for demo 3 original
            if (demoNum === 3 && containerSuffix === 'Base') {
                colorClass = item.activo ? 'bg-success' : 'bg-danger';
                span.style.cursor = 'pointer';
                span.title = "Clic para cambiar estado";
                span.addEventListener('click', () => {
                    item.activo = !item.activo;
                    renderArray(3, state3, 'Base');
                });
            }

            span.className = `badge ${colorClass} elemento-array mb-2 ${isResult ? 'anim-fade-in' : ''}`;
            span.textContent = typeof item === 'object' ? item.nombre : item;
            span.id = `d${demoNum}-${containerSuffix}-${idx}`;
            container.appendChild(span);
        });
        vincularEfectosVisuales();
    }

    function runDemo1() {
        const umbral = parseInt(document.getElementById('inputUmbral').value, 10);
        const resultado = BASES.demo1.filter(n => n > umbral);
        renderArray(1, resultado, 'Resultado', 'bg-primary');
        toggleButtons('btnFiltrarNumeros', true);
    }

    function runDemo2() {
        const minLen = parseInt(document.getElementById('selectLongitud').value, 10);
        const resultado = BASES.demo2.filter(p => p.length > minLen);
        renderArray(2, resultado, 'Resultado', 'bg-info');
        toggleButtons('btnFiltrarPalabras', true);
    }

    function runDemo3(activos = true) {
        const resultado = state3.filter(u => u.activo === activos);
        renderArray(3, resultado, 'Resultado', activos ? 'bg-success' : 'bg-danger');
        toggleButtons('btnFiltrarUsuarios', true);
    }

    function toggleButtons(prefix, disabled) {
        ['Click', 'Down'].forEach(s => {
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
        bind('btnFiltrarNumerosClick', runDemo1, 'click');
        const btn1K = document.getElementById('btnFiltrarNumerosDown');
        if (btn1K) {
            btn1K.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') runDemo1();
            });
        }

        // Demo 2
        bind('btnFiltrarPalabrasClick', runDemo2, 'click');
        const btn2K = document.getElementById('btnFiltrarPalabrasDown');
        if (btn2K) {
            btn2K.addEventListener('keydown', (e) => {
                if (e.key === ' ') {
                    e.preventDefault();
                    runDemo2();
                }
            });
        }

        // Demo 3
        bind('btnFiltrarUsuariosClick', () => runDemo3(true), 'click');
        const btn3K = document.getElementById('btnFiltrarUsuariosDown');
        if (btn3K) {
            btn3K.addEventListener('keydown', (e) => {
                if (e.key.toLowerCase() === 'f') runDemo3(false);
            });
        }

        // Reinicio
        document.querySelectorAll('.btn-reiniciar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demo = e.target.getAttribute('data-demo');
                const prefix = demo === '1' ? 'btnFiltrarNumeros' : (demo === '2' ? 'btnFiltrarPalabras' : 'btnFiltrarUsuarios');
                toggleButtons(prefix, false);
                document.getElementById(`trackerResultado${demo}`).innerHTML = '<span class="opacity-50">Esperando filtro...</span>';
                if (demo === '3') {
                    state3 = JSON.parse(JSON.stringify(BASES.demo3));
                    renderArray(3, state3, 'Base');
                }
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
    renderArray(3, state3);
    vincularEfectosVisuales();
});
