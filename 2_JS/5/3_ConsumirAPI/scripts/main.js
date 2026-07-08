// 3_ConsumirAPI/scripts/main.js
import { validarNombre, validarApellido, validarEdad, actualizarUI } from "./validaciones.js";

// aca apunto a la api en el servidor 1
const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    const form          = document.getElementById("form-alumno");
    const inputNombre   = document.getElementById("nombre");
    const inputApellido = document.getElementById("apellido");
    const inputEdad     = document.getElementById("edad");
    const btnGuardar    = document.getElementById("btn-guardar");
    const btnCargar     = document.getElementById("btn-cargar-fetch");
    const msgExito      = document.getElementById("msg-exito");

    const feedbackNombre   = document.getElementById("feedback-nombre");
    const feedbackApellido = document.getElementById("feedback-apellido");
    const feedbackEdad     = document.getElementById("feedback-edad");

    // aca guardo el estado de validacion de cada campo
    const estado = { nombre: false, apellido: false, edad: false };

    // aca habilito o deshabilito el boton segun las validaciones
    function sincronizarBoton() {
        const todoValido = estado.nombre && estado.apellido && estado.edad;
        btnGuardar.disabled = !todoValido;
    }

    // aca valido el nombre mientras el usuario escribe
    inputNombre.addEventListener("input", () => {
        const resultado = validarNombre(inputNombre.value);
        actualizarUI(inputNombre, feedbackNombre, resultado);
        estado.nombre = resultado.valido;
        sincronizarBoton();
    });

    // aca valido el apellido mientras el usuario escribe
    inputApellido.addEventListener("input", () => {
        const resultado = validarApellido(inputApellido.value);
        actualizarUI(inputApellido, feedbackApellido, resultado);
        estado.apellido = resultado.valido;
        sincronizarBoton();
    });

    // aca valido la edad mientras el usuario escribe
    inputEdad.addEventListener("input", () => {
        const resultado = validarEdad(inputEdad.value);
        actualizarUI(inputEdad, feedbackEdad, resultado);
        estado.edad = resultado.valido;
        sincronizarBoton();
    });

    // aca cargo los alumnos al abrir la pagina automaticamente
    cargarAlumnos();

    // aca escucho el click del boton cargar con fetch
    btnCargar.addEventListener("click", () => {
        cargarAlumnos();
    });

    // aca escucho el submit del formulario para guardar el alumno
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const datos = {
            nombre:   inputNombre.value,
            apellido: inputApellido.value,
            edad:     inputEdad.value
        };

        try {
            // aca envio el POST a la api para insertar el alumno
            const respuesta = await fetch(`${API_URL}/alumnos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json();

                // aca muestro los errores que manda el backend
                if (errorData.errores) {
                    if (errorData.errores.nombre) {
                        actualizarUI(inputNombre, feedbackNombre, { valido: false, mensaje: errorData.errores.nombre });
                        estado.nombre = false;
                    }
                    if (errorData.errores.apellido) {
                        actualizarUI(inputApellido, feedbackApellido, { valido: false, mensaje: errorData.errores.apellido });
                        estado.apellido = false;
                    }
                    if (errorData.errores.edad) {
                        actualizarUI(inputEdad, feedbackEdad, { valido: false, mensaje: errorData.errores.edad });
                        estado.edad = false;
                    }
                    sincronizarBoton();
                }
                return;
            }

            // aca limpio el formulario despues de guardar exitosamente
            form.reset();
            inputNombre.classList.remove("input-valido");
            inputApellido.classList.remove("input-valido");
            inputEdad.classList.remove("input-valido");
            estado.nombre = estado.apellido = estado.edad = false;
            sincronizarBoton();

            // aca muestro el mensaje de exito brevemente
            msgExito.style.display = "block";
            setTimeout(() => { msgExito.style.display = "none"; }, 3000);

            // aca actualizo la tabla automaticamente
            cargarAlumnos();

        } catch (error) {
            console.error("Error al guardar el alumno:", error);
        }
    });
});

// aca hago el POST a /listar y relleno la tabla
async function cargarAlumnos() {
    const tablaBody     = document.getElementById("tabla-body");
    const badgeCantidad = document.getElementById("badge-cantidad");

    // aca muestro un indicador de carga mientras espero la respuesta
    tablaBody.innerHTML = `
        <tr>
            <td colspan="4" class="celda-vacia">
                Cargando datos desde la API...
            </td>
        </tr>`;

    try {
        // aca hago el POST a la ruta /listar tal como pide la consigna
        const respuesta = await fetch(`${API_URL}/listar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        if (!respuesta.ok) throw new Error("Error en la respuesta de la API");

        const alumnos = await respuesta.json();
        tablaBody.innerHTML = "";

        // aca actualizo el badge con la cantidad de alumnos
        if (badgeCantidad) {
            badgeCantidad.textContent = alumnos.length > 0 ? alumnos.length : "";
        }

        if (alumnos.length === 0) {
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="4" class="celda-vacia">
                        No hay alumnos registrados todavía.
                    </td>
                </tr>`;
            return;
        }

        // aca creo una fila por cada alumno que devuelve la api
        alumnos.forEach(alumno => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td class="id-celda">${alumno.id}</td>
                <td>${alumno.nombre}</td>
                <td>${alumno.apellido}</td>
                <td>${alumno.edad}</td>
            `;
            tablaBody.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar alumnos:", error);
        tablaBody.innerHTML = `
            <tr>
                <td colspan="4" class="celda-vacia" style="color: #e53e3e;">
                    ❌ No se puede conectar con la API en el puerto 3000. ¿Está corriendo?
                </td>
            </tr>`;
        if (badgeCantidad) badgeCantidad.textContent = "";
    }
}
