export const Validador = (() => {

    // Reglas que debe cumplir cada campo para ser válido
    const REGLAS = {
        'inp-nombre':      { requerido: true, minLen: 3, maxLen: 50, patron: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/ },
        'inp-email':       { requerido: true, patron: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        'inp-fecha':       { requerido: true, tipo: 'fecha-pasada', edadMinima: 14 },
        'inp-plan':        { requerido: true, tipo: 'select' },
        'inp-documento':   { requerido: true, patron: /^\d{7,8}$/ },
        'inp-telefono':    { requerido: true, patron: /^[\d\s]{8,15}$/ },
        'inp-notas':       { requerido: false, maxLen: 100 },
    };

    // Mensajes explicativos para el usuario
    const MENSAJES = {
        requerido: "Este campo es obligatorio.",
        patronLetras: "Solo se permiten letras y espacios.",
        minLen: (n) => `Mínimo ${n} caracteres.`,
        maxLen: (n) => `Máximo ${n} caracteres.`,
        email: "Ingresá un correo electrónico válido.",
        fechaPasada: "La fecha debe ser en el pasado.",
        edadMinima: (n) => `Debes tener al menos ${n} años para inscribirte.`,
        select: "Seleccioná una opción válida.",
        dni: "El documento debe tener 7 u 8 dígitos."
    };

    // Aplica estilos de error al campo y muestra el mensaje
    function mostrarError(id, mensaje) {
        const campo = document.getElementById(id);
        const contenedor = campo.parentElement;
        const spanError = contenedor.querySelector('.mensaje-error');
        const spanExito = contenedor.querySelector('.mensaje-exito');

        campo.classList.remove('campo-valido');
        campo.classList.add('campo-error');
        
        spanExito.classList.remove('visible');
        spanError.textContent = mensaje;
        spanError.classList.add('visible');
    }

    // Quita los estilos de error/éxito del campo
    function limpiarError(id) {
        const campo = document.getElementById(id);
        const contenedor = campo.parentElement;
        const spanError = contenedor.querySelector('.mensaje-error');
        const spanExito = contenedor.querySelector('.mensaje-exito');

        campo.classList.remove('campo-error', 'campo-valido');
        spanError.classList.remove('visible');
        spanExito.classList.remove('visible');
    }

    // Aplica estilos de éxito (verde) al campo
    function marcarValido(id) {
        const campo = document.getElementById(id);
        const contenedor = campo.parentElement;
        const spanError = contenedor.querySelector('.mensaje-error');
        const spanExito = contenedor.querySelector('.mensaje-exito');

        campo.classList.remove('campo-error');
        campo.classList.add('campo-valido');
        
        spanError.classList.remove('visible');
        spanExito.classList.add('visible');
    }

    // Calcula la edad en años a partir de una fecha
    function calcularEdad(fechaNacimiento) {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    }

    // Ejecuta las validaciones sobre un campo específico
    function validarCampo(id) {
        const campo = document.getElementById(id);
        const valor = campo.value.trim();
        const regla = REGLAS[id];

        if (!regla) return true;

        if (!regla.requerido && valor === '') {
            limpiarError(id);
            return true;
        }

        if (regla.requerido && valor === '') {
            mostrarError(id, MENSAJES.requerido);
            return false;
        }

        if (regla.tipo === 'select' && valor === '') {
            mostrarError(id, MENSAJES.select);
            return false;
        }

        if (regla.minLen && valor.length < regla.minLen) {
            mostrarError(id, MENSAJES.minLen(regla.minLen));
            return false;
        }

        if (regla.maxLen && valor.length > regla.maxLen) {
            mostrarError(id, MENSAJES.maxLen(regla.maxLen));
            return false;
        }

        if (regla.patron && !regla.patron.test(valor)) {
            if (id === 'inp-nombre' || id === 'inp-apellido') {
                mostrarError(id, MENSAJES.patronLetras);
            } else if (id === 'inp-email') {
                mostrarError(id, MENSAJES.email);
            } else if (id === 'inp-documento') {
                mostrarError(id, MENSAJES.dni);
            } else if (id === 'inp-telefono') {
                mostrarError(id, MENSAJES.patronNumeros);
            }
            return false;
        }

        // Validación específica: Nombre completo debe tener al menos 2 palabras
        if (id === 'inp-nombre' && valor.trim().split(/\s+/).length < 2) {
            mostrarError(id, "Ingresá al menos un nombre y un apellido.");
            return false;
        }

        if (regla.tipo === 'fecha-pasada') {
            const fechaIngresada = new Date(valor);
            const hoy = new Date();
            
            if (fechaIngresada >= hoy) {
                mostrarError(id, MENSAJES.fechaPasada);
                return false;
            }

            if (regla.edadMinima) {
                const edad = calcularEdad(valor);
                if (edad < regla.edadMinima) {
                    mostrarError(id, MENSAJES.edadMinima(regla.edadMinima));
                    return false;
                }
            }
        }

        marcarValido(id);
        return true;
    }

    // Valida todos los campos (se usa antes de guardar)
    function validarFormulario() {
        let esValido = true;

        for (const id in REGLAS) {
            const campoEsValido = validarCampo(id);
            if (!campoEsValido && esValido) {
                document.getElementById(id).focus();
            }
            if (!campoEsValido) {
                esValido = false;
            }
        }

        return esValido;
    }

    // Habilita el botón de guardar solo si los campos obligatorios tienen contenido
    function actualizarBotonGuardar() {
        const btnGuardar = document.getElementById('btnGuardar');
        let todosRequeridosLlenos = true;

        for (const id in REGLAS) {
            if (REGLAS[id].requerido) {
                const valor = document.getElementById(id).value.trim();
                if (valor === '') {
                    todosRequeridosLlenos = false;
                    break;
                }
            }
        }

        btnGuardar.disabled = !todosRequeridosLlenos;
    }

    function resetearValidacion() {
        for (const id in REGLAS) {
            limpiarError(id);
        }
        actualizarBotonGuardar();
    }

    // Escuchamos eventos de escritura y pérdida de foco para validar en tiempo real
    document.addEventListener('DOMContentLoaded', () => {
        for (const id in REGLAS) {
            const campo = document.getElementById(id);
            if (campo) {
                campo.addEventListener('blur', () => validarCampo(id));
                campo.addEventListener('input', () => {
                    validarCampo(id);
                    actualizarBotonGuardar();
                });
                
                // Actualiza el contador de caracteres para el campo de notas
                if (id === 'inp-notas') {
                    const contador = document.getElementById('contadorNotas');
                    campo.addEventListener('input', () => {
                        const longitud = campo.value.length;
                        contador.textContent = `${longitud} / 100`;
                        
                        if (longitud >= 100) {
                            contador.className = 'contador-caracteres mt-1 limite-alcanzado';
                        } else if (longitud >= 90) {
                            contador.className = 'contador-caracteres mt-1 cerca-limite';
                        } else {
                            contador.className = 'contador-caracteres mt-1';
                        }
                    });
                }
            }
        }
    });

    return {
        validarCampo,
        validarFormulario,
        mostrarError,
        limpiarError,
        marcarValido,
        resetearValidacion,
        actualizarBotonGuardar
    };

})();


