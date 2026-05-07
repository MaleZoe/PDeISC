// NJS4/Proyecto 3/scripts/app.js

/**
 * Módulo App
 * Responsabilidad: Punto de entrada principal. Orquesta los eventos globales,
 * actualiza las vistas y une los módulos Storage, Validador, Formulario y Listado.
 */

window.App = (() => {

    function inicializar() {
        // Inicializar UI Formulario
        window.Formulario.inicializar();

        // Bindear eventos de validación a cada campo
        const inputs = document.querySelectorAll('#formularioPersona input, #formularioPersona select');
        inputs.forEach(input => {
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

        // Configurar Submit
        const form = document.getElementById('formularioPersona');
        form.addEventListener('submit', manejarSubmit);
        
        // Configurar Reset
        form.addEventListener('reset', manejarReset);

        // Configurar Búsqueda con Debounce
        const inputBusqueda = document.getElementById('busquedaPersona');
        if (inputBusqueda) {
            inputBusqueda.addEventListener('input', debounce((e) => {
                window.Listado.filtrar(e.target.value);
            }, 300));
        }

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
        
        // Limpiar input de búsqueda
        const ib = document.getElementById('busquedaPersona');
        if (ib) ib.value = '';
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

        banner.className = 'mt-4 shadow-sm border visible'; // Reset
        
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
        banner.classList.remove('visible');
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

        document.getElementById('btnConfirmarVaciar').addEventListener('click', () => {
            window.Storage.vaciarTodo();
            window.Listado.renderizarListado([]);
            window.Listado.actualizarBadgeNavbar(0);
            
            // Restaurar botón
            restaurarBotonVaciar();
            document.getElementById('busquedaPersona').value = '';
        });

        document.getElementById('btnCancelarVaciar').addEventListener('click', restaurarBotonVaciar);

        function restaurarBotonVaciar() {
            contenedor.innerHTML = '';
            contenedor.appendChild(btnOriginal);
            // Re-asignar listener ya que se removió el nodo
            btnOriginal.addEventListener('click', manejarVaciarTodo);
            // Actualizar estado disabled
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
