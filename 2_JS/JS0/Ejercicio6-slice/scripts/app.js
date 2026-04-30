document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ESTADOS INMUTABLES (BASE)
    // ==========================================
    const BASES = {
        demo1: [10, 20, 30, 40, 50, 60, 70],
        demo2: ['Titanic', 'Matrix', 'Inception', 'Interstellar', 'Avatar', 'Dune'],
        demo3: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    };

    // ==========================================
    // FUNCIONES ATÓMICAS (LOGIC & UI)
    // ==========================================

    function renderOriginal(demoNum) {
        const container = document.getElementById(`trackerOriginal${demoNum}`);
        if (!container) return;
        container.innerHTML = '';
        const data = BASES[`demo${demoNum}`];

        data.forEach((item, idx) => {
            const span = document.createElement('span');
            span.className = 'badge bg-secondary opacity-75 elemento-array';
            span.textContent = item;
            span.id = `orig${demoNum}-${idx}`;
            container.appendChild(span);
        });
    }

    function renderResultado(demoNum, array) {
        const container = document.getElementById(`trackerResultado${demoNum}`);
        if (!container) return;
        container.innerHTML = '';

        if (array.length === 0) {
            container.innerHTML = '<span class="badge bg-secondary opacity-50">Array vacío [ ]</span>';
            return;
        }

        array.forEach((item, idx) => {
            const span = document.createElement('span');
            span.className = 'badge bg-primary elemento-array anim-fade-in';
            span.textContent = item;
            span.style.animationDelay = `${idx * 50}ms`;
            container.appendChild(span);
        });
        vincularEfectosVisuales();
    }

    function highlightPreview(demoNum, start, end) {
        const data = BASES[`demo${demoNum}`];
        data.forEach((_, i) => {
            const el = document.getElementById(`orig${demoNum}-${i}`);
            if (el) el.classList.toggle('highlight-preview', i >= start && i < end);
        });
    }

    function ejecutarSlice(demoNum, start, end) {
        const array = BASES[`demo${demoNum}`].slice(start, end);
        renderResultado(demoNum, array);
        
        const status = document.querySelector(`#demo${demoNum} .estado-operacion`);
        if (status) status.textContent = `Operación exitosa: slice(${start}, ${end})`;
    }

    function handleDemo1(e) {
        if (e) e.preventDefault();
        highlightPreview(1, 0, 3);
        ejecutarSlice(1, 0, 3);
    }

    function handleDemo2(e) {
        if (e) e.preventDefault();
        const desde = parseInt(document.getElementById('inputDesde').value, 10);
        const hasta = parseInt(document.getElementById('inputHasta').value, 10);
        
        if (isNaN(desde) || isNaN(hasta) || desde >= hasta || desde < 0) {
            animateError(document.getElementById('formRango'));
            return;
        }
        
        highlightPreview(2, desde, hasta);
        ejecutarSlice(2, desde, hasta);
    }

    function handleDemo3(e) {
        if (e) e.preventDefault();
        const len = BASES.demo3.length;
        highlightPreview(3, len - 3, len);
        ejecutarSlice(3, -3);
    }

    function animateError(el) {
        el.classList.remove('shake-animation');
        void el.offsetWidth;
        el.classList.add('shake-animation');
    }

    function validateRango() {
        const desde = parseInt(document.getElementById('inputDesde').value, 10);
        const hasta = parseInt(document.getElementById('inputHasta').value, 10);
        const btns = ['btnCopiarRangoClick', 'btnCopiarRangoContext'].map(id => document.getElementById(id));
        const invalid = isNaN(desde) || isNaN(hasta) || desde >= hasta || desde < 0 || hasta > BASES.demo2.length;
        btns.forEach(btn => { if (btn) btn.disabled = invalid; });
    }

    // ==========================================
    // ASIGNACIÓN DE EVENTOS (HANDLERS)
    // ==========================================

    function setupEvents() {
        const bindEvents = (demoNum, prefix, action) => {
            const btnClick = document.getElementById(`${prefix}Click`);
            const btnContext = document.getElementById(`${prefix}Context`);
            const btnSubmit = document.getElementById(`${prefix}Submit`);

            if (btnClick) btnClick.addEventListener('click', action);
            if (btnSubmit) btnSubmit.addEventListener('click', action); // Form handles its own submit below
            if (btnContext) btnContext.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                action();
            });
        };

        bindEvents(1, 'btnCopiarPrimeros', handleDemo1);
        
        const form2 = document.getElementById('formRango');
        if (form2) form2.addEventListener('submit', handleDemo2);
        bindEvents(2, 'btnCopiarRango', handleDemo2);
        
        ['inputDesde', 'inputHasta'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', validateRango);
        });
        validateRango();

        bindEvents(3, 'btnCopiarUltimos', handleDemo3);

        // Reinicio
        document.querySelectorAll('.btn-reiniciar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demo = e.target.getAttribute('data-demo');
                renderOriginal(demo);
                const resContainer = document.getElementById(`trackerResultado${demo}`);
                if (resContainer) resContainer.innerHTML = '<span class="badge bg-secondary opacity-50">Esperando acción...</span>';
                highlightPreview(demo, -1, -1);
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
    [1, 2, 3].forEach(renderOriginal);
    vincularEfectosVisuales();
});
