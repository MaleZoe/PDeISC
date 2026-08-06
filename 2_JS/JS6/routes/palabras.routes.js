/**
 * ============================================================================
 * ENRUTADOR DE PALABRAS (/routes/palabras.routes.js)
 * ============================================================================
 * Explicación didáctica:
 * Mapea las rutas HTTP entrantes con sus respectivos controladores.
 * Mantenemos un diseño RESTful donde `GET /api/palabra` devuelve un recurso (la palabra).
 */

import { Router } from 'express';
import palabrasController from '../controllers/palabras.controller.js';

const router = Router();

// Endpoint GET /api/palabra -> Obtiene una nueva palabra oculta para jugar
router.get('/palabra', palabrasController.obtenerPalabra);

export default router;
