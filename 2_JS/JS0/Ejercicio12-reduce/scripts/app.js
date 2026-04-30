/**
 * Ejercicio 12: Método reduce()
 * Este script demuestra cómo REDUCIR un array a un único valor
 * (por ejemplo, una suma total) procesando cada elemento.
 */
document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ESTADO DE LA APLICACIÓN
    // ==========================================
    const BASES = {
        demo1: [12, 8, 25, 3, 17, 42, 9],
        demo2: [2, 3, 4, 5, 2],
        demo3: [
            {producto: 'Laptop', precio: 1200},
            {producto: 'Mouse', precio: 35},
            {producto: 'Teclado', precio: 85},
            {producto: 'Monitor', precio: 450},
            {producto: 'Auriculares', precio: 120}
        ]
    };

    // Control de animaciones activas
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
        array.forEach((item, idx) => {
            const span = document.createElement('span');
            span.className = 'badge bg-secondary opacity-75 elemento-array mb-2';
            span.textContent = typeof item === 'object' ? `${item.producto} ($${item.precio})` : item;
            span.id = `d${demoNum}-${idx}`;
            container.appendChild(span);
        });
        vincularEfectosVisuales();
    }

    // Pausa temporal
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    /**
     * Demo 1: Sumar todos los números
     */
    async function runDemo1() {
        if (isAnimating[1]) return;
        isAnimating[1] = true;
        toggleButtons('btnSumarTodo', true);
        const display = document.getElementById('trackerResultado1');
        let total = 0;

        // Simulamos el funcionamiento de .reduce((acumulador, actual) => acumulador + actual, 0)
        for (let i = 0; i < BASES.demo1.length; i++) {
            if (!isAnimating[1]) break;
            const trackerEl = document.getElementById(`d1-${i}`);
            trackerEl.classList.replace('bg-secondary', 'bg-primary');
            trackerEl.classList.replace('opacity-75', 'opacity-100');

            total += BASES.demo1[i];
            display.textContent = total;
            
            await sleep(400);
            trackerEl.classList.replace('bg-primary', 'bg-secondary');
            trackerEl.classList.replace('opacity-100', 'opacity-75');
        }
        isAnimating[1] = false;
    }

    /**
     * Demo 2: Multiplicar todos los números (con valor inicial)
     */
    async function runDemo2() {
        if (isAnimating[2]) return;
        isAnimating[2] = true;
        toggleButtons('btnMultiplicarTodo', true);
        const display = document.getElementById('trackerResultado2');
        const inputVal = parseFloat(document.getElementById('inputInicial').value);
        // Valor acumulador inicial
        let total = isNaN(inputVal) ? 1 : inputVal;

        for (let i = 0; i < BASES.demo2.length; i++) {
            if (!isAnimating[2]) break;
            const trackerEl = document.getElementById(`d2-${i}`);
            trackerEl.classList.replace('bg-secondary', 'bg-info');
            trackerEl.classList.replace('opacity-75', 'opacity-100');

            total *= BASES.demo2[i];
            display.textContent = total;

            await sleep(400);
            trackerEl.classList.replace('bg-info', 'bg-secondary');
            trackerEl.classList.replace('opacity-100', 'opacity-75');
        }
        isAnimating[2] = false;
    }

    /**
     * Demo 3: Calcular el total de una "factura" (objetos)
     */
    async function runDemo3() {
        if (isAnimating[3]) return;
        isAnimating[3] = true;
        toggleButtons('btnCalcularTotal', true);
        const invoiceItems = document.getElementById('invoiceItems');
        const invoiceTotal = document.getElementById('invoiceTotal');
        invoiceItems.innerHTML = '';
        let total = 0;

        for (let i = 0; i < BASES.demo3.length; i++) {
            if (!isAnimating[3]) break;
            const item = BASES.demo3[i];
            const trackerEl = document.getElementById(`d3-${i}`);
            trackerEl.classList.replace('bg-secondary', 'bg-success');
            trackerEl.classList.replace('opacity-75', 'opacity-100');

            const div = document.createElement('div');
            div.className = 'd-flex justify-content-between mb-1 anim-fade-in text-light';
            div.innerHTML = `<span>${item.producto}</span> <span>$${item.precio}</span>`;
            invoiceItems.appendChild(div);

            // Sumamos el precio de cada objeto al total
            total += item.precio;
            invoiceTotal.textContent = `$${total.toFixed(2)}`;

            await sleep(500);
            trackerEl.classList.replace('bg-success', 'bg-secondary');
            trackerEl.classList.replace('opacity-100', 'opacity-75');
        }
        isAnimating[3] = false;
    }

    // Utilidad de UI
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
            if (el) el.addEventListener(type, (e) => {
                if (type === 'contextmenu') e.preventDefault();
                action();
            });
        };

        // Eventos: Doble Click (Dbl) y Mantener Presionado (Down)
        
        // Demo 1
        bind('btnSumarTodoDbl', runDemo1, 'dblclick');
        bind('btnSumarTodoDown', runDemo1, 'mousedown');

        // Demo 2
        bind('btnMultiplicarTodoDbl', runDemo2, 'dblclick');
        bind('btnMultiplicarTodoDown', runDemo2, 'mousedown');

        // Demo 3
        bind('btnCalcularTotalDbl', runDemo3, 'dblclick');
        bind('btnCalcularTotalDown', runDemo3, 'mousedown');

        // Botones de Reiniciar
        document.querySelectorAll('.btn-reiniciar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demo = e.target.getAttribute('data-demo');
                isAnimating[demo] = false;
                const prefix = demo === '1' ? 'btnSumarTodo' : (demo === '2' ? 'btnMultiplicarTodo' : 'btnCalcularTotal');
                toggleButtons(prefix, false);
                if (demo === '1') document.getElementById('trackerResultado1').textContent = '0';
                else if (demo === '2') document.getElementById('trackerResultado2').textContent = '-';
                else if (demo === '3') {
                    document.getElementById('invoiceItems').innerHTML = '<span class="opacity-50">Esperando cálculo...</span>';
                    document.getElementById('invoiceTotal').textContent = '$0.00';
                }
            });
        });

        // Autocierre del menú navegación
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
    renderArray(3, BASES.demo3);
    vincularEfectosVisuales();
});

