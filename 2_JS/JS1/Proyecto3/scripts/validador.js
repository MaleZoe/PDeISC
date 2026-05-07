// NJS4/Proyecto 3/scripts/validador.js

/**
 * Módulo Validador
 * Responsabilidad: Aplicar las reglas estrictas de validación de formulario,
 * incluyendo comprobación cruzada de fechas y duplicados contra el Storage.
 */

window.Validador = (() => {

    // Reglas de validación
    const REGLAS = {
        'inp-nombre': {
            requerido: true,
            minLen: 2, maxLen: 50,
            patron: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s\-]+$/
        },
        'inp-apellido': {
            requerido: true,
            minLen: 2, maxLen: 50,
            patron: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s\-]+$/
        },
        'inp-fecha-nac': {
            requerido: false,
            tipo: 'fecha-pasada'
        },
        'inp-sexo': {
            requerido: true,
            tipo: 'radio'
        },
        'inp-documento': {
            requerido: false,
            patron: /^\d{7,8}$/,
            tipo: 'documento-unico' // Se checkea contra Storage
        },
        'inp-estado-civil': {
            requerido: false,
            tipo: 'select'
        },
        'inp-nacionalidad': {
            requerido: false,
            minLen: 3, maxLen: 60,
            patron: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/
        },
        'inp-direccion': {
            requerido: false,
            minLen: 5, maxLen: 100
        },
        'inp-telefono': {
            requerido: false,
            patron: /^[\d\+\-\s]{7,20}$/
        },
        'inp-email': {
            requerido: true,
            patron: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        'inp-tiene-hijos': {
            requerido: true,
            tipo: 'radio'
        },
        'inp-cantidad-hijos': {
            requerido: false, // Se vuelve true dinámicamente en formulario.js
            tipo: 'entero-rango', min: 1, max: 30
        }
    };

    // Diccionario de mensajes de error estandarizados
    const MENSAJES = {
        requerido: "Este campo es obligatorio.",
        radio: "Seleccioná una opción.",
        letras: "Solo se permiten letras, espacios y guiones.",
        email: "Ingresá un correo electrónico válido.",
        digitos: "Solo se permiten dígitos numéricos.",
        documento: "El documento debe tener 7 u 8 dígitos.",
        documentoDuplicado: "Ya existe una persona registrada con este documento.",
        rangoEdad: "Ingresá un número entero entre 0 y 130.",
        rangoHijos: "Si tiene hijos, debe ingresar al menos 1 y máximo 30.",
        fechaFutura: "La fecha de nacimiento no puede ser futura.",
        edadFechaNoCoincide: "⚠️ La edad ingresada no coincide con la fecha de nacimiento.",
        telefono: "Formato inválido. Usá dígitos, +, - o espacios.",
        nacionalidad: "Solo se permiten letras y espacios."
    };

    function mostrarError(id, mensaje) {
        const input = document.getElementById(id);
        const errSpan = document.getElementById(`err-${id.replace('inp-', '')}`);
        
        if (id === 'inp-sexo' || id === 'inp-tiene-hijos') {
            if (errSpan) { errSpan.textContent = mensaje; errSpan.classList.add('visible'); }
            return;
        }

        if (input) {
            input.classList.remove('campo-valido', 'campo-advertencia');
            input.classList.add('campo-error');
            const msjAdv = input.parentElement.querySelector('.mensaje-advertencia');
            if (msjAdv) msjAdv.remove();
            
            const exitoSpan = input.parentElement.querySelector('.mensaje-exito');
            if (exitoSpan) exitoSpan.classList.add('d-none');
        }
        if (errSpan) {
            errSpan.textContent = mensaje;
            errSpan.classList.add('visible');
        }
    }

    function marcarValido(id) {
        const input = document.getElementById(id);
        const errSpan = document.getElementById(`err-${id.replace('inp-', '')}`);
        
        if (id === 'inp-sexo' || id === 'inp-tiene-hijos') {
            if (errSpan) { errSpan.textContent = ''; errSpan.classList.remove('visible'); }
            return;
        }

        if (input) {
            input.classList.remove('campo-error', 'campo-advertencia');
            input.classList.add('campo-valido');
            const exitoSpan = input.parentElement.querySelector('.mensaje-exito');
            if (exitoSpan) exitoSpan.classList.remove('d-none');
            
            // Limpiar advertencias si existían
            const msjAdv = input.parentElement.querySelector('.mensaje-advertencia');
            if (msjAdv) msjAdv.remove();
        }
        if (errSpan) {
            errSpan.textContent = '';
            errSpan.classList.remove('visible');
        }
    }

    function mostrarAdvertencia(id, mensaje) {
        // La advertencia no bloquea, por ende el campo sigue siendo válido técnicamente
        // pero se pinta ambar
        const input = document.getElementById(id);
        if (!input) return;

        input.classList.remove('campo-error', 'campo-valido');
        input.classList.add('campo-advertencia');

        // Insertar span de advertencia si no existe
        let msjAdv = input.parentElement.querySelector('.mensaje-advertencia');
        if (!msjAdv) {
            msjAdv = document.createElement('span');
            msjAdv.className = 'mensaje-advertencia';
            // Insert after err span
            const errSpan = input.parentElement.querySelector('.mensaje-error');
            errSpan.parentNode.insertBefore(msjAdv, errSpan.nextSibling);
        }
        msjAdv.textContent = mensaje;
        
        const exitoSpan = input.parentElement.querySelector('.mensaje-exito');
        if (exitoSpan) exitoSpan.classList.add('d-none'); // Ocultar tick verde
    }

    function limpiarError(id) {
        const input = document.getElementById(id);
        const errSpan = document.getElementById(`err-${id.replace('inp-', '')}`);
        
        if (id === 'inp-sexo' || id === 'inp-tiene-hijos') {
            if (errSpan) { errSpan.textContent = ''; errSpan.classList.remove('visible'); }
            return;
        }

        if (input) {
            input.classList.remove('campo-error', 'campo-valido', 'campo-advertencia');
            const msjAdv = input.parentElement.querySelector('.mensaje-advertencia');
            if (msjAdv) msjAdv.remove();
            
            const exitoSpan = input.parentElement.querySelector('.mensaje-exito');
            if (exitoSpan) exitoSpan.classList.add('d-none');
        }
        if (errSpan) {
            errSpan.textContent = '';
            errSpan.classList.remove('visible');
        }
    }

    function validarCampo(id) {
        const regla = REGLAS[id];
        if (!regla) return true;

        const input = document.getElementById(id);
        if (!input) return true;

        let valor = input.value.trim();

        // Radios
        if (regla.tipo === 'radio') {
            const groupName = id === 'inp-sexo' ? 'sexo' : 'tiene-hijos';
            const seleccionado = document.querySelector(`input[name="${groupName}"]:checked`);
            if (regla.requerido && !seleccionado) {
                mostrarError(id, MENSAJES.radio);
                return false;
            }
            marcarValido(id);
            return true;
        }

        // Obligatorio vacío
        if (regla.requerido && !valor) {
            mostrarError(id, MENSAJES.requerido);
            return false;
        }

        // Opcional vacío -> es válido
        if (!regla.requerido && !valor) {
            limpiarError(id);
            return true;
        }

        // Validaciones condicionales si tiene valor
        
        if (regla.tipo === 'select' && input.selectedIndex === 0) {
            if (regla.requerido) {
                mostrarError(id, MENSAJES.requerido);
                return false;
            }
            limpiarError(id);
            return true;
        }

        if (regla.minLen && valor.length < regla.minLen) {
            mostrarError(id, `Mínimo ${regla.minLen} caracteres requeridos.`);
            return false;
        }

        if (regla.maxLen && valor.length > regla.maxLen) {
            mostrarError(id, `Máximo ${regla.maxLen} caracteres permitidos.`);
            return false;
        }

        if (regla.patron) {
            if (!regla.patron.test(valor)) {
                if (id === 'inp-email') mostrarError(id, MENSAJES.email);
                else if (id === 'inp-documento') mostrarError(id, MENSAJES.documento);
                else if (id === 'inp-telefono') mostrarError(id, MENSAJES.telefono);
                else if (id === 'inp-nacionalidad') mostrarError(id, MENSAJES.nacionalidad);
                else mostrarError(id, MENSAJES.letras);
                return false;
            }
        }

        if (regla.tipo === 'entero-rango') {
            const num = parseFloat(valor);
            if (isNaN(num) || !Number.isInteger(num)) {
                mostrarError(id, "Ingresá un número entero válido.");
                return false;
            }
            if (num < regla.min || num > regla.max) {
                if (id === 'inp-cantidad-hijos') mostrarError(id, "El valor debe estar entre 1 y 30.");
                else mostrarError(id, MENSAJES.rangoEdad);
                return false;
            }
        }

        if (regla.tipo === 'fecha-pasada') {
            const fechaIngresada = new Date(valor);
            const hoy = new Date();
            hoy.setHours(23, 59, 59, 999);
            if (fechaIngresada > hoy) {
                mostrarError(id, MENSAJES.fechaFutura);
                return false;
            }
        }

        if (regla.tipo === 'documento-unico') {
            if (window.Storage.existeDocumento(valor)) {
                mostrarError(id, MENSAJES.documentoDuplicado);
                return false;
            }
        }

        marcarValido(id);

        // Disparar validación cruzada fecha/edad (no bloqueante)
        if (id === 'inp-fecha-nac') {
            // Ya no hay validación cruzada con edad
        }

        return true;
    }


    function validarFormulario() {
        let esValido = true;
        Object.keys(REGLAS).forEach(id => {
            if (!validarCampo(id)) {
                esValido = false;
            }
        });
        return esValido;
    }

    function resetearValidacion() {
        Object.keys(REGLAS).forEach(id => {
            limpiarError(id);
        });
        actualizarBotonGuardar();
    }

    function actualizarBotonGuardar() {
        const btn = document.getElementById('btnGuardar');
        if (!btn) return;

        let todosValidos = true;

        for (const [id, regla] of Object.entries(REGLAS)) {
            const input = document.getElementById(id);
            if (!input) continue;

            let valor = input.value.trim();

            // Verificar condicional
            if (id === 'inp-cantidad-hijos') {
                const tieneHijos = document.querySelector('input[name="tiene-hijos"]:checked');
                if (tieneHijos && tieneHijos.value === 'No') {
                    // Si no tiene hijos, no requiere validar cantidad
                    continue; 
                }
            }

            if (regla.tipo === 'radio') {
                const groupName = id === 'inp-sexo' ? 'sexo' : 'tiene-hijos';
                const seleccionado = document.querySelector(`input[name="${groupName}"]:checked`);
                if (regla.requerido && !seleccionado) { todosValidos = false; break; }
                continue;
            }

            if (regla.requerido && !valor) { todosValidos = false; break; }
            
            // Si tiene valor y hay regla de patrón/longitud que no cumpla, bloquea el submit
            if (valor) {
                if (regla.patron && !regla.patron.test(valor)) { todosValidos = false; break; }
                if (regla.minLen && valor.length < regla.minLen) { todosValidos = false; break; }
                if (regla.tipo === 'entero-rango') {
                    const num = parseFloat(valor);
                    if (isNaN(num) || num < regla.min || num > regla.max || !Number.isInteger(num)) {
                        todosValidos = false; break;
                    }
                }
            }
        }

        // Validamos si hay algún .campo-error (por ej. check duplicado)
        const hayErrorRenderizado = document.querySelector('.campo-error') || 
                                    document.querySelector('.mensaje-error.visible');
        
        if (hayErrorRenderizado) {
            todosValidos = false;
        }

        btn.disabled = !todosValidos;
    }

    return {
        REGLAS, // Expuesto para poder modificar dinámicamente el requerido
        validarCampo,
        validarFormulario,
        mostrarError,
        limpiarError,
        marcarValido,
        mostrarAdvertencia,
        resetearValidacion,
        actualizarBotonGuardar
    };
})();
