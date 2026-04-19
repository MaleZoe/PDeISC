
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escribirArchivo } from '../ejercicio2/archivos.js';
import { renderLayout } from '../compartido/layout.js';
import { renderContenidoEjercicio1 } from '../ejercicio1/ejercicio1.js';
import { renderContenidoArchivos, crearGaleria } from '../ejercicio2/consigna2.js';
import { renderContenidoEjercicio3 } from '../ejercicio3/ejercicio3.js';
import { renderContenidoNPM } from '../ejercicio4/npm.js';
import { renderContenidoInicio } from '../ejercicio5/inicio.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.join(__dirname, '..', '..');

export async function generarSitio() {
  // Ejercicio 5: inicio del sitio.
  escribirArchivo(path.join(BASE, 'Pages', 'inicio.html'), renderLayout('Inicio', renderContenidoInicio(), '/'));

  // Ejercicio 1: modulos propios.
  escribirArchivo(path.join(BASE, 'Pages', 'ejercicio1', 'calculadora.html'), renderLayout('Ejercicio 1', renderContenidoEjercicio1(), '/calculo'));

  // Ejercicio 2: HTTP + File System.
  escribirArchivo(path.join(BASE, 'Pages', 'ejercicio2', 'archivos.html'), renderLayout('Ejercicio 2', renderContenidoArchivos(), '/archivos'));
  crearGaleria();

  // Ejercicio 3: modulo URL.
  escribirArchivo(path.join(BASE, 'Pages', 'ejercicio3', 'url-info.html'), renderLayout('Ejercicio 3', renderContenidoEjercicio3(), '/url'));

  // Ejercicio 4: paquete NPM.
  escribirArchivo(path.join(BASE, 'Pages', 'ejercicio4', 'npm.html'), renderLayout('Ejercicio 4', renderContenidoNPM(), '/npm'));
}
