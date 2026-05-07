// NJS4/Proyecto 3/scripts/formulario.js

/**
 * Módulo Formulario
 * Responsabilidad: Manejar la lógica de la UI del formulario, específicamente 
 * los campos condicionales y pre-configuraciones de la vista.
 */

window.Formulario = (() => {

    const contenedorHijos = document.getElementById('contenedorCantidadHijos');
    const inpCantidadHijos = document.getElementById('inp-cantidad-hijos');

    /**
     * Inicializa todos los comportamientos asociados a inputs específicos.
     */
    function inicializar() {
        const radiosHijos = document.querySelectorAll('input[name="tiene-hijos"]');
        radiosHijos.forEach(radio => {
            radio.addEventListener('change', manejarCampoHijos);
        });

        const inpFecha = document.getElementById('inp-fecha-nac');
        if (inpFecha) {
            inpFecha.addEventListener('change', validarEdadParaHijos);
        }

        inicializarFechaMaxima();
        // Asegurar estado inicial
        ocultarCampoHijos();
    }

    /**
     * Valida si la persona tiene más de 6 años para habilitar la opción de tener hijos.
     */
    function validarEdadParaHijos() {
        const inpFecha = document.getElementById('inp-fecha-nac');
        const radioSi = document.getElementById('hijos-si');
        const radioNo = document.getElementById('hijos-no');
        const contenedorHijosFull = document.querySelector('.seccion-hijos'); // El fieldset o contenedor de la sección

        if (!inpFecha.value) return;

        const fechaNac = new Date(inpFecha.value);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const m = hoy.getMonth() - fechaNac.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }

        if (edad <= 6) {
            // Es menor o igual a 6 años, no puede tener hijos
            radioNo.checked = true;
            radioSi.disabled = true;
            radioSi.parentElement.style.opacity = '0.5';
            radioSi.parentElement.title = 'No disponible para menores de 6 años';
            ocultarCampoHijos();
        } else {
            radioSi.disabled = false;
            radioSi.parentElement.style.opacity = '1';
            radioSi.parentElement.title = '';
        }
    }

    /**
     * Controla la visibilidad del campo de cantidad de hijos en base a la selección.
     */
    function manejarCampoHijos(evento) {
        const valor = evento.target.value;

        if (valor === 'Si') {
            mostrarCampoHijos();
        } else {
            ocultarCampoHijos();
        }
        
        window.Validador.actualizarBotonGuardar();
    }

    function mostrarCampoHijos() {
        if (!contenedorHijos) return;
        contenedorHijos.classList.add('visible');
        if (inpCantidadHijos) {
            inpCantidadHijos.disabled = false;
            setTimeout(() => inpCantidadHijos.focus(), 100);
        }
        window.Validador.REGLAS['inp-cantidad-hijos'].requerido = true;
    }

    function ocultarCampoHijos() {
        if (!contenedorHijos) return;
        contenedorHijos.classList.remove('visible');
        if (inpCantidadHijos) {
            inpCantidadHijos.value = '';
            inpCantidadHijos.disabled = true;
        }
        window.Validador.REGLAS['inp-cantidad-hijos'].requerido = false;
        window.Validador.limpiarError('inp-cantidad-hijos');
    }

    function inicializarFechaMaxima() {
        const inpFecha = document.getElementById('inp-fecha-nac');
        if (inpFecha) {
            const hoy = new Date();
            const anio = hoy.getFullYear();
            const mes = String(hoy.getMonth() + 1).padStart(2, '0');
            const dia = String(hoy.getDate()).padStart(2, '0');
            inpFecha.setAttribute('max', `${anio}-${mes}-${dia}`);
        }
    }

    function limpiarFormulario() {
        ocultarCampoHijos();
        const radioSi = document.getElementById('hijos-si');
        if (radioSi) {
            radioSi.disabled = false;
            radioSi.parentElement.style.opacity = '1';
        }
    }

    return {
        inicializar,
        limpiarFormulario
    };
})();
