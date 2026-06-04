/**
 * Módulo: snakeLevels.js
 * Responsabilidad: Definición de los 10 niveles de Snake.
 */

export const NIVELES_SNAKE = [
  {
    numero: 1,
    nombre: 'El primer sobrecito',
    velocidadBase: 180,
    tamañoMapa: { columnas: 20, filas: 20 },
    obstaculos: [],
    enemigoIA: false,
    cantidadEnemigos: 0,
    zonasLentas: [],
    portales: [],
    objetosFalsos: false,
    obstaculosMoviles: false,
    umbralPuntaje: 80,
    mensajeInicio: '¡Recolectá billetes para Chiqui Tapia!'
  },
  {
    numero: 2,
    nombre: 'Muros del club',
    velocidadBase: 160,
    tamañoMapa: { columnas: 20, filas: 20 },
    obstaculos: [
      { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 },
      { x: 14, y: 14 }, { x: 15, y: 14 }, { x: 16, y: 14 }
    ],
    enemigoIA: false,
    cantidadEnemigos: 0,
    zonasLentas: [],
    portales: [],
    objetosFalsos: false,
    obstaculosMoviles: false,
    umbralPuntaje: 120,
    mensajeInicio: 'Cuidado con los muros estáticos.'
  },
  {
    numero: 3,
    nombre: 'Subasta acelerada',
    velocidadBase: 120,
    tamañoMapa: { columnas: 20, filas: 20 },
    obstaculos: [
      { x: 10, y: 3 }, { x: 10, y: 4 }, { x: 10, y: 16 },
      { x: 10, y: 17 }
    ],
    enemigoIA: false,
    cantidadEnemigos: 0,
    zonasLentas: [],
    portales: [],
    objetosFalsos: false,
    obstaculosMoviles: false,
    umbralPuntaje: 150,
    mensajeInicio: 'La velocidad subió. ¡No te distraigas!'
  },
  {
    numero: 4,
    nombre: 'Rival en la tribuna',
    velocidadBase: 110,
    tamañoMapa: { columnas: 20, filas: 20 },
    obstaculos: [{ x: 9, y: 10 }, { x: 10, y: 10 }],
    enemigoIA: true,
    cantidadEnemigos: 1,
    zonasLentas: [],
    portales: [],
    objetosFalsos: false,
    obstaculosMoviles: false,
    umbralPuntaje: 180,
    mensajeInicio: 'Apareció una serpiente enemiga.'
  },
  {
    numero: 5,
    nombre: 'Zona de auditoría',
    velocidadBase: 100,
    tamañoMapa: { columnas: 20, filas: 20 },
    obstaculos: [],
    enemigoIA: true,
    cantidadEnemigos: 1,
    zonasLentas: [
      { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 17, y: 17 },
      { x: 18, y: 17 }
    ],
    portales: [],
    objetosFalsos: false,
    obstaculosMoviles: false,
    umbralPuntaje: 200,
    mensajeInicio: 'Las zonas grises te frenan.'
  },
  {
    numero: 6,
    nombre: 'Túneles truchos',
    velocidadBase: 95,
    tamañoMapa: { columnas: 20, filas: 20 },
    obstaculos: [],
    enemigoIA: true,
    cantidadEnemigos: 1,
    zonasLentas: [],
    portales: [
      { entrada: { x: 0, y: 10 }, salida: { x: 19, y: 10 } },
      { entrada: { x: 10, y: 0 }, salida: { x: 10, y: 19 } }
    ],
    objetosFalsos: false,
    obstaculosMoviles: false,
    umbralPuntaje: 220,
    mensajeInicio: 'Usá los portales para escapar.'
  },
  {
    numero: 7,
    nombre: 'Oficina reducida',
    velocidadBase: 90,
    tamañoMapa: { columnas: 16, filas: 16 },
    obstaculos: [
      { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 8, y: 11 },
      { x: 8, y: 12 }
    ],
    enemigoIA: true,
    cantidadEnemigos: 1,
    zonasLentas: [],
    portales: [],
    objetosFalsos: false,
    obstaculosMoviles: false,
    umbralPuntaje: 240,
    mensajeInicio: 'El mapa se achicó un 20%.'
  },
  {
    numero: 8,
    nombre: 'Sobres falsos',
    velocidadBase: 85,
    tamañoMapa: { columnas: 16, filas: 16 },
    obstaculos: [],
    enemigoIA: true,
    cantidadEnemigos: 1,
    zonasLentas: [],
    portales: [],
    objetosFalsos: true,
    obstaculosMoviles: false,
    umbralPuntaje: 260,
    mensajeInicio: '¡No comas comida trampa!'
  },
  {
    numero: 9,
    nombre: 'Patrulla móvil',
    velocidadBase: 75,
    tamañoMapa: { columnas: 16, filas: 16 },
    obstaculos: [],
    enemigoIA: true,
    cantidadEnemigos: 2,
    zonasLentas: [],
    portales: [],
    objetosFalsos: true,
    obstaculosMoviles: true,
    umbralPuntaje: 300,
    mensajeInicio: 'Obstáculos móviles en patrulla.'
  },
  {
    numero: 10,
    nombre: 'Modo Extremo Corrupción',
    velocidadBase: 60,
    tamañoMapa: { columnas: 16, filas: 16 },
    obstaculos: [
      { x: 4, y: 8 }, { x: 12, y: 8 }
    ],
    enemigoIA: true,
    cantidadEnemigos: 3,
    zonasLentas: [{ x: 7, y: 7 }, { x: 8, y: 8 }],
    portales: [
      { entrada: { x: 0, y: 8 }, salida: { x: 15, y: 8 } }
    ],
    objetosFalsos: true,
    obstaculosMoviles: true,
    umbralPuntaje: 400,
    mensajeInicio: '¡Todo junto! Modo extremo.'
  }
];

export const MAX_NIVELES = NIVELES_SNAKE.length;
