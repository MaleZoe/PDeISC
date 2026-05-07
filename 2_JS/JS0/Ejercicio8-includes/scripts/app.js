/**
 * Ejercicio 8: Método includes()
 * Este script demuestra cómo comprobar si un array contiene un elemento determinado.
 * Devuelve true si existe y false si no.
 */
document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ESTADO DE LA APLICACIÓN
    // ==========================================
    const BASES = {
        demo1: ['usuario', 'editor', 'admin', 'moderador', 'invitado'],
        demo2: ['rojo', 'azul', 'amarillo', 'verde', 'naranja', 'violeta']
    };
    const INITIAL_3 = [10, 25, 40, 55];
    let state3 = [...INITIAL_3];

    // ==========================================
    // FUNCIONES ATÓMICAS (LOGIC & UI)
    // ==========================================

    /**
     * Dibuja los elementos del array en la interfaz
     */
    function renderArray(demoNum, array) {
        const container = document.getElementById(`trackerBase${demoNum}`);
        if (!container) return;
        container.innerHTML = '';
        array.forEach((item, idx) => {
            const span = document.createElement('span');
            span.className = 'badge bg-secondary opacity-75 elemento-array';
            span.textContent = item;
            span.id = `d${demoNum}-${idx}`;
            container.appendChild(span);
        });
        vincularEfectosVisuales();
    }

    // Resetea los colores de los elementos
    function resetHighlights(demoNum, length) {
        for (let i = 0; i < length; i++) {
            const el = document.getElementById(`d${demoNum}-${i}`);
            if (el) {
                el.classList.remove('bg-primary', 'bg-info', 'bg-success', 'bg-danger', 'bg-warning', 'opacity-100');
                el.classList.add('bg-secondary', 'opacity-75');
            }
        }
    }

    // Resalta un elemento específico
    function highlightElement(demoNum, index, colorClass) {
        const el = document.getElementById(`d${demoNum}-${index}`);
        if (el) {
            el.classList.remove('bg-secondary', 'opacity-75');
            el.classList.add(colorClass, 'opacity-100');
            el.style.transform = 'scale(1.1)';
            setTimeout(() => el.style.transform = 'scale(1)', 300);
        }
    }

    /**
     * Demo 1: Verificar si el rol 'admin' está en la lista
     */
    function runDemo1() {
        resetHighlights(1, BASES.demo1.length);
        // EL MÉTODO CLAVE: .includes() devuelve true o false
        const exists = BASES.demo1.includes('admin');
        const panel = document.getElementById('resPanel1');
        
        if (exists) {
            highlightElement(1, BASES.demo1.indexOf('admin'), 'bg-primary');
            panel.textContent = 'TRUE';
            panel.className = 'display-6 fw-bold text-primary anim-fade-in';
        } else {
            panel.textContent = 'FALSE';
            panel.className = 'display-6 fw-bold text-danger anim-fade-in';
        }
        toggleButtons('btnVerificarAdmin', true);
    }

    /**
     * Demo 2: Verificar colores específicos
     */
    function runDemo2(color, resId, colorClass, btnPrefix) {
        resetHighlights(2, BASES.demo2.length);
        // Verificamos si el color buscado está incluido
        const exists = BASES.demo2.includes(color);
        const resDiv = document.getElementById(resId);
        
        if (exists) {
            highlightElement(2, BASES.demo2.indexOf(color), colorClass);
            resDiv.textContent = 'TRUE';
            resDiv.className = 'fw-bold text-primary anim-fade-in';
        } else {
            resDiv.textContent = 'FALSE';
            resDiv.className = 'fw-bold text-danger anim-fade-in';
        }
        toggleButtons(btnPrefix, true);
    }

    /**
     * Demo 3: Usar .includes() para evitar duplicados en un input
     */
    function runDemo3(e) {
        if (e) e.preventDefault();
        const input = document.getElementById('inputNumero');
        const val = parseInt(input.value, 10);
        if (isNaN(val)) return;

        // EL MÉTODO CLAVE: Evitamos agregar el número si ya está en el array
        const exists = state3.includes(val);
        const panel = document.getElementById('resPanel3');

        if (exists) {
            resetHighlights(3, state3.length);
            highlightElement(3, state3.indexOf(val), 'bg-warning');
            panel.innerHTML = `<span class="text-danger fw-bold">TRUE (Ya existe). No se agrega.</span>`;
            animateError(input);
        } else {
            state3.push(val);
            renderArray(3, state3);
            highlightElement(3, state3.length - 1, 'bg-success');
            panel.innerHTML = `<span class="text-success fw-bold">FALSE (No existe). ¡Agregado!</span>`;
            validateDemo3();
        }
    }

    // Utilidad para habilitar/deshabilitar botones
    function toggleButtons(prefix, disabled) {
        ['Click', 'Hover', 'Dbl'].forEach(s => {
            const btn = document.getElementById(`${prefix}${s}`);
            if (btn) btn.disabled = disabled;
        });
    }

    // Validación del input numérico
    function validateDemo3() {
        const val = parseInt(document.getElementById('inputNumero').value, 10);
        toggleButtons('btnValidarAgregar', isNaN(val));
    }

    // Animación de error visual
    function animateError(el) {
        el.classList.remove('shake-animation');
        void el.offsetWidth;
        el.classList.add('shake-animation');
    }

    // ==========================================
    // ASIGNACIÓN DE EVENTOS (HANDLERS)
    // ==========================================

    function setupEvents() {
        const bind = (id, action, type) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener(type, (e) => {
                if (type === 'contextmenu') e.preventDefault();
                action(e);
            });
        };

        // Eventos Demo 1
        bind('btnVerificarAdminClick', runDemo1, 'click');
        bind('btnVerificarAdminHover', runDemo1, 'mouseenter');
        bind('btnVerificarAdminDbl', runDemo1, 'dblclick');

        // Eventos Demo 2
        ['Verde', 'Rosa'].forEach(c => {
            const color = c.toLowerCase();
            const resId = `res${c}`;
            const cls = color === 'verde' ? 'bg-info' : 'bg-danger';
            const prefix = `btnExiste${c}`;
            bind(`${prefix}Click`, () => runDemo2(color, resId, cls, prefix), 'click');
            bind(`${prefix}Hover`, () => runDemo2(color, resId, cls, prefix), 'mouseenter');
            bind(`${prefix}Dbl`, () => runDemo2(color, resId, cls, prefix), 'dblclick');
        });

        // Eventos Demo 3
        const form = document.getElementById('formValidar');
        if (form) form.addEventListener('submit', (e) => e.preventDefault());
        
        const input = document.getElementById('inputNumero');
        if (input) {
            input.addEventListener('input', validateDemo3);
            validateDemo3();
        }
        
        bind('btnValidarAgregarClick', runDemo3, 'click');
        bind('btnValidarAgregarHover', runDemo3, 'mouseenter');
        bind('btnValidarAgregarDbl', runDemo3, 'dblclick');

        // Botones de Reiniciar
        document.querySelectorAll('.btn-reiniciar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demo = e.target.getAttribute('data-demo');
                if (demo === '1') {
                    resetHighlights(1, BASES.demo1.length);
                    document.getElementById('resPanel1').innerHTML = '<span class="opacity-50">Esperando consulta...</span>';
                    toggleButtons('btnVerificarAdmin', false);
                } else if (demo === '2') {
                    resetHighlights(2, BASES.demo2.length);
                    document.getElementById('resVerde').textContent = '-';
                    document.getElementById('resRosa').textContent = '-';
                    toggleButtons('btnExisteVerde', false);
                    toggleButtons('btnExisteRosa', false);
                } else if (demo === '3') {
                    state3 = [...INITIAL_3];
                    renderArray(3, state3);
                    document.getElementById('resPanel3').innerHTML = '<span class="text-muted">Ingresa un número para validar.</span>';
                    document.getElementById('inputNumero').value = '10';
                    validateDemo3();
                }
            });
        });

        // Autocierre de menú móvil
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
    renderArray(1, BASES.demo1);
    renderArray(2, BASES.demo2);
    renderArray(3, state3);
    vincularEfectosVisuales();
});

