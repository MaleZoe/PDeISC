

window.App = (() => {

    function inicializar() {
        inicializarTema();

        // Inicializar UI Formulario
        window.Formulario.inicializar();

        // Bindear eventos de validación a cada campo
        const inputs = document.querySelectorAll('#formularioPersona input, #formularioPersona select');
        inputs.forEach(input => {
            if (input.type === 'radio') return;
            input.addEventListener('blur', () => window.Validador.validarCampo(input.id));
            input.addEventListener('input', () => {
                window.Validador.validarCampo(input.id);
                window.Validador.actualizarBotonGuardar();
            });
            input.addEventListener('change', () => {
                window.Validador.validarCampo(input.id);
                window.Validador.actualizarBotonGuardar();
            });
        });

        document.querySelectorAll('#formularioPersona input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const campoGrupo = radio.name === 'sexo' ? 'inp-sexo' : 'inp-tiene-hijos';
                window.Validador.validarCampo(campoGrupo);
                window.Validador.actualizarBotonGuardar();
            });
        });

        // Configurar Submit
        const form = document.getElementById('formularioPersona');
        form.addEventListener('submit', manejarSubmit);
        
        // Configurar Reset
        form.addEventListener('reset', manejarReset);



        // Configurar botón Vaciar Todo
        const btnVaciar = document.getElementById('btnVaciarTodo');
        if (btnVaciar) {
            btnVaciar.addEventListener('click', manejarVaciarTodo);
        }

        // Suscripción a eventos externos (eliminación desde tarjeta individual)
        // Renderizado Inicial
        const personasGuardadas = window.Storage.obtenerPersonas();
        window.Listado.renderizarListado(personasGuardadas);
        window.Listado.actualizarBadgeNavbar(personasGuardadas.length);
        window.Validador.actualizarBotonGuardar();

        console.log(`[App] Aplicación iniciada. Personas en storage: ${personasGuardadas.length}`);
    }
    
    function inicializarTema() {
        const temaGuardado = localStorage.getItem('tema');
        const body = document.body;
        const themeIcon = document.getElementById('themeIcon');
        
        if (temaGuardado === 'oscuro' || (!temaGuardado && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            body.classList.add('dark-mode');
            themeIcon.textContent = '☀️';
        } else {
            themeIcon.textContent = '🌙';
        }
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTema);
        }
    }
    
    function toggleTema() {
        const body = document.body;
        const themeIcon = document.getElementById('themeIcon');
        
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            themeIcon.textContent = '☀️';
            localStorage.setItem('tema', 'oscuro');
        } else {
            themeIcon.textContent = '🌙';
            localStorage.setItem('tema', 'claro');
        }
    }

    function manejarSubmit(evento) {
        evento.preventDefault();

        // Validar todo de golpe
        if (!window.Validador.validarFormulario()) {
            mostrarBanner('error');
            // Foco al primero con error
            const errField = document.querySelector('.campo-error');
            if (errField) errField.focus();
            return;
        }

        // Check de duplicados (ya se hace en el validador, pero se hace un paso doble por seguridad)
        const docInput = document.getElementById('inp-documento');
        if (docInput.value.trim() !== '') {
            if (window.Storage.existeDocumento(docInput.value.trim())) {
                mostrarBanner('duplicado');
                window.Validador.mostrarError('inp-documento', window.Validador.REGLAS['inp-documento'].mensajeDuplicado || "Documento duplicado");
                return;
            }
        }

        const nuevaPersona = construirObjetoPersona();
        
        const guardadoExitoso = window.Storage.guardarPersona(nuevaPersona);
        
        if (!guardadoExitoso) {
            mostrarBanner('storage-lleno');
            return;
        }

        // Flujo exitoso
        const nuevaLista = window.Storage.obtenerPersonas();
        window.Listado.renderizarListado(nuevaLista);
        window.Listado.actualizarBadgeNavbar(nuevaLista.length);
        
        mostrarBanner('exito');

        // Limpiar
        document.getElementById('formularioPersona').reset();
        window.Formulario.limpiarFormulario(); // Reset UI
        window.Validador.resetearValidacion();
        
        // Scroll
        document.getElementById('seccionListado').scrollIntoView({ behavior: 'smooth' });
    }

    function manejarReset() {
        setTimeout(() => {
            window.Formulario.limpiarFormulario();
            window.Validador.resetearValidacion();
            ocultarBanner();
        }, 0);
    }

    function construirObjetoPersona() {
        const val = (id) => document.getElementById(id).value.trim();
        
        const tieneHijos = document.querySelector('input[name="tiene-hijos"]:checked')?.value || 'No';
        const cantHijosRaw = val('inp-cantidad-hijos');
        const fechaNac = val('inp-fecha-nac');

        // Calcular edad automáticamente si hay fecha
        let edadCalculada = null;
        if (fechaNac) {
            const f = new Date(fechaNac);
            const hoy = new Date();
            edadCalculada = hoy.getFullYear() - f.getFullYear();
            const m = hoy.getMonth() - f.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < f.getDate())) {
                edadCalculada--;
            }
        }

        return {
            nombre: val('inp-nombre'),
            apellido: val('inp-apellido'),
            edad: edadCalculada,
            fechaNac: fechaNac || null,
            sexo: document.querySelector('input[name="sexo"]:checked')?.value,
            documento: val('inp-documento') || null,
            estadoCivil: document.getElementById('inp-estado-civil').value || null,
            nacionalidad: val('inp-nacionalidad') || null,
            direccion: val('inp-direccion') || null,
            telefono: val('inp-telefono') || null,
            email: val('inp-email'),
            tieneHijos: tieneHijos,
            cantidadHijos: tieneHijos === 'Si' && cantHijosRaw ? parseInt(cantHijosRaw, 10) : 0
        };
    }

    function mostrarBanner(tipo) {
        const banner = document.getElementById('bannerFeedback');
        const icono = banner.querySelector('.icono-banner');
        const texto = banner.querySelector('.texto-banner');

        banner.className = 'mt-4 shadow-sm border visible';
        
        if (tipo === 'exito') {
            banner.classList.add('banner-exito');
            icono.textContent = '';
            texto.textContent = '¡Persona guardada correctamente en localStorage!';
            setTimeout(ocultarBanner, 4000);
        } else if (tipo === 'error') {
            banner.classList.add('banner-error');
            icono.textContent = '';
            texto.textContent = 'Hay errores en el formulario. Revisá los campos marcados.';
        } else if (tipo === 'duplicado') {
            banner.classList.add('banner-duplicado');
            icono.textContent = '';
            texto.textContent = 'Ya existe una persona registrada con ese número de documento.';
        } else if (tipo === 'storage-lleno') {
            banner.classList.add('banner-storage');
            icono.textContent = '';
            texto.textContent = 'No se pudo guardar: el almacenamiento local está lleno.';
        }
    }

    function ocultarBanner() {
        const banner = document.getElementById('bannerFeedback');
        banner.className = 'mt-4 shadow-sm border';
    }

    function manejarVaciarTodo() {
        if (window.Storage.obtenerTotal() === 0) return;

        const contenedor = document.getElementById('contenedorVaciar');
        const btnOriginal = document.getElementById('btnVaciarTodo');

        // Reemplazo inline por botones de confirmación
        contenedor.innerHTML = `
            <span class="text-danger fw-bold small me-2">¿Eliminar todos los registros?</span>
            <button class="btn btn-danger btn-sm fw-medium" id="btnConfirmarVaciar">Sí, vaciar</button>
            <button class="btn btn-light btn-sm border" id="btnCancelarVaciar">Cancelar</button>
        `;

        document.getElementById('btnConfirmarVaciar').onclick = () => {
            window.Storage.vaciarTodo();
            window.Listado.renderizarListado([]);
            window.Listado.actualizarBadgeNavbar(0);
            restaurarBotonVaciar();
        };

        document.getElementById('btnCancelarVaciar').onclick = restaurarBotonVaciar;

        function restaurarBotonVaciar() {
            contenedor.innerHTML = '';
            contenedor.appendChild(btnOriginal);
            btnOriginal.onclick = manejarVaciarTodo;
            btnOriginal.disabled = window.Storage.obtenerTotal() === 0;
        }
    }

    // Helper debounce

    // Helper debounce
    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    return { inicializar };

})();

document.addEventListener('DOMContentLoaded', window.App.inicializar);
