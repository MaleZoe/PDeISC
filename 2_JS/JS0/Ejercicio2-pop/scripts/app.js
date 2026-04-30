/**
 * Ejercicio 2: Método pop()
 * Este script muestra cómo eliminar el ÚLTIMO elemento de un array.
 */
document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ESTADO DE LA APLICACIÓN
    // Datos iniciales para las demostraciones
    // ==========================================
    const INITIAL_ANIMALES = ['🐶 Perro', '🐱 Gato', '🐦 Pájaro', '🐟 Pez', '🐰 Conejo'];
    const INITIAL_COMPRAS = ['🥛 Leche', '🥖 Pan', '🥚 Huevos', '🧈 Manteca', '🧀 Queso'];
    const INITIAL_LETRAS = ['A', 'B', 'C', 'D', 'E'];

    let state = {
        animales: [...INITIAL_ANIMALES],
        compras: [...INITIAL_COMPRAS],
        letras: [...INITIAL_LETRAS]
    };

    // Configuración visual para cada contenedor
    const trackers = {
        animales: { id: 'trackerAnimales', color: 'bg-info text-dark' },
        compras: { id: 'trackerCompras', color: 'bg-warning text-dark' },
        letras: { id: 'trackerLetras', color: 'bg-primary' }
    };

    // ==========================================
    // FUNCIONES ATÓMICAS (LOGIC & UI)
    // ==========================================

    /**
     * Dibuja los elementos del array en la pantalla
     */
    function renderArray(key) {
        const { id, color } = trackers[key];
        const container = document.getElementById(id);
        container.innerHTML = '';

        // Si no hay elementos, mostramos mensaje de array vacío
        if (state[key].length === 0) {
            container.innerHTML = '<span class="badge bg-secondary opacity-50">Array vacío [ ]</span>';
            return;
        }

        // Creamos cada elemento visualmente
        state[key].forEach((item, index) => {
            const span = document.createElement('span');
            span.className = `badge ${color} elemento-array`;
            span.textContent = item;
            span.id = `${id}-item-${index}`; // ID único para animaciones
            container.appendChild(span);
        });
        
        vincularEfectosVisuales();
    }

    /**
     * Ejecuta el método .pop() con una pequeña animación de salida
     */
    async function performPop(key, count = 1) {
        if (state[key].length === 0) return;

        for (let i = 0; i < count && state[key].length > 0; i++) {
            const lastIndex = state[key].length - 1;
            const elementDOM = document.getElementById(`${trackers[key].id}-item-${lastIndex}`);

            // Animación antes de eliminar
            if (elementDOM) {
                elementDOM.classList.add('anim-pop-out');
                await new Promise(r => {
                    const handler = () => {
                        elementDOM.removeEventListener('transitionend', handler);
                        r();
                    };
                    elementDOM.addEventListener('transitionend', handler);
                    setTimeout(handler, 400); // Respaldo por si falla el evento
                });
            }

            // EL MÉTODO CLAVE: .pop() elimina el último elemento y lo devuelve
            const removed = state[key].pop();
            handlePostPop(key, removed);
            renderArray(key);
        }
    }

    // Acciones adicionales después de eliminar un elemento
    function handlePostPop(key, removed) {
        if (key === 'animales') {
            toggleButtons('animales', state.animales.length === 0);
        } else if (key === 'compras') {
            toggleButtons('compras', state.compras.length === 0);
        } else if (key === 'letras') {
            if (state.letras.length === 0) {
                // Efecto de confeti si se vacía la Demo 3
                const confetti = document.getElementById('confettiContainer');
                confetti.classList.remove('d-none');
                toggleButtons('letras', true);
            }
        }
    }

    // Deshabilita botones si ya no hay nada que eliminar
    function toggleButtons(key, disabled) {
        const suffixes = ['Dbl', 'Down'];
        const prefix = key === 'animales' ? 'btnEliminarAnimal' : key === 'compras' ? 'btnQuitarCompra' : 'btnVaciar';
        suffixes.forEach(s => {
            const btn = document.getElementById(`${prefix}${s}`);
            if (btn) btn.disabled = disabled;
        });
    }

    // ==========================================
    // ASIGNACIÓN DE EVENTOS (HANDLERS)
    // ==========================================

    function setupEvents() {
        const bindEvents = (key, prefix, count = 1) => {
            const dbl = document.getElementById(`${prefix}Dbl`);
            const down = document.getElementById(`${prefix}Down`);

            // Demo con Doble Click
            if (dbl) dbl.addEventListener('dblclick', () => performPop(key, count));
            // Demo con Mouse Down (presionar botón)
            if (down) down.addEventListener('mousedown', () => performPop(key, count));
        };

        bindEvents('animales', 'btnEliminarAnimal');
        bindEvents('compras', 'btnQuitarCompra');
        bindEvents('letras', 'btnVaciar');

        // Lógica especial para vaciar todo el array secuencialmente
        const vaciarTodo = async () => {
            if (state.letras.length === 0) return;
            while(state.letras.length > 0) {
                await performPop('letras', 1);
                await new Promise(r => setTimeout(r, 50));
            }
        };

        // Reconfiguramos los botones de la Demo 3
        ['Dbl', 'Down'].forEach(s => {
            const btn = document.getElementById(`btnVaciar${s}`);
            btn.replaceWith(btn.cloneNode(true));
            const newBtn = document.getElementById(`btnVaciar${s}`);
            const eventType = s === 'Dbl' ? 'dblclick' : 'mousedown';
            newBtn.addEventListener(eventType, vaciarTodo);
        });

        // Botones de Reiniciar para restaurar los arrays originales
        document.querySelectorAll('.btn-reiniciar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demo = e.target.getAttribute('data-demo');
                const keys = ['animales', 'compras', 'letras'];
                const key = keys[demo - 1];
                
                state[key] = [...(key === 'animales' ? INITIAL_ANIMALES : key === 'compras' ? INITIAL_COMPRAS : INITIAL_LETRAS)];
                
                if (key === 'animales') document.getElementById('mensajeAnimal').textContent = '';
                if (key === 'compras') document.getElementById('toastCompra').classList.add('d-none');
                if (key === 'letras') document.getElementById('confettiContainer').classList.add('d-none');
                
                toggleButtons(key, false);
                renderArray(key);
            });
        });

        // Autocierre del menú navegación
        document.querySelectorAll('.nav-link-auto-close').forEach(link => {
            link.addEventListener('click', () => {
                const menu = document.getElementById('navbarNav');
                if (menu.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(menu);
                    if (bsCollapse) bsCollapse.hide();
                }
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
    renderArray('animales');
    renderArray('compras');
    renderArray('letras');
});


