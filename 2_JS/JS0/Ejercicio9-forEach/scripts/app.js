/**
 * Ejercicio 9: Método forEach()
 * Este script demuestra cómo RECORRER un array y ejecutar una función
 * por cada uno de sus elementos.
 */
document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ESTADOS INMUTABLES (BASE)
    // Datos de ejemplo para las demostraciones
    // ==========================================
    const BASES = {
        demo1: ['Ana', 'Carlos', 'Lucía', 'Pedro', 'Sofía'],
        demo2: [4, 7, 11, 15, 22],
        demo3: [
            { nombre: 'María', edad: 28 },
            { nombre: 'Jorge', edad: 35 },
            { nombre: 'Elena', edad: 22 },
            { nombre: 'Tomás', edad: 41 }
        ]
    };

    // Control para evitar ejecuciones simultáneas de animaciones
    let isAnimating = { 1: false, 2: false, 3: false };

    // ==========================================
    // FUNCIONES ATÓMICAS (LOGIC & UI)
    // ==========================================

    /**
     * Dibuja los elementos del array en pantalla
     */
    function renderArray(demoNum, array) {
        const container = document.getElementById(`trackerBase${demoNum}`);
        if (!container) return;
        container.innerHTML = '';
        // EL MÉTODO CLAVE: .forEach() recorre cada item
        array.forEach((item, idx) => {
            const span = document.createElement('span');
            span.className = 'badge bg-secondary opacity-75 elemento-array';
            span.textContent = typeof item === 'object' ? item.nombre : item;
            span.id = `d${demoNum}-${idx}`;
            container.appendChild(span);
        });
        vincularEfectosVisuales();
    }

    // Utilidad para esperar tiempo (pausa)
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    /**
     * Demo 1: Generar saludos recorriendo el array de nombres
     */
    async function runDemo1() {
        if (isAnimating[1]) return;
        isAnimating[1] = true;
        toggleButtons('btnSaludar', true);
        const panel = document.getElementById('resPanel1');
        panel.innerHTML = '';

        // Simulamos un forEach asíncrono para ver el recorrido paso a paso
        for (let i = 0; i < BASES.demo1.length; i++) {
            if (!isAnimating[1]) break;
            const trackerEl = document.getElementById(`d1-${i}`);
            trackerEl.classList.replace('bg-secondary', 'bg-primary');
            trackerEl.classList.replace('opacity-75', 'opacity-100');

            const div = document.createElement('div');
            div.className = 'p-2 bg-primary bg-opacity-25 border border-primary border-opacity-25 rounded anim-fade-in';
            div.textContent = `👋 ¡Hola, ${BASES.demo1[i]}!`;
            panel.appendChild(div);

            await sleep(400);
            trackerEl.classList.replace('bg-primary', 'bg-secondary');
            trackerEl.classList.replace('opacity-100', 'opacity-75');
        }
        isAnimating[1] = false;
    }

    /**
     * Demo 2: Realizar cálculos matemáticos por cada elemento
     */
    async function runDemo2(mult = 2) {
        if (isAnimating[2]) return;
        isAnimating[2] = true;
        toggleButtons('btnCalcular', true);
        const panel = document.getElementById('resPanel2');
        panel.innerHTML = '';

        for (let i = 0; i < BASES.demo2.length; i++) {
            if (!isAnimating[2]) break;
            const trackerEl = document.getElementById(`d2-${i}`);
            trackerEl.classList.replace('bg-secondary', 'bg-info');
            trackerEl.classList.replace('opacity-75', 'opacity-100');

            const span = document.createElement('span');
            span.className = 'badge bg-info bg-opacity-25 border border-info border-opacity-50 text-light p-2 anim-fade-in';
            span.innerHTML = `${BASES.demo2[i]} × ${mult} = <span class="text-info fw-bold">${BASES.demo2[i] * mult}</span>`;
            panel.appendChild(span);

            await sleep(300);
            trackerEl.classList.replace('bg-info', 'bg-secondary');
            trackerEl.classList.replace('opacity-100', 'opacity-75');
        }
        isAnimating[2] = false;
    }

    /**
     * Demo 3: Mostrar tarjetas de información de objetos
     */
    async function runDemo3() {
        if (isAnimating[3]) return;
        isAnimating[3] = true;
        toggleButtons('btnMostrarPersonas', true);
        const panel = document.getElementById('resPanel3');
        panel.innerHTML = '';

        for (let i = 0; i < BASES.demo3.length; i++) {
            if (!isAnimating[3]) break;
            const obj = BASES.demo3[i];
            const trackerEl = document.getElementById(`d3-${i}`);
            trackerEl.classList.replace('bg-secondary', 'bg-success');
            trackerEl.classList.replace('opacity-75', 'opacity-100');

            const card = document.createElement('div');
            card.className = 'p-3 glass-card text-center anim-fade-in';
            card.style.minWidth = '120px';
            card.innerHTML = `
                <div class="fs-4 mb-2">👤</div>
                <div class="fw-bold text-success">${obj.nombre}</div>
                <div class="small text-muted">${obj.edad} años</div>
            `;
            panel.appendChild(card);

            await sleep(500);
            trackerEl.classList.replace('bg-success', 'bg-secondary');
            trackerEl.classList.replace('opacity-100', 'opacity-75');
        }
        isAnimating[3] = false;
    }

    // Utilidad para habilitar/deshabilitar botones
    function toggleButtons(prefix, disabled) {
        ['Click', 'Key'].forEach(s => {
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
            if (el) el.addEventListener(type, (e) => {
                if (type === 'contextmenu') e.preventDefault();
                action();
            });
        };

        // Demo 1: Eventos de Click y Tecla Enter
        bind('btnSaludarClick', runDemo1, 'click');
        const btnSaludarKey = document.getElementById('btnSaludarKey');
        if (btnSaludarKey) btnSaludarKey.addEventListener('keydown', (e) => { if (e.key === 'Enter') runDemo1(); });

        // Demo 2: Eventos de Click y Barra Espaciadora
        bind('btnCalcularClick', () => runDemo2(2), 'click');
        const btnCalcularKey = document.getElementById('btnCalcularKey');
        if (btnCalcularKey) btnCalcularKey.addEventListener('keydown', (e) => { if (e.key === ' ') { e.preventDefault(); runDemo2(3); } });

        // Demo 3: Eventos de Click y Tecla 'F'
        bind('btnMostrarPersonasClick', runDemo3, 'click');
        const btnMostrarKey = document.getElementById('btnMostrarPersonasKey');
        if (btnMostrarKey) btnMostrarKey.addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'f') runDemo3(); });

        // Botones de Reiniciar
        document.querySelectorAll('.btn-reiniciar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demo = e.target.getAttribute('data-demo');
                isAnimating[demo] = false;
                const prefix = demo === '1' ? 'btnSaludar' : (demo === '2' ? 'btnCalcular' : 'btnMostrarPersonas');
                toggleButtons(prefix, false);
                document.getElementById(`resPanel${demo}`).innerHTML = '<span class="opacity-50">Reiniciado. Esperando...</span>';
                const len = demo === '1' ? BASES.demo1.length : (demo === '2' ? BASES.demo2.length : BASES.demo3.length);
                for (let i = 0; i < len; i++) {
                    const el = document.getElementById(`d${demo}-${i}`);
                    if (el) {
                        el.classList.remove('bg-primary', 'bg-info', 'bg-success', 'opacity-100');
                        el.classList.add('bg-secondary', 'opacity-75');
                    }
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

    // Inicialización de la aplicación
    setupEvents();
    renderArray(1, BASES.demo1);
    renderArray(2, BASES.demo2);
    renderArray(3, BASES.demo3);
    vincularEfectosVisuales();
});

