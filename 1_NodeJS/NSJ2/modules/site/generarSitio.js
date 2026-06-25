/**
 * modules/site/generarSitio.js
 * ─────────────────────────────────────────────────────────────────
 * Orquestador de la generación estática del sitio.
 *
 * RESPONSABILIDAD:
 *   Genera todos los archivos HTML del sitio dentro de /pages
 *   antes de que el servidor HTTP empiece a escuchar requests.
 *   Cada módulo de consigna aporta su contenido y renderLayout()
 *   los envuelve en el layout HTML base compartido.
 *
 * FLUJO:
 *   server.js → await generarSitio() → escribe /pages/*.html en disco
 *   Después el servidor solo lee esos archivos y los sirve.
 *
 * PÁGINAS GENERADAS:
 *   - pages/index.html          → Inicio (consigna5/inicio.js)
 *   - pages/consigna1/calculo.html → Módulos propios (consigna1.js)
 *   - pages/consigna2/archivos.html → File System (consigna2.js)
 *   - pages/consigna2/vista.html   → HTML generado por FS (consigna2.js)
 *   - pages/consigna3/url.html     → Análisis URL (consigna3.js)
 *   - pages/consigna4/npm.html     → Paquete NPM (npm.js)
 *
 * MÓDULOS NATIVOS USADOS:
 *   - node:path → construcción de rutas absolutas.
 *   - node:url  → fileURLToPath para __dirname en ES Modules.
 *   - node:fs   → usado internamente por escribirArchivo().
 * ─────────────────────────────────────────────────────────────────
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

import { escribirArchivo } from '../consigna2/archivos.js';
import { renderLayout } from '../shared/layout.js';
import { renderContenidoConsigna1 } from '../consigna1/consigna1.js';
import { renderContenidoArchivos, crearVista } from '../consigna2/consigna2.js';
import { renderContenidoConsigna3 } from '../consigna3/consigna3.js';
import { renderContenidoNPM } from '../consigna4/npm.js';
import { renderContenidoInicio } from '../consigna5/inicio.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.join(__dirname, '..', '..');

export async function generarSitio() {
  // Punto 5: inicio del sitio.
  escribirArchivo(path.join(BASE, 'pages', 'index.html'), renderLayout('Inicio', renderContenidoInicio(), '/'));

  // Punto 1: modulos propios.
  escribirArchivo(path.join(BASE, 'pages', 'consigna1', 'calculo.html'), renderLayout('Consigna 1', renderContenidoConsigna1(), '/calculo'));

  // Punto 2: HTTP + File System.
  escribirArchivo(path.join(BASE, 'pages', 'consigna2', 'archivos.html'), renderLayout('Consigna 2', renderContenidoArchivos(), '/archivos'));
  crearVista();

  // Punto 3: modulo URL.
  escribirArchivo(path.join(BASE, 'pages', 'consigna3', 'url.html'), renderLayout('Consigna 3', renderContenidoConsigna3(), '/url'));

  // Punto 4: paquete NPM.
  escribirArchivo(path.join(BASE, 'pages', 'consigna4', 'npm.html'), renderLayout('NPM', renderContenidoNPM(), '/npm'));
}
