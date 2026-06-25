// módulo que maneja la api propia de alumnos
import express from 'express';

const router = express.Router();

// array inicial con algunos alumnos de prueba
let alumnos = [
    { id: 1, nombre: 'Lucas Fernández', email: 'lucas@email.com', carrera: 'Ingeniería en Sistemas', legajo: 'S1001', creado: '25/06/26' },
    { id: 2, nombre: 'Sofía Gómez', email: 'sofia@email.com', carrera: 'Licenciatura en Computación', legajo: 'R1002', creado: '25/06/26' },
    { id: 3, nombre: 'Matías Rodríguez', email: 'matias@email.com', carrera: 'Tecnicatura en Programación', legajo: 'S1003', creado: '25/06/26' },
];

// contador para ids únicos
let nextId = 4;

// función para formatear la fecha actual
function fechaHoy() {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = String(hoy.getFullYear()).slice(2);
    return `${dia}/${mes}/${anio}`;
}

// función para validar el email
function emailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// función para validar que solo tenga letras y espacios
function soloLetras(texto) {
    return /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/.test(texto);
}

// función para validar que no tenga más de 2 letras consecutivas repetidas
function noRepeticionesConsecutivas(texto) {
    return !/(.)\1{2,}/.test(texto);
}

// función para validar el legajo
function legajoValido(legajo) {
    return /^[A-Z][0-9]{4}$/.test(legajo);
}

// traer todos los alumnos
router.get('/', (req, res) => {
    res.json({ ok: true, alumnos });
});

// agregar un alumno
router.post('/', (req, res) => {
    const { nombre, email, carrera, legajo } = req.body;

    // validaciones en backend
    if (!nombre || !email || !carrera || !legajo) {
        return res.status(400).json({ ok: false, error: 'todos los campos son obligatorios' });
    }

    if (!soloLetras(nombre)) {
        return res.status(400).json({ ok: false, error: 'el nombre solo puede tener letras' });
    }

    if (nombre.trim().length < 3) {
        return res.status(400).json({ ok: false, error: 'el nombre debe tener al menos 3 caracteres' });
    }

    if (!noRepeticionesConsecutivas(nombre)) {
        return res.status(400).json({ ok: false, error: 'el nombre no puede tener más de 2 letras consecutivas iguales' });
    }

    if (!emailValido(email)) {
        return res.status(400).json({ ok: false, error: 'el email no tiene un formato válido' });
    }

    if (!soloLetras(carrera)) {
        return res.status(400).json({ ok: false, error: 'la carrera solo puede tener letras' });
    }

    if (!legajoValido(legajo)) {
        return res.status(400).json({ ok: false, error: 'el legajo debe tener formato: una letra mayúscula seguida de 4 números (ej: S1001)' });
    }

    // verifico que no exista otro alumno con el mismo legajo
    const legajoDuplicado = alumnos.find(a => a.legajo === legajo);
    if (legajoDuplicado) {
        return res.status(400).json({ ok: false, error: 'ya existe un alumno con ese legajo' });
    }

    // verifico que no exista otro alumno con el mismo email
    const emailDuplicado = alumnos.find(a => a.email === email);
    if (emailDuplicado) {
        return res.status(400).json({ ok: false, error: 'ya existe un alumno con ese email' });
    }

    // creo el nuevo alumno
    const nuevo = {
        id: nextId++,
        nombre: nombre.trim(),
        email: email.trim(),
        carrera: carrera.trim(),
        legajo: legajo.trim(),
        creado: fechaHoy()
    };

    alumnos.push(nuevo);
    res.status(201).json({ ok: true, alumno: nuevo });
});

// editar un alumno
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, email, carrera, legajo } = req.body;
    const indice = alumnos.findIndex(a => a.id === id);

    if (indice === -1) {
        return res.status(404).json({ ok: false, error: 'alumno no encontrado' });
    }

    // validaciones iguales al post
    if (!nombre || !email || !carrera || !legajo) {
        return res.status(400).json({ ok: false, error: 'todos los campos son obligatorios' });
    }

    if (!soloLetras(nombre)) {
        return res.status(400).json({ ok: false, error: 'el nombre solo puede tener letras' });
    }

    if (nombre.trim().length < 3) {
        return res.status(400).json({ ok: false, error: 'el nombre debe tener al menos 3 caracteres' });
    }

    if (!noRepeticionesConsecutivas(nombre)) {
        return res.status(400).json({ ok: false, error: 'el nombre no puede tener más de 2 letras consecutivas iguales' });
    }

    if (!emailValido(email)) {
        return res.status(400).json({ ok: false, error: 'el email no tiene un formato válido' });
    }

    if (!soloLetras(carrera)) {
        return res.status(400).json({ ok: false, error: 'la carrera solo puede tener letras' });
    }

    if (!legajoValido(legajo)) {
        return res.status(400).json({ ok: false, error: 'el legajo debe tener formato: una letra mayúscula seguida de 4 números' });
    }

    // verifico duplicados excluyendo el alumno que estoy editando
    const legajoDuplicado = alumnos.find(a => a.legajo === legajo && a.id !== id);
    if (legajoDuplicado) {
        return res.status(400).json({ ok: false, error: 'ya existe un alumno con ese legajo' });
    }

    const emailDuplicado = alumnos.find(a => a.email === email && a.id !== id);
    if (emailDuplicado) {
        return res.status(400).json({ ok: false, error: 'ya existe un alumno con ese email' });
    }

    // actualizo el alumno conservando la fecha original
    alumnos[indice] = {
        ...alumnos[indice],
        nombre: nombre.trim(),
        email: email.trim(),
        carrera: carrera.trim(),
        legajo: legajo.trim()
    };

    res.json({ ok: true, alumno: alumnos[indice] });
});

// borrar un alumno
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = alumnos.findIndex(a => a.id === id);

    if (indice === -1) {
        return res.status(404).json({ ok: false, error: 'alumno no encontrado' });
    }

    alumnos.splice(indice, 1);
    res.json({ ok: true, mensaje: 'alumno eliminado correctamente' });
});

export default router;
