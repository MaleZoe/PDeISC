/**
 * Módulo: ranking.js
 * Responsabilidad: Leer, escribir y ordenar puntajes en players.json.
 */

import { readFile, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { v4 as generarUuid } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RUTA_DATOS = join(__dirname, '../../data/players.json');


/**
 * Verifica si existe el archivo de datos y lo crea vacío.
 * @returns {Promise<void>}
 */
async function asegurarArchivo() {
  try {
    await access(RUTA_DATOS, constants.F_OK);
  } catch {
    await writeFile(RUTA_DATOS, '[]', 'utf-8');
  }
}


/**
 * Lee todos los registros del ranking.
 * @returns {Promise<Array>} Lista de jugadores
 */
export async function leerRanking() {
  await asegurarArchivo();
  const contenido = await readFile(RUTA_DATOS, 'utf-8');
  return JSON.parse(contenido);
}


/**
 * Guarda una nueva entrada de puntaje.
 * @param {Object} entrada - Datos del puntaje
 * @returns {Promise<Object>} Entrada guardada con id
 */
export async function guardarPuntaje(entrada) {
  await asegurarArchivo();
  const lista = await leerRanking();
  const registro = {
    id: generarUuid(),
    nombre: entrada.nombre,
    puntaje: entrada.puntaje,
    juego: entrada.juego,
    modo: entrada.modo,
    nivel: entrada.nivel,
    fecha: entrada.fecha,
    hora: entrada.hora
  };
  lista.push(registro);
  await writeFile(RUTA_DATOS, JSON.stringify(lista, null, 2), 'utf-8');
  return registro;
}


/**
 * Obtiene el top 10 de un juego ordenado por puntaje.
 * @param {string} juego - 'snake' | 'pacman'
 * @returns {Promise<Array>} Top 10 registros
 */
export async function obtenerTop10(juego) {
  const lista = await leerRanking();
  return lista
    .filter((r) => r.juego === juego)
    .sort((a, b) => b.puntaje - a.puntaje)
    .slice(0, 10);
}
