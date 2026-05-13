// lógica de registro y validación estricta para el proyecto 6

document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('regForm');
    const previewCard = document.getElementById('previewCard');
    const noDataMsg = document.getElementById('noDataMsg');

    // inputs
    const inputNombre = document.getElementById('nombre');
    const inputEmail = document.getElementById('email');
    const inputFechaNac = document.getElementById('fechaNac');
    const inputDni = document.getElementById('dni');
    const selectCarrera = document.getElementById('carrera');
    const checkTerminos = document.getElementById('terminos');

    // previsualización
    const prevNombre = document.getElementById('prevNombre');
    const prevEmail = document.getElementById('prevEmail');
    const prevEdad = document.getElementById('prevEdad');
    const prevDni = document.getElementById('prevDni');
    const prevCarrera = document.getElementById('prevCarrera');
    const prevTurno = document.getElementById('prevTurno');
    const prevFecha = document.getElementById('prevFecha');
    const avatarInitial = document.getElementById('avatarInitial');

    // --- validaciones real-time ---

    const validarRealTime = (input, condicion) => {
        input.addEventListener('input', () => {
            if (condicion(input.value)) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
            }
        });
    };

    // nombre: solo letras
    validarRealTime(inputNombre, val => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val) && val.length > 2);

    // email: formato mail
    validarRealTime(inputEmail, val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));

    // dni: 7 u 8 dígitos
    validarRealTime(inputDni, val => val.length >= 7 && val.length <= 8);

    // fecha de nacimiento: < 120 años y no futura
    validarRealTime(inputFechaNac, val => {
        if (!val) return false;
        const hoy = new Date();
        const cumple = new Date(val);
        let edad = hoy.getFullYear() - cumple.getFullYear();
        const m = hoy.getMonth() - cumple.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) edad--;
        return edad >= 0 && edad <= 120;
    });

    // --- manejo del envío ---

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // chequeo final de validación nativa de bootstrap
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        // si todo está ok, renderizo dinámicamente
        noDataMsg.classList.add('d-none');
        previewCard.classList.remove('d-none');

        // nombre y avatar
        prevNombre.textContent = inputNombre.value;
        avatarInitial.textContent = inputNombre.value.charAt(0).toUpperCase();

        // email
        prevEmail.textContent = inputEmail.value;

        // dni
        prevDni.textContent = inputDni.value;

        // carrera
        prevCarrera.textContent = selectCarrera.value;

        // turno (radio)
        const turnoSel = document.querySelector('input[name="turno"]:checked');
        prevTurno.textContent = turnoSel ? turnoSel.value : '-';

        // edad calculada
        const cumple = new Date(inputFechaNac.value);
        const hoy = new Date();
        let edad = hoy.getFullYear() - cumple.getFullYear();
        if (hoy.getMonth() < cumple.getMonth() || (hoy.getMonth() === cumple.getMonth() && hoy.getDate() < cumple.getDate())) {
            edad--;
        }
        prevEdad.textContent = edad;

        // fecha actual formateada (DD/MM/AA) - Regla Estanga
        const d = hoy.getDate().toString().padStart(2, '0');
        const mo = (hoy.getMonth() + 1).toString().padStart(2, '0');
        const an = hoy.getFullYear().toString().slice(-2);
        prevFecha.textContent = `${d}/${mo}/${an}`;

        // limpio el formulario después de registrar
        form.reset();
        form.classList.remove('was-validated');
        
        // quito las clases de validación manual
        [inputNombre, inputEmail, inputDni, inputFechaNac].forEach(i => {
            i.classList.remove('is-valid', 'is-invalid');
        });
    });

});
