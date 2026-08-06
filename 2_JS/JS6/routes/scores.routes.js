/**
 * ============================================================================
 * ENRUTADOR DE PUNTUACIONES (/routes/scores.routes.js)
 * ============================================================================
 * Explicación didáctica:
 * Agrupa las operaciones REST sobre el recurso 'score'.
 * - POST /api/score -> Inserta una nueva puntuación en MySQL tras validar.
 * - GET /api/score -> Retorna el ranking ordenado por puntaje y tiempo.
 */

import { Router } from 'express';
import scoresController from '../controllers/scores.controller.js';

const router = Router();

// Endpoint POST /api/score -> Registrar nueva puntuación en la base de datos
router.post('/score', scoresController.guardarScore);

// Endpoint GET /api/score -> Obtener tabla de posiciones
router.get('/score', scoresController.obtenerScores);

export default router;
