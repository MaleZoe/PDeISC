/**
 * Ejercicio 14: Método reverse()
 * Este script demuestra cómo INVERTIR el orden de los elementos de un array.
 * El primer elemento pasa a ser el último y viceversa.
 */
document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ESTADO DE LA APLICACIÓN
    // ==========================================
    const BASES = {
        demo1: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        demo2: [10, 20, 30, 40, 50, 60, 70, 80]
    };
    
    // Copias de trabajo para manipular el orden
    let trabajo = {
        demo1: [...BASES.demo1],
        demo2: [...BASES.demo2]
    };

    // ==========================================
    // FUNCIONES ATÓMICAS (LOGIC & UI)
    // ==========================================

    /**
     * Dibuja el array en la interfaz
     */
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

    /**
     * Demo 1: Invertir letras
     */
    function runReverseLetras() {
        // EL MÉTODO CLAVE: .reverse() invierte el array original
        trabajo.demo1.reverse();
        renderArray(1, trabajo.demo1);
        toggleButtons('btnReverseLetras', true);
    }

    /**
     * Demo 2: Invertir números
     */
    function runReverseNum() {
        trabajo.demo2.reverse();
        renderArray(2, trabajo.demo2);
        toggleButtons('btnReverseNum', true);
    }

    /**
     * Demo 3: Invertir un string (usando split + reverse + join)
     */
    function runReverseStr() {
        const str = document.getElementById('inputString').value;
        // Técnica común: convertir string a array, invertir, y volver a unir
        const reversed = str.split('').reverse().join('');
        const display = document.getElementById('trackerResultado3');
        display.textContent = reversed;
        validateDemo3();
    }

    // Utilidad de UI
    function toggleButtons(prefix, disabled) {
        ['Click', 'Hover', 'Dbl'].forEach(s => {
            const btn = document.getElementById(`${prefix}${s}`);
            if (btn) btn.disabled = disabled;
        });
    }

    // Validación del input de texto
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

        // Eventos
        
        // Demo 1
        bind('btnReverseLetrasClick', runReverseLetras, 'click');
        bind('btnReverseLetrasHover', runReverseLetras, 'mouseenter');
        bind('btnReverseLetrasDbl', runReverseLetras, 'dblclick');

        // Demo 2
        bind('btnReverseNumClick', runReverseNum, 'click');
        bind('btnReverseNumHover', runReverseNum, 'mouseenter');
        bind('btnReverseNumDbl', runReverseNum, 'dblclick');

        // Demo 3
        bind('btnReverseStrClick', runReverseStr, 'click');
        bind('btnReverseStrHover', runReverseStr, 'mouseenter');
        bind('btnReverseStrDbl', runReverseStr, 'dblclick');
        
        const inputString = document.getElementById('inputString');
        if (inputString) {
            inputString.addEventListener('input', () => {
                validateDemo3();
                toggleButtons('btnReverseStr', false);
            });
            validateDemo3();
        }

        // Botones de Reiniciar
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
    renderArray(1, trabajo.demo1);
    renderArray(2, trabajo.demo2);
    vincularEfectosVisuales();
});

