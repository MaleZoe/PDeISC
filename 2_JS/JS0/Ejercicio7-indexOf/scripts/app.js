document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ESTADOS INMUTABLES (BASE)
    // ==========================================
    const BASES = {
        demo1: ['gato', 'perro', 'pájaro', 'conejo', 'pez', 'hamster'],
        demo2: [15, 30, 50, 75, 90, 50, 110],
        demo3: ['Buenos Aires', 'Madrid', 'Ciudad de México', 'Lima', 'Bogotá', 'Santiago']
    };

    // ==========================================
    // FUNCIONES ATÓMICAS (LOGIC & UI)
    // ==========================================

    function renderOriginal(demoNum) {
        const container = document.getElementById(`trackerBase${demoNum}`);
        if (!container) return;
        container.innerHTML = '';
        const data = BASES[`demo${demoNum}`];

        data.forEach((item, idx) => {
            const span = document.createElement('span');
            span.className = 'badge bg-secondary opacity-75 elemento-array';
            span.innerHTML = `<sub class="opacity-50" style="font-size:0.6rem; vertical-align:super;">${idx}</sub> ${item}`;
            span.id = `d${demoNum}-${idx}`;
            container.appendChild(span);
        });
    }

    function resetHighlights(demoNum) {
        const data = BASES[`demo${demoNum}`];
        data.forEach((_, i) => {
            const el = document.getElementById(`d${demoNum}-${i}`);
            if (el) {
                el.classList.remove('bg-primary', 'bg-info', 'bg-success', 'opacity-100');
                el.classList.add('bg-secondary', 'opacity-75');
            }
        });
    }

    function highlightMatch(demoNum, index, colorClass) {
        const el = document.getElementById(`d${demoNum}-${index}`);
        if (el) {
            el.classList.remove('bg-secondary', 'opacity-75');
            el.classList.add(colorClass, 'opacity-100');
            el.style.transform = 'scale(1.15)';
            setTimeout(() => el.style.transform = 'scale(1)', 300);
        }
    }

    function buscarDemo1() {
        resetHighlights(1);
        const index = BASES.demo1.indexOf('perro');
        if (index !== -1) {
            highlightMatch(1, index, 'bg-primary');
            document.getElementById('resPanel1').textContent = `indexOf('perro') = ${index}`;
            toggleFixedButtons(1, true);
        }
    }

    function buscarDemo2() {
        resetHighlights(2);
        const idxFirst = BASES.demo2.indexOf(50);
        const idxLast = BASES.demo2.lastIndexOf(50);
        
        if (idxFirst !== -1) highlightMatch(2, idxFirst, 'bg-info');
        if (idxLast !== -1) highlightMatch(2, idxLast, 'bg-info');
        
        document.getElementById('resPanel2A').textContent = idxFirst;
        document.getElementById('resPanel2B').textContent = idxLast;
        toggleFixedButtons(2, true);
    }

    function buscarDemo3() {
        const busqueda = document.getElementById('inputCiudad').value.trim();
        if (!busqueda) return;

        resetHighlights(3);
        const index = BASES.demo3.indexOf(busqueda);
        const resPanel = document.getElementById('resPanel3');
        
        if (index === -1) {
            resPanel.textContent = `indexOf('${busqueda}') = -1 (No encontrado)`;
            resPanel.classList.add('text-danger');
        } else {
            highlightMatch(3, index, 'bg-success');
            resPanel.textContent = `indexOf('${busqueda}') = ${index}`;
            resPanel.classList.remove('text-danger');
        }
    }

    function toggleFixedButtons(demoNum, disabled) {
        const prefix = demoNum === 1 ? 'btnBuscarPerro' : 'btnBuscar50';
        ['Hover', 'Dbl'].forEach(s => {
            const btn = document.getElementById(`${prefix}${s}`);
            if (btn) btn.disabled = disabled;
        });
    }

    function validateDemo3() {
        const val = document.getElementById('inputCiudad').value.trim();
        ['Hover', 'Dbl'].forEach(s => {
            const btn = document.getElementById(`btnBuscarCiudad${s}`);
            if (btn) btn.disabled = val === '';
        });
    }

    // ==========================================
    // ASIGNACIÓN DE EVENTOS (HANDLERS)
    // ==========================================

    function setupEvents() {
        const bind = (prefix, action, events) => {
            events.forEach(ev => {
                const el = document.getElementById(`${prefix}${ev.id}`);
                if (el) el.addEventListener(ev.type, action);
            });
        };

        const events = [{id: 'Hover', type: 'mouseenter'}, {id: 'Dbl', type: 'dblclick'}];

        bind('btnBuscarPerro', buscarDemo1, events);
        bind('btnBuscar50', buscarDemo2, events);
        bind('btnBuscarCiudad', buscarDemo3, events);

        const inputCiudad = document.getElementById('inputCiudad');
        if (inputCiudad) {
            inputCiudad.addEventListener('input', validateDemo3);
            validateDemo3();
        }

        document.querySelectorAll('.btn-reiniciar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demo = e.target.getAttribute('data-demo');
                resetHighlights(demo);
                if (demo === '1') {
                    document.getElementById('resPanel1').textContent = 'Esperando búsqueda...';
                    toggleFixedButtons(1, false);
                }
                if (demo === '2') {
                    document.getElementById('resPanel2A').textContent = '-';
                    document.getElementById('resPanel2B').textContent = '-';
                    toggleFixedButtons(2, false);
                }
                if (demo === '3') {
                    document.getElementById('resPanel3').textContent = 'Esperando búsqueda...';
                    document.getElementById('inputCiudad').value = 'Madrid';
                    validateDemo3();
                }
            });
        });

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
    [1, 2, 3].forEach(renderOriginal);
    vincularEfectosVisuales();
});
