document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ESTADO DE LA APLICACIÓN
    // ==========================================
    const BASES = {
        demo1: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        demo2: [10, 20, 30, 40, 50, 60, 70, 80]
    };
    
    let trabajo = {
        demo1: [...BASES.demo1],
        demo2: [...BASES.demo2]
    };

    // ==========================================
    // FUNCIONES ATÓMICAS (LOGIC & UI)
    // ==========================================

    function renderArray(demoNum, array, containerSuffix = 'Base') {
        const containerId = containerSuffix === 'Base' ? `trackerBase${demoNum}` : `trackerResultado${demoNum}`;
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        array.forEach((item, idx) => {
            const span = document.createElement('span');
            span.className = 'badge bg-secondary opacity-75 elemento-array mb-2 anim-fade-in';
            span.textContent = item;
            span.id = `d${demoNum}-${containerSuffix}-${idx}`;
            container.appendChild(span);
        });
        vincularEfectosVisuales();
    }

    function runReverseLetras() {
        trabajo.demo1.reverse();
        renderArray(1, trabajo.demo1);
        toggleButtons('btnReverseLetras', true);
    }

    function runReverseNum() {
        trabajo.demo2.reverse();
        renderArray(2, trabajo.demo2);
        toggleButtons('btnReverseNum', true);
    }

    function runReverseStr() {
        const str = document.getElementById('inputString').value;
        const reversed = str.split('').reverse().join('');
        const display = document.getElementById('trackerResultado3');
        display.textContent = reversed;
        validateDemo3();
    }

    function toggleButtons(prefix, disabled) {
        ['Dbl', 'Down'].forEach(s => {
            const btn = document.getElementById(`${prefix}${s}`);
            if (btn) btn.disabled = disabled;
        });
    }

    function validateDemo3() {
        const val = document.getElementById('inputString').value.trim();
        toggleButtons('btnReverseStr', val === '');
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
        bind('btnReverseLetrasDbl', runReverseLetras, 'dblclick');
        bind('btnReverseLetrasDown', runReverseLetras, 'mousedown');

        // Demo 2
        bind('btnReverseNumDbl', runReverseNum, 'dblclick');
        bind('btnReverseNumDown', runReverseNum, 'mousedown');

        // Demo 3
        bind('btnReverseStrDbl', runReverseStr, 'dblclick');
        bind('btnReverseStrDown', runReverseStr, 'mousedown');
        
        const inputString = document.getElementById('inputString');
        if (inputString) {
            inputString.addEventListener('input', () => {
                validateDemo3();
                toggleButtons('btnReverseStr', false);
            });
            validateDemo3();
        }

        // Reinicio
        document.querySelectorAll('.btn-reiniciar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demoNum = e.target.getAttribute('data-demo');
                const prefix = demoNum === '1' ? 'btnReverseLetras' : (demoNum === '2' ? 'btnReverseNum' : 'btnReverseStr');
                toggleButtons(prefix, false);
                if (demoNum === '1') { 
                    trabajo.demo1 = [...BASES.demo1]; 
                    renderArray(1, trabajo.demo1);
                }
                else if (demoNum === '2') { 
                    trabajo.demo2 = [...BASES.demo2]; 
                    renderArray(2, trabajo.demo2); 
                }
                else if (demoNum === '3') {
                    document.getElementById('inputString').value = 'Anita lava la tina';
                    document.getElementById('trackerResultado3').textContent = '...';
                    validateDemo3();
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
    renderArray(1, trabajo.demo1);
    renderArray(2, trabajo.demo2);
    vincularEfectosVisuales();
});
