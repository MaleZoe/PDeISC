/**
 * Módulo: pacmanLevels.js
 * Responsabilidad: Definición de los 10 niveles de PacMan.
 */

export const NIVELES_PACMAN = [
  {
    numero: 1,
    nombre: 'Primer día de clases',
    mapa: 'nivel1',
    velocidadPacman: 3,
    velocidadFantasmas: 2,
    cantidadFantasmas: 2,
    tiempoAsustado: 8000,
    tiempoScatter: 7000,
    tiempoChase: 20000,
    visibilidadReducida: false,
    tiempoLimite: null,
    bonusFruta: 'lapiz'
  },
  {
    numero: 2,
    nombre: 'Segunda hora',
    mapa: 'nivel2',
    velocidadPacman: 3,
    velocidadFantasmas: 2.2,
    cantidadFantasmas: 3,
    tiempoAsustado: 7000,
    tiempoScatter: 6000,
    tiempoChase: 22000,
    visibilidadReducida: false,
    tiempoLimite: null,
    bonusFruta: 'regla'
  },
  {
    numero: 3,
    nombre: 'Recreo complicado',
    mapa: 'nivel3',
    velocidadPacman: 3.5,
    velocidadFantasmas: 2.5,
    cantidadFantasmas: 4,
    tiempoAsustado: 7000,
    tiempoScatter: 5000,
    tiempoChase: 25000,
    visibilidadReducida: false,
    tiempoLimite: null,
    bonusFruta: 'carpeta'
  },
  {
    numero: 4,
    nombre: 'Examen sorpresa',
    mapa: 'nivel4',
    velocidadPacman: 3.5,
    velocidadFantasmas: 2.8,
    cantidadFantasmas: 4,
    tiempoAsustado: 6000,
    tiempoScatter: 5000,
    tiempoChase: 25000,
    visibilidadReducida: false,
    tiempoLimite: 90000,
    bonusFruta: 'cuaderno'
  },
  {
    numero: 5,
    nombre: 'Modo agresivo',
    mapa: 'nivel5',
    velocidadPacman: 4,
    velocidadFantasmas: 3,
    cantidadFantasmas: 4,
    tiempoAsustado: 5000,
    tiempoScatter: 3000,
    tiempoChase: 35000,
    visibilidadReducida: false,
    tiempoLimite: null,
    bonusFruta: 'lapiz'
  },
  {
    numero: 6,
    nombre: 'Pasillos unidireccionales',
    mapa: 'nivel6',
    velocidadPacman: 4,
    velocidadFantasmas: 3,
    cantidadFantasmas: 4,
    tiempoAsustado: 6000,
    tiempoScatter: 5000,
    tiempoChase: 28000,
    visibilidadReducida: false,
    tiempoLimite: null,
    bonusFruta: 'regla'
  },
  {
    numero: 7,
    nombre: 'Corte de luz',
    mapa: 'nivel7',
    velocidadPacman: 4,
    velocidadFantasmas: 3.2,
    cantidadFantasmas: 4,
    tiempoAsustado: 6000,
    tiempoScatter: 5000,
    tiempoChase: 28000,
    visibilidadReducida: true,
    tiempoLimite: null,
    bonusFruta: 'carpeta'
  },
  {
    numero: 8,
    nombre: 'Más preceptores',
    mapa: 'nivel8',
    velocidadPacman: 4.5,
    velocidadFantasmas: 5,
    cantidadFantasmas: 6,
    tiempoAsustado: 5000,
    tiempoScatter: 4000,
    tiempoChase: 30000,
    visibilidadReducida: false,
    tiempoLimite: null,
    bonusFruta: 'cuaderno'
  },
  {
    numero: 9,
    nombre: 'IA predictiva',
    mapa: 'nivel9',
    velocidadPacman: 4.5,
    velocidadFantasmas: 3.5,
    cantidadFantasmas: 4,
    tiempoAsustado: 5000,
    tiempoScatter: 4000,
    tiempoChase: 32000,
    visibilidadReducida: false,
    tiempoLimite: null,
    bonusFruta: 'diploma',
    iaPredictiva: true
  },
  {
    numero: 10,
    nombre: 'Consejo de disciplina final',
    mapa: 'nivel10',
    velocidadPacman: 5,
    velocidadFantasmas: 5.5,
    cantidadFantasmas: 6,
    tiempoAsustado: 4000,
    tiempoScatter: 3000,
    tiempoChase: 40000,
    visibilidadReducida: true,
    tiempoLimite: 120000,
    bonusFruta: 'diploma',
    iaPredictiva: true
  }
];

export const BONUS_FRUTAS = {
  lapiz: { nombre: 'Lápiz', puntos: 100 },
  regla: { nombre: 'Regla', puntos: 300 },
  carpeta: { nombre: 'Carpeta', puntos: 500 },
  cuaderno: { nombre: 'Cuaderno', puntos: 700 },
  diploma: { nombre: 'Diploma', puntos: 1000 }
};
