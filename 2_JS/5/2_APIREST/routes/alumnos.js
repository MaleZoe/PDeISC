// 2_APIREST/routes/alumnos.js
import express from "express";
import conexion from "../modules/conexion.js";

const router = express.Router();

// aca valido los datos que llegan antes de tocar la base
function validarAlumno(nombre, apellido, edad) {
    const errores = {};
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ'\s]+$/;

    // valido el nombre
    if (!nombre || nombre.trim() === "") {
        errores.nombre = "El nombre es obligatorio.";
    } else if (!soloLetras.test(nombre)) {
        errores.nombre = "El nombre solo puede tener letras y apóstrofes.";
    }

    // valido el apellido
    if (!apellido || apellido.trim() === "") {
        errores.apellido = "El apellido es obligatorio.";
    } else if (!soloLetras.test(apellido)) {
        errores.apellido = "El apellido solo puede tener letras y apóstrofes.";
    }

    // valido la edad
    const edadNum = Number(edad);
    if (edad === undefined || edad === null || String(edad).trim() === "") {
        errores.edad = "La edad es obligatoria.";
    } else if (!Number.isInteger(edadNum) || isNaN(edadNum)) {
        errores.edad = "La edad debe ser un número entero.";
    } else if (edadNum <= 0 || edadNum > 120) {
        errores.edad = "La edad debe ser mayor a 0 y hasta 120.";
    }

    return {
        valido: Object.keys(errores).length === 0,
        errores
    };
}

// aca devuelvo todos los alumnos en formato json
router.post("/listar", (req, res) => {
    const sql = "SELECT id, nombre, apellido, edad FROM alumnos";

    conexion.query(sql, (error, resultados) => {
        if (error) {
            return res.status(500).json({ error: "Error al consultar la base de datos" });
        }

        res.json(resultados);
    });
});

// aca guardo el alumno en la base
router.post("/alumnos", (req, res) => {
    const { nombre, apellido, edad } = req.body;

    // nunca confio en el frontend, valido de nuevo aca
    const validacion = validarAlumno(nombre, apellido, edad);

    if (!validacion.valido) {
        return res.status(400).json({ errores: validacion.errores });
    }

    const sql = "INSERT INTO alumnos (nombre, apellido, edad) VALUES (?, ?, ?)";
    const valores = [nombre.trim(), apellido.trim(), Number(edad)];

    conexion.query(sql, valores, (error, resultado) => {
        if (error) {
            return res.status(500).json({ error: "Error al insertar en la base de datos" });
        }

        res.json({
            id: resultado.insertId,
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            edad: Number(edad)
        });
    });
});

export default router;
