// 3_ConsumirAPI/scripts/validaciones.js

// aca valido el nombre: solo letras y apostrofes
export function validarNombre(valor) {
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ'\s]+$/;

    if (!valor || valor.trim() === "") {
        return { valido: false, mensaje: "El nombre es obligatorio." };
    }
    if (!soloLetras.test(valor)) {
        return { valido: false, mensaje: "Solo se permiten letras y apóstrofes." };
    }

    return { valido: true, mensaje: "" };
}

// aca valido el apellido: solo letras y apostrofes
export function validarApellido(valor) {
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ'\s]+$/;

    if (!valor || valor.trim() === "") {
        return { valido: false, mensaje: "El apellido es obligatorio." };
    }
    if (!soloLetras.test(valor)) {
        return { valido: false, mensaje: "Solo se permiten letras y apóstrofes." };
    }

    return { valido: true, mensaje: "" };
}

// aca valido la edad: numero entero entre 1 y 120
export function validarEdad(valor) {
    const num = Number(valor);

    if (valor === "" || valor === null || valor === undefined) {
        return { valido: false, mensaje: "La edad es obligatoria." };
    }
    if (!Number.isInteger(num) || isNaN(num)) {
        return { valido: false, mensaje: "La edad debe ser un número entero." };
    }
    if (num <= 0 || num > 120) {
        return { valido: false, mensaje: "La edad debe ser mayor a 0 y hasta 120." };
    }

    return { valido: true, mensaje: "" };
}

// aca pinto el input de rojo o verde y muestro el mensaje
export function actualizarUI(input, feedback, resultado) {
    if (resultado.valido) {
        input.classList.remove("input-invalido");
        input.classList.add("input-valido");
        feedback.textContent = "";
    } else {
        input.classList.remove("input-valido");
        input.classList.add("input-invalido");
        feedback.textContent = resultado.mensaje;
    }
}
