/**
 * Ejercicio 1: Método push()
 * Este script demuestra cómo agregar elementos al final de un array.
 */
document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ESTADO DE LA APLICACIÓN (STATE)
    // Definimos los datos iniciales que se mostrarán en la interfaz
    // ==========================================
    const INITIAL_AMIGOS = ['Carlos', 'Lucía', 'Martín'];
    const INITIAL_NUMEROS = [3, 7, 12];
    
    let state = {
        frutas: [],
        amigos: [...INITIAL_AMIGOS],
        numeros: [...INITIAL_NUMEROS]
    };

    // ==========================================
    // CONFIGURACIÓN DE UI
    // Identificadores de los contenedores donde se mostrarán los arrays
    // ==========================================
    const trackers = {
        frutas: { id: 'trackerFrutas', color: 'bg-primary' },
        amigos: { id: 'trackerAmigos', color: 'bg-info text-dark' },
        numeros: { id: 'trackerNumeros', color: 'bg-success' }
    };

    // ==========================================
    // FUNCIONES ATÓMICAS (LOGIC & UI)
    // ==========================================

    /**
     * Dibuja el contenido de los arrays en el HTML
     */
    function renderArray(key) {
        const { id, color } = trackers[key];
        const container = document.getElementById(id);
        const data = state[key];
        
        container.innerHTML = '';

        // Si el array está vacío, mostramos un mensaje
        if (data.length === 0) {
            container.innerHTML = '<span class="badge bg-secondary opacity-50">Array vacío [ ]</span>';
            return;
        }

        // Creamos un elemento visual (badge) por cada item en el array
        data.forEach(item => {
            const span = document.createElement('span');
            span.className = `badge ${color} elemento-array`;
            span.textContent = item;
            container.appendChild(span);
        });
        
        // Re-vincular efectos visuales a nuevos elementos
        vincularEfectosVisuales();
    }

    /**
     * Agrega una fruta al final del array usando .push()
     */
    function pushFruta() {
        const select = document.getElementById('selectFruta');
        const icono = select.value;
        const nombre = select.options[select.selectedIndex].text.split(' ')[1];
        
        // El método .push() añade el elemento al final
        state.frutas.push(`${icono} ${nombre}`);
        renderArray('frutas');
    }

    /**
     * Agrega un amigo al final del array validando duplicados
     */
    function pushAmigo() {
        const input = document.getElementById('inputAmigo');
        const nombre = input.value.trim();
        
        // Validamos que no esté vacío y no sea duplicado
        if (!nombre || isDuplicate(nombre, state.amigos)) {
            animateError(input);
            return;
        }

        // Agregamos con .push()
        state.amigos.push(nombre);
        input.value = '';
        validateAmigoInput();
        renderArray('amigos');
        input.focus();
    }

    /**
     * Agrega un número al final si es mayor al último elemento
     */
    function pushNumero() {
        const input = document.getElementById('inputNumero');
        const val = parseInt(input.value, 10);
        const ultimo = state.numeros[state.numeros.length - 1] || 0;

        // Regla: solo números mayores al último
        if (isNaN(val) || val <= ultimo) {
            animateError(input);
            return;
        }

        // Agregamos con .push()
        state.numeros.push(val);
        input.value = '';
        updateNumeroPreview();
        renderArray('numeros');
    }

    // --- Funciones de apoyo (Helpers) ---

    // Comprueba si un valor ya existe en el array
    const isDuplicate = (val, arr) => arr.some(item => item.toLowerCase() === val.toLowerCase());

    // Animación visual de error (sacudida)
    function animateError(el) {
        el.classList.remove('shake-animation');
        void el.offsetWidth; // Forzar reinicio de animación
        el.classList.add('shake-animation');
    }

    // Controla si los botones de agregar amigo deben estar habilitados
    function validateAmigoInput() {
        const input = document.getElementById('inputAmigo');
        const val = input.value.trim();
        const alert = document.getElementById('alertaDuplicado');
        const btns = [
            document.getElementById('btnAgregarAmigoClick'),
            document.getElementById('btnAgregarAmigoContext')
        ];

        const duplicate = isDuplicate(val, state.amigos);
        const empty = val === '';

        btns.forEach(btn => btn.classList.toggle('disabled', duplicate || empty));
        alert.classList.toggle('d-none', !duplicate);
    }

    // Muestra una vista previa de si el número ingresado es válido
    function updateNumeroPreview() {
        const input = document.getElementById('inputNumero');
        const preview = document.getElementById('previaCondicion');
        const val = parseInt(input.value, 10);
        const ultimo = state.numeros[state.numeros.length - 1] || 0;

        const btns = [
            document.getElementById('btnAgregarNumeroClick'),
            document.getElementById('btnAgregarNumeroContext')
        ];

        if (isNaN(val)) {
            preview.textContent = '';
            btns.forEach(btn => btn.disabled = true);
            return;
        }

        const valid = val > ultimo;
        preview.textContent = `¿Es ${val} > ${ultimo}? ${valid ? '✓ Sí' : '✗ No'}`;
        preview.className = `${valid ? 'text-success' : 'text-danger'} small fw-bold`;
        btns.forEach(btn => btn.disabled = !valid);
    }

    // ==========================================
    // ASIGNACIÓN DE EVENTOS (HANDLERS)
    // Configuramos los clics, menús contextuales e inputs
    // ==========================================

    function setupEvents() {
        const setupDemo = (btnClick, btnContext, action) => {
            const bc = document.getElementById(btnClick);
            const ctx = document.getElementById(btnContext);

            // Evento Click normal
            bc.addEventListener('click', action);
            // Evento Context Menu (Click derecho)
            ctx.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                action();
            });
        };

        setupDemo('btnPushClick', 'btnPushContext', pushFruta);
        setupDemo('btnAgregarAmigoClick', 'btnAgregarAmigoContext', pushAmigo);
        setupDemo('btnAgregarNumeroClick', 'btnAgregarNumeroContext', pushNumero);

        // Eventos de entrada de texto
        document.getElementById('inputAmigo').addEventListener('input', validateAmigoInput);
        document.getElementById('inputNumero').addEventListener('input', updateNumeroPreview);

        // Botones de Reiniciar para volver al estado inicial
        document.querySelectorAll('.btn-reiniciar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demo = e.target.getAttribute('data-demo');
                if (demo === '1') state.frutas = [];
                if (demo === '2') state.amigos = [...INITIAL_AMIGOS];
                if (demo === '3') state.numeros = [...INITIAL_NUMEROS];
                
                const keys = ['frutas', 'amigos', 'numeros'];
                renderArray(keys[demo - 1]);
                if (demo === '2') validateAmigoInput();
                if (demo === '3') updateNumeroPreview();
            });
        });

        // Cierre automático del menú en móviles
        document.querySelectorAll('.nav-link-auto-close').forEach(link => {
            link.addEventListener('click', () => {
                const menu = document.getElementById('navbarNav');
                if (menu.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(menu).hide();
                }
            });
        });
    }

    // ==========================================
    // ESTÉTICA Y MICRO-INTERACCIONES
    // Efectos de escala al pasar el mouse
    // ==========================================
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

    // --- Inicialización de la Aplicación ---
    setupEvents();
    renderArray('frutas');
    renderArray('amigos');
    renderArray('numeros');
});

