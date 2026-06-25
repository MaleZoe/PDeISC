/**
 * modules/consigna2/archivos.js
 * ─────────────────────────────────────────────────────────────────
 * Módulo nativo Node.js: node:fs (File System).
 * Consigna 2 — Operaciones de escritura en el sistema de archivos.
 *
 * RESPONSABILIDAD ÚNICA:
 *   Expone escribirArchivo(), una función helper que abstrae la
 *   escritura de archivos en disco con creación automática de
 *   directorios intermedios.
 *
 * MÓDULOS NATIVOS USADOS:
 *   - node:fs   → existsSync, mkdirSync, writeFileSync.
 *   - node:path → dirname para obtener la carpeta de destino.
 *
 * USO:
 *   import { escribirArchivo } from './archivos.js';
 *   escribirArchivo('/ruta/absoluta/archivo.html', '<html>...</html>');
 * ─────────────────────────────────────────────────────────────────
 */
import fs from 'node:fs';
import path from 'node:path';

/**
 * Escribe un archivo de texto en disco.
 * Si la carpeta destino no existe, la crea recursivamente.
 *
 * @param {string} rutaArchivo - Ruta absoluta del archivo a crear/sobreescribir.
 * @param {string} contenido   - Contenido de texto (HTML, CSS, etc.) a escribir.
 */
export function escribirArchivo(rutaArchivo, contenido) {
  // Extrae la carpeta donde irá el archivo.
  const carpeta = path.dirname(rutaArchivo);

  // Si la carpeta no existe, la crea junto con todos los directorios intermedios.
  if (!fs.existsSync(carpeta)) {
    fs.mkdirSync(carpeta, { recursive: true });
  }

  // Escribe el contenido en el archivo de forma síncrona con codificación UTF-8.
  fs.writeFileSync(rutaArchivo, contenido, 'utf8');
}
