import { Router } from 'express';
import { crearAlumno, listarAlumnos, eliminarAlumno } from '../controllers/alumnosController.js';

const router = Router();

// Acá defino la ruta POST para registrar un alumno nuevo
router.post('/alumnos', crearAlumno);

// Acá defino la ruta POST para obtener el listado completo de alumnos
router.post('/listar-alumnos', listarAlumnos);

// Acá defino la ruta DELETE para eliminar un alumno por su ID
router.delete('/alumnos/:id', eliminarAlumno);

export default router;

