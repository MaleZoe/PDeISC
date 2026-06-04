# Juegos Clásicos — Explicación del Proyecto

## 1. ¿Qué hace este proyecto?

Es una página web con dos juegos clásicos: **Snake** (tema Chiqui Tapia y los billetes) y **PacMan** (tema Escape Escolar). Podés jugar solo o con otra persona por internet usando Socket.IO. Los puntajes se guardan en un archivo JSON y podés ver el ranking top 10 de cada juego.

---

## 2. Estructura de carpetas

```
Proyecto/
├── package.json          → Dependencias y scripts npm
├── server.js             → Servidor Express + Socket.IO
├── pages/                → HTML de cada pantalla
│   ├── index.html        → Página principal (hub)
│   ├── snake.html        → Pantalla del juego Snake
│   └── pacman.html       → Pantalla del juego PacMan
├── styles/               → Estilos CSS
│   ├── global.css        → Estilos compartidos (navbar, ranking)
│   ├── snake.css         → Colores y layout de Snake
│   └── pacman.css        → Colores y layout de PacMan
├── scripts/              → JavaScript del cliente general
│   ├── app.js            → Lógica del index (ranking, navbar)
│   └── socketClient.js   → Conexión Socket.IO reutilizable
├── modules/              → Lógica de juegos separada por carpetas
│   ├── snake/            → Todo lo de Snake
│   ├── pacman/           → Todo lo de PacMan
│   ├── ranking/          → Leer/escribir players.json
│   └── sockets/          → Salas multijugador en el servidor
├── data/
│   └── players.json      → Lista de puntajes guardados
└── explicacion.md        → Este archivo
```

---

## 3. ¿Cómo funciona Snake?

- Movés a Chiqui (la serpiente) con flechas o joystick en el celular.
- Comés **billetes** (+10), **copas** (+50), **contratos** (+30) y **sobres** (+20).
- Hay **3 vidas**. Si chocás con pared, tu cuerpo o enemigos, perdés una.
- **10 niveles** con cosas distintas: muros, enemigos IA, zonas lentas, portales, mapa chico, comida trampa, obstáculos móviles.
- **Power-ups**: Turbo (más rápido), Congelar (frena enemigos), Inmunidad (atravesás paredes).
- Al terminar, un mensaje gracioso y el puntaje se guarda solo.

---

## 4. ¿Cómo funciona PacMan?

- Sos un estudiante (círculo amarillo) en un colegio.
- Recolectás **apuntes** (puntitos) y **exámenes aprobados** (cuadrados naranjas) que asustan a los fantasmas.
- Los fantasmas son: Director (rojo, persigue), Inspectora (rosa, emboscada), Preceptor (celeste, errático), Vicedirector (naranja, huye si estás cerca).
- **10 niveles** con más fantasmas, tiempo límite, oscuridad, pasillos de un solo sentido, etc.
- Frutas bonus dan puntos extra (lápiz, regla, carpeta, etc.).

---

## 5. ¿Para qué sirve cada módulo?

| Módulo | Función |
|--------|---------|
| `snakeGame.js` | Arranca el juego, loop, dibuja canvas |
| `snakePlayer.js` | Mueve la serpiente y detecta choques |
| `snakeLevels.js` | Datos de los 10 niveles |
| `snakeUI.js` | Modales, HUD, validación de nombre |
| `snakeMultiplayer.js` | Salas y eventos online de Snake |
| `pacmanGame.js` | Loop principal de PacMan |
| `ghosts.js` | IA de cada fantasma |
| `pacmanLevels.js` | Config de 10 niveles |
| `map.js` | Matrices del laberinto escolar |
| `pacmanMultiplayer.js` | Eventos online de PacMan |
| `ranking.js` | Guarda y lee `players.json` |
| `socketManager.js` | Salas y sincronización en servidor |
| `socketClient.js` | Conexión del navegador al servidor |

---

## 6. ¿Qué son los arrays y cómo se usan acá?

Un **array** es una lista ordenada de valores. En este proyecto:

- **`NIVELES_SNAKE`**: array con 10 objetos, uno por nivel.
- **`mapa[fila][columna]`**: array 2D donde cada número es una celda (0=pasillo, 1=pared, 2=apunte…).
- **`serpiente.cuerpo`**: array de posiciones `{x, y}` de cada segmento.
- **`fantasmas`**: array de objetos fantasma con su IA.
- **`players.json`**: array de registros de puntajes en disco.

Ejemplo: contar apuntes restantes recorre cada fila del mapa con `forEach`.

---

## 7. ¿Qué son los eventos de JavaScript?

Un **evento** es algo que pasa en la página (clic, tecla, touch) y vos registrás una función que reacciona.

- `keydown` → cambiar dirección de la serpiente.
- `pointerdown` / `pointerup` → controles táctiles.
- `input` → validar el nombre mientras escribís.
- `DOMContentLoaded` → arrancar la app cuando carga el HTML.
- `ResizeObserver` → redimensionar el canvas si cambia el tamaño de pantalla.

Bootstrap usa eventos como `show.bs.modal` para el ranking.

---

## 8. ¿Cómo funciona Socket.IO?

Socket.IO mantiene una **conexión en vivo** entre navegador y servidor (como un chat).

- **`emit('nombreEvento', datos)`** → enviás un mensaje.
- **`on('nombreEvento', callback)`** → escuchás cuando llega.

Ejemplo: el cliente hace `emit('movimientoSnake', { direccion: 'arriba' })` y el servidor responde con `emit('estadoJuegoSnake', estado)` a todos en la sala.

---

## 9. ¿Cómo funciona el multiplayer? (paso a paso)

1. Jugador 1 elige multijugador y pulsa **Crear Sala**.
2. El servidor genera un código de 4 letras (ej: `AB3K`) y lo devuelve.
3. Jugador 2 escribe el código y pulsa **Unirse**.
4. Cuando hay 2 jugadores, el servidor avisa con `jugadorUnido`.
5. Cada uno envía solo su **dirección**; el servidor valida y manda el **estado** a ambos.
6. Si alguien se va, aparece el modal "Tu oponente se desconectó".

---

## 10. ¿Qué validaciones hay y por qué importan?

| Campo | HTML | JavaScript | Servidor |
|-------|------|------------|----------|
| Nombre | `pattern`, `minlength`, `maxlength` | Regex en tiempo real, borde rojo/verde | `validarEntrada()` en POST |
| Puntaje | — | No envía si el juego no terminó bien | Entero ≥ 0 |
| Juego | — | — | Solo `snake` o `pacman` |
| Modo | — | — | `individual` o `multijugador` |
| Nivel | — | — | Entero 1–10 |

Sirven para que nadie mande datos basura ni rompa el ranking.

---

## 11. ¿Cómo se guardan los puntajes?

1. Al terminar la partida, el juego hace `fetch('/api/ranking', { method: 'POST', ... })`.
2. `server.js` valida el cuerpo con `validarEntrada()`.
3. Si está bien, `ranking.js` lee `data/players.json`, agrega un objeto con `uuid`, fecha y hora, y guarda el archivo.
4. Para ver el ranking: `GET /api/ranking?juego=snake` devuelve el top 10 ordenado.

---

## 12. ¿Cómo correr el proyecto localmente?

Abrí una terminal en la carpeta `Proyecto/` y ejecutá:

```bash
npm install
npm run dev
```

Para producción:

```bash
npm start
```

Abrí el navegador en: **http://localhost:3000**

- Inicio: `/`
- Snake: `/snake`
- PacMan: `/pacman`
