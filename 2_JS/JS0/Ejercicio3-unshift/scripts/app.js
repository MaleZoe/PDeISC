/**
 * Ejercicio 3: Método unshift()
 * Este script demuestra cómo agregar elementos al INICIO de un array.
 */
document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ESTADO DE LA APLICACIÓN
    // ==========================================
    const INITIAL_TAREAS = ['Estudiar', 'Hacer ejercicio', 'Leer'];
    const INITIAL_USUARIOS = ['Ana', 'Pedro', 'Sofía'];

    let state = {
        colores: [],
        tareas: [...INITIAL_TAREAS],
        usuarios: [...INITIAL_USUARIOS],
        colorSeleccionado: { nombre: 'Rojo', hex: '#ef4444' }
    };

    // ==========================================
    // FUNCIONES ATÓMICAS (LOGIC & UI)
    // ==========================================

    /**
     * Dibuja los elementos del array en la interfaz
     */
    function renderArray(key) {
        const container = document.getElementById(`tracker${capitalize(key)}`);
        if (!container) return;
        container.innerHTML = '';
        const data = state[key];

        // Mensaje si el array está vacío
        if (data.length === 0) {
            container.innerHTML = '<span class="badge bg-secondary opacity-50">Array vacío [ ]</span>';
            return;
        }

        // Creamos los elementos visuales
        data.forEach((item, i) => {
            const span = document.createElement('span');
            span.className = `badge elemento-array ${getBadgeClass(key, i)}`;
            
            if (key === 'colores') {
                span.style.setProperty('background-color', item.hex, 'important');
                span.textContent = item.nombre;
                span.classList.add('text-white', 'border', 'border-light', 'border-opacity-25', 'fw-bolder');
            } else if (key === 'tareas') {
                // El primer elemento (índice 0) es el que acabamos de agregar al inicio
                span.textContent = i === 0 ? ` URGENTE - ${item}` : item;
            } else if (key === 'usuarios') {
                const color = getColorForName(item);
                span.innerHTML = `<span class="avatar-circle" style="background-color: ${color}">${item.charAt(0).toUpperCase()}</span> ${item}`;
            }
            
            container.appendChild(span);
        });
        vincularEfectosVisuales();
    }

    // Funciones auxiliares para formato
    const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
    const getBadgeClass = (key, i) => {
        if (key === 'tareas') return 'bg-warning text-dark' + (i === 0 ? ' anim-pulse-urgent' : '');
        if (key === 'usuarios') return 'bg-secondary';
        return '';
    };

    /**
     * Agrega un color al inicio usando .unshift()
     */
    function unshiftColor() {
        state.colores.unshift({...state.colorSeleccionado});
        renderArray('colores');
    }

    /**
     * Agrega una tarea al inicio usando .unshift()
     */
    function unshiftTarea(e) {
        if (e) e.preventDefault();
        const input = document.getElementById('inputTarea');
        const val = input.value.trim();
        if (!val) {
            animateError(input);
            return;
        }
        // El método .unshift() inserta al principio del array
        state.tareas.unshift(val);
        input.value = '';
        renderArray('tareas');
    }

    /**
     * Agrega un usuario al inicio validando que no sea duplicado
     */
    function unshiftUsuario(e) {
        if (e) e.preventDefault();
        const input = document.getElementById('inputUsuario');
        if (!input) return;
        const val = input.value.trim();
        if (!val || isDuplicate(val, state.usuarios)) {
            animateError(input);
            return;
        }
        // Agregamos con .unshift()
        state.usuarios.unshift(val);
        input.value = '';
        validateUsuario();
        renderArray('usuarios');
        input.focus();
    }

    // --- Helpers de Validación y Estética ---

    const isDuplicate = (val, arr) => arr.some(u => u.toLowerCase() === val.toLowerCase());

    function animateError(el) {
        el.classList.remove('shake-animation');
        void el.offsetWidth;
        el.classList.add('shake-animation');
    }

    // Validación en tiempo real del input de usuario
    function validateUsuario() {
        const input = document.getElementById('inputUsuario');
        if (!input) return;
        const val = input.value.trim();
        const alert = document.getElementById('alertaUsuario');
        const btns = ['btnConectarSubmit', 'btnConectarContext'].map(id => document.getElementById(id));

        const duplicate = isDuplicate(val, state.usuarios);
        const empty = val === '';

        btns.forEach(btn => {
            if (btn) btn.classList.toggle('disabled', duplicate || empty);
            if (btn) btn.disabled = duplicate || empty;
        });
        if (alert) alert.classList.toggle('d-none', !duplicate);
    }

    // Validación del input de tarea
    function validateTarea() {
        const input = document.getElementById('inputTarea');
        if (!input) return;
        const val = input.value.trim();
        const btns = ['btnAgregarTareaSubmit', 'btnAgregarTareaContext'].map(id => document.getElementById(id));
        btns.forEach(btn => {
            if (btn) btn.disabled = val === '';
        });
    }

    // Genera un color basado en el nombre (hash)
    function getColorForName(name) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return `hsl(${Math.abs(hash % 360)}, 70%, 40%)`;
    }

    // ==========================================
    // ASIGNACIÓN DE EVENTOS (HANDLERS)
    // ==========================================

    function setupEvents() {
        // Demo 1: Selector de Colores
        document.querySelectorAll('.btn-color-picker').forEach(btn => {
            btn.addEventListener('click', () => {
                state.colorSeleccionado = {
                    hex: btn.getAttribute('data-color'),
                    nombre: btn.getAttribute('title')
                };
                
                // Resaltar el color elegido
                document.querySelectorAll('.btn-color-picker').forEach(b => b.style.border = 'none');
                btn.style.border = '3px solid white';

                // Cambiar el color de los botones de acción dinámicamente
                const actionBtns = [document.getElementById('btnUnshiftSubmit'), document.getElementById('btnUnshiftContext')];
                actionBtns.forEach(ab => {
                    if (ab) {
                        ab.style.setProperty('background-color', state.colorSeleccionado.hex, 'important');
                        ab.style.setProperty('color', '#ffffff', 'important');
                        ab.style.setProperty('border-color', '#ffffff', 'important');
                    }
                });
            });
        });

        // Eventos para agregar color (Barra Espaciadora y Click Derecho)
        const btnUnshiftKey = document.getElementById('btnUnshiftSubmit');
        const btnUnshiftContext = document.getElementById('btnUnshiftContext');
        if (btnUnshiftKey) btnUnshiftKey.addEventListener('keydown', (e) => { if (e.key === ' ') { e.preventDefault(); unshiftColor(); } });
        if (btnUnshiftContext) btnUnshiftContext.addEventListener('contextmenu', (e) => { e.preventDefault(); unshiftColor(); });

        // Demo 2: Formulario de Tareas
        const formTarea = document.getElementById('formTarea');
        if (formTarea) formTarea.addEventListener('submit', unshiftTarea);
        const btnTareaContext = document.getElementById('btnAgregarTareaContext');
        if (btnTareaContext) btnTareaContext.addEventListener('contextmenu', (e) => { e.preventDefault(); unshiftTarea(); });
        const inputTarea = document.getElementById('inputTarea');
        if (inputTarea) {
            inputTarea.addEventListener('input', validateTarea);
            validateTarea();
        }

        // Demo 3: Formulario de Usuarios
        const formUsuario = document.getElementById('formUsuario');
        if (formUsuario) formUsuario.addEventListener('submit', unshiftUsuario);
        const btnUserContext = document.getElementById('btnConectarContext');
        if (btnUserContext) btnUserContext.addEventListener('contextmenu', (e) => { e.preventDefault(); unshiftUsuario(); });
        const inputUser = document.getElementById('inputUsuario');
        if (inputUser) {
            inputUser.addEventListener('input', validateUsuario);
        }

        // Botones de Reiniciar
        document.querySelectorAll('.btn-reiniciar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demo = e.target.getAttribute('data-demo');
                if (demo === '1') state.colores = [];
                if (demo === '2') state.tareas = [...INITIAL_TAREAS];
                if (demo === '3') state.usuarios = [...INITIAL_USUARIOS];
                
                const keys = ['colores', 'tareas', 'usuarios'];
                renderArray(keys[demo - 1]);
                if (demo === '3') validateUsuario();
            });
        });

        // Autocierre de menú móvil
        document.querySelectorAll('.nav-link-auto-close').forEach(link => {
            link.addEventListener('click', () => {
                const menu = document.getElementById('navbarNav');
                if (menu && menu.classList.contains('show')) {
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

    // Inicialización de la App
    setupEvents();
    renderArray('colores');
    renderArray('tareas');
    renderArray('usuarios');

});

