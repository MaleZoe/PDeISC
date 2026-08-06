/**
 * ============================================================================
 * CONTROLADOR DE PALABRAS (palabras.controller.js)
 * ============================================================================
 * Explicación didáctica:
 * Los controladores se encargan de gestionar la petición HTTP (Request) y retornar
 * una respuesta HTTP (Response) en formato JSON.
 * 
 * Estrategia Resiliente (Fallback/Degradación elegante):
 * Intentamos obtener una palabra aleatoria de una API externa utilizando `fetch()`
 * nativo de Node.js con un tiempo límite (`AbortController`). Si la API externa no
 * responde con rapidez o no hay conexión a internet, el controlador recurre de
 * forma inmediata y transparente al `PalabraModel` interno, asegurando que el estudiante
 * o profesor NUNCA experimente un fallo que impida jugar.
 */

import PalabraModel from '../models/Palabra.model.js';
import CONFIG from '../context/config.js';

export async function obtenerPalabra(req, res) {
  try {
    // Retornamos directamente la palabra del diccionario interno para garantizar que TODAS
    // las palabras tengan su pista y categoría correspondientes (eliminando el uso de API externa genérica).
    const palabraInterna = PalabraModel.obtenerPalabraAleatoriaInterna();

    return res.status(200).json({
      exito: true,
      origen: 'DICCIONARIO_INTERNO',
      ...palabraInterna
    });
  } catch (error) {
    console.error('Error al obtener la palabra:', error);
    return res.status(500).json({ exito: false, mensaje: 'Error al procesar la palabra' });
  }
}

export default {
  obtenerPalabra
};
