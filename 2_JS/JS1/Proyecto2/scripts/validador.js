
window.Validador = (() => {

    const REGLAS = {
        'inp-marca': {
            requerido: true,
            patron: /^[a-zA-Z\s\-]+$/,
            mensajeError: 'Ingresá una marca válida.'
        },
        'inp-nombre': { // Modelo
            requerido: true,
            minLen: 2,
            mensajeError: 'Ingresá el modelo del vehículo.'
        },
        'inp-anio': {
            requerido: true,
            tipo: 'numero',
            min: 2013,
            max: 2026,
            mensajeError: 'No aceptamos autos anteriores a 2013.'
        },
        'inp-color': {
            requerido: true,
            patron: /^[a-zA-Z\s]+$/,
            mensajeError: 'Ingresá un color válido.'
        },
        'inp-stock': { // Patente
            requerido: true,
            patron: /^([a-zA-Z]{3}\d{3}|[a-zA-Z]{2}\d{3}[a-zA-Z]{2})$/,
            mensajeError: 'Formato de patente inválido (AAA123 o AA123BB).'
        },
        'inp-precio': { // Kilómetros
            requerido: true,
            tipo: 'numero',
            min: 0,
            max: 250000,
            mensajeError: 'El kilometraje excede el límite permitido (máx 2.5M).'
        },
        'inp-categoria': { // Combustible
            requerido: true,
            mensajeError: 'Seleccioná el tipo de combustible.'
        },
        'inp-imagen': { // Precio USD
            requerido: true,
            tipo: 'numero',
            min: 1,
            mensajeError: 'Ingresá un precio válido.'
        },
        'inp-descripcion': {
            requerido: false,
            maxLen: 300
        }
    };

    function validarCampo(id) {
        const regla = REGLAS[id];
        if (!regla) return true;

        const input = document.getElementById(id);
        const valor = input.value.trim();
        const errorSpan = document.getElementById(`err-${id.replace('inp-', '')}`);
        const exitoSpan = input.parentElement.querySelector('.mensaje-exito');

        let esValido = true;
        let mensaje = '';

        if (regla.requerido && !valor) {
            esValido = false;
            mensaje = regla.mensajeError || 'Este campo es obligatorio.';
        } else if (valor) {
            if (regla.minLen && valor.length < regla.minLen) {
                esValido = false;
                mensaje = `Mínimo ${regla.minLen} caracteres.`;
            } else if (regla.maxLen && valor.length > regla.maxLen) {
                esValido = false;
                mensaje = `Máximo ${regla.maxLen} caracteres.`;
            } else if (regla.patron && !regla.patron.test(valor)) {
                esValido = false;
                mensaje = regla.mensajeError || 'Formato inválido.';
            } else if (id === 'inp-stock') {
                // Validación especial de patentes por año (Argentina)
                const anioInput = document.getElementById('inp-anio');
                const anio = parseInt(anioInput.value) || 0;
                const esFormatoNuevo = /^[a-zA-Z]{2}\d{3}[a-zA-Z]{2}$/.test(valor);
                
                if (anio > 0 && anio < 2016 && esFormatoNuevo) {
                    esValido = false;
                    mensaje = 'Un auto anterior a 2016 no puede tener patente Mercosur (AA123BB).';
                }
            } else if (regla.tipo === 'numero') {
                const num = parseFloat(valor);
                if (isNaN(num) || (regla.min !== undefined && num < regla.min) || (regla.max !== undefined && num > regla.max)) {
                    esValido = false;
                    mensaje = regla.mensajeError || 'Número fuera de rango.';
                }
            }
        }

        if (esValido) {
            input.classList.remove('campo-error');
            input.classList.add('campo-valido');
            if (errorSpan) errorSpan.classList.remove('visible');
            if (exitoSpan) exitoSpan.classList.remove('d-none');
        } else {
            input.classList.remove('campo-valido');
            input.classList.add('campo-error');
            if (errorSpan) {
                errorSpan.textContent = mensaje;
                errorSpan.classList.add('visible');
            }
            if (exitoSpan) exitoSpan.classList.add('d-none');
        }

        return esValido;
    }

    function validarFormulario() {
        let formValido = true;
        for (const id in REGLAS) {
            if (!validarCampo(id)) formValido = false;
        }
        return formValido;
    }

    function limpiarValidacion(id) {
        const input = document.getElementById(id);
        const errorSpan = document.getElementById(`err-${id.replace('inp-', '')}`);
        const exitoSpan = input.parentElement.querySelector('.mensaje-exito');

        input.classList.remove('campo-error', 'campo-valido');
        if (errorSpan) errorSpan.classList.remove('visible');
        if (exitoSpan) exitoSpan.classList.add('d-none');
    }

    return {
        validarCampo,
        validarFormulario,
        limpiarValidacion
    };

})();
