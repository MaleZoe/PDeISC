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

    function renderArray(key) {
        const container = document.getElementById(`tracker${capitalize(key)}`);
        if (!container) return;
        container.innerHTML = '';
        const data = state[key];

        if (data.length === 0) {
            container.innerHTML = '<span class="badge bg-secondary opacity-50">Array vacío [ ]</span>';
            return;
        }

        data.forEach((item, i) => {
            const span = document.createElement('span');
            span.className = `badge elemento-array ${getBadgeClass(key, i)}`;
            
            if (key === 'colores') {
                span.style.setProperty('background-color', item.hex, 'important');
                span.textContent = item.nombre;
                span.classList.add('text-white', 'border', 'border-light', 'border-opacity-25', 'fw-bolder');
            } else if (key === 'tareas') {
                span.textContent = i === 0 ? ` URGENTE - ${item}` : item;
            } else if (key === 'usuarios') {
                const color = getColorForName(item);
                span.innerHTML = `<span class="avatar-circle" style="background-color: ${color}">${item.charAt(0).toUpperCase()}</span> ${item}`;
            }
            
            container.appendChild(span);
        });
        vincularEfectosVisuales();
    }

    const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
    const getBadgeClass = (key, i) => {
        if (key === 'tareas') return 'bg-warning text-dark' + (i === 0 ? ' anim-pulse-urgent' : '');
        if (key === 'usuarios') return 'bg-secondary';
        return '';
    };

    function unshiftColor() {
        state.colores.unshift({...state.colorSeleccionado});
        renderArray('colores');
    }

    function unshiftTarea(e) {
        if (e) e.preventDefault();
        const input = document.getElementById('inputTarea');
        const val = input.value.trim();
        if (!val) {
            animateError(input);
            return;
        }
        state.tareas.unshift(val);
        input.value = '';
        renderArray('tareas');
    }

    function unshiftUsuario(e) {
        if (e) e.preventDefault();
        const input = document.getElementById('inputUsuario');
        if (!input) return;
        const val = input.value.trim();
        if (!val || isDuplicate(val, state.usuarios)) {
            animateError(input);
            return;
        }
        state.usuarios.unshift(val);
        input.value = '';
        validateUsuario();
        renderArray('usuarios');
        input.focus();
    }

    // --- Helpers ---

    const isDuplicate = (val, arr) => arr.some(u => u.toLowerCase() === val.toLowerCase());

    function animateError(el) {
        el.classList.remove('shake-animation');
        void el.offsetWidth;
        el.classList.add('shake-animation');
    }

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

    function validateTarea() {
        const input = document.getElementById('inputTarea');
        if (!input) return;
        const val = input.value.trim();
        const btns = ['btnAgregarTareaSubmit', 'btnAgregarTareaContext'].map(id => document.getElementById(id));
        btns.forEach(btn => {
            if (btn) btn.disabled = val === '';
        });
    }

    function getColorForName(name) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return `hsl(${Math.abs(hash % 360)}, 70%, 40%)`;
    }

    // ==========================================
    // ASIGNACIÓN DE EVENTOS (HANDLERS)
    // ==========================================

    function setupEvents() {
        // Demo 1: Colores
        document.querySelectorAll('.btn-color-picker').forEach(btn => {
            btn.addEventListener('click', () => {
                state.colorSeleccionado = {
                    hex: btn.getAttribute('data-color'),
                    nombre: btn.getAttribute('title')
                };
                
                // Resaltar picker activo
                document.querySelectorAll('.btn-color-picker').forEach(b => b.style.border = 'none');
                btn.style.border = '3px solid white';

                // Colorear los botones de acción
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

        const btnUnshiftKey = document.getElementById('btnUnshiftSubmit');
        const btnUnshiftContext = document.getElementById('btnUnshiftContext');
        if (btnUnshiftKey) btnUnshiftKey.addEventListener('keydown', (e) => { if (e.key === ' ') { e.preventDefault(); unshiftColor(); } });
        if (btnUnshiftContext) btnUnshiftContext.addEventListener('contextmenu', (e) => { e.preventDefault(); unshiftColor(); });

        // Demo 2: Tareas (Submit, Context)
        const formTarea = document.getElementById('formTarea');
        if (formTarea) formTarea.addEventListener('submit', unshiftTarea);
        const btnTareaContext = document.getElementById('btnAgregarTareaContext');
        if (btnTareaContext) btnTareaContext.addEventListener('contextmenu', (e) => { e.preventDefault(); unshiftTarea(); });
        const inputTarea = document.getElementById('inputTarea');
        if (inputTarea) {
            inputTarea.addEventListener('input', validateTarea);
            validateTarea();
        }

        // Demo 3: Usuarios (Submit, Context)
        const formUsuario = document.getElementById('formUsuario');
        if (formUsuario) formUsuario.addEventListener('submit', unshiftUsuario);
        const btnUserContext = document.getElementById('btnConectarContext');
        if (btnUserContext) btnUserContext.addEventListener('contextmenu', (e) => { e.preventDefault(); unshiftUsuario(); });
        const inputUser = document.getElementById('inputUsuario');
        if (inputUser) {
            inputUser.addEventListener('input', validateUsuario);
        }

        // Reinicio
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

        // Navbar auto-close
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
    renderArray('colores');
    renderArray('tareas');
    renderArray('usuarios');

});
