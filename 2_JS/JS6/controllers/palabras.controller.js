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
    // Configuramos un temporizador de 2.5 segundos para no bloquear la app si la API externa es lenta
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    console.log('🌐 Solicitando palabra aleatoria externa desde API...');
    
    // Intentamos hacer fetch a la API externa
    const respuestaExterna = await fetch(CONFIG.API_EXTERNA_PALABRAS, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (respuestaExterna.ok) {
      const datos = await respuestaExterna.json();
      
      // La API de random-word-api devuelve un array: ["palabra"]
      if (Array.isArray(datos) && datos.length > 0 && typeof datos[0] === 'string') {
        const palabraObtenida = PalabraModel.sanitizarPalabra(datos[0]);
        
        // Validamos que la longitud sea razonable para jugar al Ahorcado (entre 4 y 16 letras)
        if (palabraObtenida.length >= 4 && palabraObtenida.length <= 16) {
          console.log(`✅ Palabra externa obtenida con éxito: ${palabraObtenida}`);
          
          return res.status(200).json({
            exito: true,
            origen: 'API_EXTERNA',
            palabra: palabraObtenida,
            pista: 'Palabra aleatoria obtenida desde diccionario en línea',
            categoria: 'Diccionario General',
            longitud: palabraObtenida.length
          });
        }
      }
    }
    
    // Si la palabra externa era inválida o la respuesta no fue 'ok', pasamos al fallback interno
    throw new Error('Respuesta externa no válida o palabra fuera de rango optimizado.');

  } catch (error) {
    // Capturamos errores de red, timeouts o caídas del servicio externo sin interrumpir la UX
    console.warn(`⚠️ API externa no accesible o lenta (${error.message}). Utilizando diccionario curado interno.`);
    
    // Fallback: Obtenemos palabra del modelo interno
    const palabraInterna = PalabraModel.obtenerPalabraAleatoriaInterna();

    return res.status(200).json({
      exito: true,
      origen: 'DICCIONARIO_INTERNO',
      ...palabraInterna
    });
  }
}

export default {
  obtenerPalabra
};
