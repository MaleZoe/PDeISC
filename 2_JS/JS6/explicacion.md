# Explicación Académica y Arquitectura del Proyecto: "Juego del Ahorcado Full Stack"

Este documento presenta una guía pedagógica integral y sencilla sobre el diseño, la arquitectura y el funcionamiento interno del Trabajo Práctico Profesional **Juego del Ahorcado Full Stack**, desarrollado bajo estándares de ingeniería de software Senior utilizando **Node.js, Express (ES Modules), MySQL, Clases ES6, Bootstrap 5 y jsPDF**.

---

## 1. Visión General de la Arquitectura (ES Modules)

El proyecto elimina por completo el uso del sistema tradicional CommonJS (`require()`) de Node.js, adoptando el estándar de módulos ECMAScript (**ES Modules**, con palabras clave `import` y `export`). Esta decisión homogeneiza la forma de escribir código moderno entre el servidor (Backend Node/Express) y el navegador (Frontend JavaScript).

### Estructura de Carpetas Modular
```
/
├── package.json           -> Configuración del proyecto con "type": "module" y dependencias.
├── server.js              -> Servidor principal Express (Puerto 3000) y ruteo estático.
├── .env                   -> Configuración de variables de entorno (Credenciales MySQL).
├── /database
│   ├── connection.js      -> Pool de conexiones a MySQL con `mysql2/promise` y auto-init.
│   └── init_db.sql        -> Script SQL de creación de base `Score` y tabla `score`.
├── /models
│   ├── Palabra.model.js   -> Diccionario curado interno con pistas por categoría.
│   └── Score.model.js     -> Consultas SQL (Prepared Statements) para persistencia.
├── /controllers
│   ├── palabras.controller.js -> Lógica para obtener palabras desde API externa con fallback.
│   └── scores.controller.js   -> Nivel 3 de validación y sanitización en backend.
├── /routes
│   ├── palabras.routes.js -> Endpoint `GET /api/palabra`.
│   └── scores.routes.js   -> Endpoints `POST /api/score` y `GET /api/score`.
├── /modules (Frontend Clases ES6)
│   ├── Juego.js           -> Clase `Juego`: Lógica pura, aciertos/errores y puntaje.
│   ├── UI.js              -> Clase `UI`: Manipulación de DOM, SVG, Toasts y Modales.
│   └── Temporizador.js    -> Clase `Temporizador`: Cronometraje en segundos reales.
├── /scripts (Frontend Controladores)
│   ├── app.js             -> Orquestador del juego y eventos del teclado/ratón.
│   ├── ranking.js         -> Controlador de la tabla de posiciones (`ranking.html`).
│   ├── validations.js     -> Nivel 2 de validación (tiempo real con bordes e invalid-feedback).
│   ├── pdfGenerator.js    -> Generación de diplomas y reportes en PDF con `jsPDF`.
│   └── themeManager.js    -> Modo claro/oscuro persistente y botón "Volver Arriba".
├── /styles                -> Hojas de estilo modulares (`main.css`, `dark-theme.css`, etc.).
└── /pages                 -> Vistas HTML (`index.html`, `ranking.html`, `instrucciones.html`).
```

---

## 2. Explicación de Cada Módulo y Capa

### A. Capa de Base de Datos y Persistencia (`/database` y `/models`)
- **`connection.js`**: Implementa un **Pool de Conexiones (Connection Pool)** utilizando `mysql2/promise`. El pool es muy superior a una conexión única porque gestiona la concurrencia abriendo y reciclando conexiones automáticamente. Además, incluye la función `checkAndInitDatabase()` que verifica si la base de datos `Score` y la tabla `score` existen al arrancar; si no existen, las crea automáticamente para facilitar la evaluación sin pasos manuales en MySQL.
- **`Score.model.js`**: Contiene las consultas SQL para insertar (`guardarScore`) y obtener el ranking (`obtenerTopScores`). Todas las consultas utilizan **Prepared Statements (`?`)** para bloquear cualquier intento de **Inyección SQL (SQLi)**.
- **`Palabra.model.js`**: Proporciona un diccionario curado interno con pistas y categorías. Además, incluye la función `sanitizarPalabra()` que normaliza textos eliminando tildes diacríticas y caracteres extraños (dejando A-Z y Ñ).

### B. Controladores y Enrutamiento Backend (`/controllers` y `/routes`)
- **`palabras.controller.js`**: Al llamarse a `GET /api/palabra`, intenta consultar una palabra de una API REST externa (`random-word-api.herokuapp.com`). Para evitar que la aplicación se congele si no hay internet o si la API es lenta, se configura un temporizador (`AbortController`). Si falla la API externa, el controlador degrada con elegancia (fallback) y entrega instantáneamente una palabra de `Palabra.model.js`.
- **`scores.controller.js`**: Aplica el **Nivel 3 de Validación (Backend)** antes de insertar en MySQL. Verifica que `nombre` sea un string entre 3 y 30 caracteres, que no contenga inyecciones XSS (etiquetas `<script>`), y que `puntos` y `tiempo` sean enteros positivos coherentes.

### C. Módulos y Clases de Lógica de Cliente (`/modules`)
Siguen estricta separación de responsabilidades:
1. **Clase `Juego` (`/modules/Juego.js`)**:
   - Es el "cerebro lógico" sin contacto con el DOM.
   - Maneja la palabra secreta, un `Set` con letras acertadas y otro `Set` con letras erradas (lo que impide que se dupliquen intentos).
   - Controla los intentos restantes (iniciando en 6, uno por cada parte del cuerpo en la horca).
   - Contiene la fórmula matemática de puntaje:
     $$\text{Puntos} = (\text{Letras Únicas} \times 100) + (\text{Intentos Restantes} \times 150) + \max(0, 500 - \text{Segundos} \times 10)$$
2. **Clase `UI` (`/modules/UI.js`)**:
   - Encapsula la comunicación con la pantalla.
   - Renderiza las casillas de la palabra, el teclado virtual, las notificaciones Toast de Bootstrap 5 y los modales.
   - **SVG Progresivo (`actualizarAhorcadoSVG`)**: En lugar de imágenes estáticas, manipula la opacidad de los nodos SVG (`cabeza`, `torso`, `brazo-izquierdo`, `brazo-derecho`, `pierna-izquierd`, `pierna-derecha`) para dibujar al ahorcado de forma suave y animada según los errores cometidos.
3. **Clase `Temporizador` (`/modules/Temporizador.js`)**:
   - Mide la duración de la partida con precisión asíncrona (`setInterval`) notificando segundo a segundo a la UI sin acoplarse directamente a ella mediante una función callback (`onTick`).

### D. Controladores de Cliente e Intermediarios (`/scripts`)
- **`app.js`**: Conecta los eventos del teclado físico (`keydown`) y los clics en el teclado virtual con `Juego` y `UI`. Comprueba si se ha ganado o perdido y muestra el modal respectivo con el formulario para registrar en MySQL.
- **`validations.js`**: Implementa el **Nivel 2 de Validación (Tiempo Real en JS)**. Escucha cuando el usuario escribe su nombre (`oninput`) e inyecta o remueve las clases `is-valid` y `is-invalid` de Bootstrap, mostrando el mensaje de error exacto debajo del input e imposibilitando el envío (`preventDefault`) si no cumple con las reglas.
- **`pdfGenerator.js`**: Utiliza `jsPDF` desde CDN para generar dos documentos estructurados y decorados: el Diploma Oficial de Rendimiento de Partida (para descargar en modales de victoria) y el Reporte Completo del Ranking (desde `ranking.html`).
- **`themeManager.js`**: Detecta la preferencia de tema en `localStorage`, la aplica al atributo `data-bs-theme` de `<html data-bs-theme="dark">` y controla la aparición del botón flotante "Volver Arriba" mediante el evento de `scroll` (`window.scrollY > 250`).

---

## 3. Flujo Lógico de una Partida Paso a Paso

1. **Inicio de Partida:** El usuario entra a `http://localhost:3000/`. El archivo `app.js` llama a `iniciarNuevaPartida()`. Se muestra el spinner y se realiza una petición a `GET /api/palabra`.
2. **Recepción del Reto:** El backend retorna `{ palabra, pista, categoria }`. Se inicializa `Juego.inicializar()`, se dibuja la estructura vacía en pantalla y arranca `Temporizador.iniciar()`.
3. **Pulsación de Letra:** El usuario hace clic en una letra (ej: 'E') o la pulsa en su teclado. `app.js` llama a `juego.intentarLetra('E')`.
4. **Evaluación de Intento:**
   - Si la palabra tiene 'E': Se agrega al `Set` de `letrasAcertadas`, se revela en la UI y se reproduce la animación de acierto en el botón del teclado.
   - Si la palabra NO tiene 'E': Se agrega al `Set` de `letrasIncorrectas`, se resta 1 a `intentosRestantes`, se marca en rojo en el teclado virtual (animación de sacudida `.shake-error`), y se dibuja una parte más del cuerpo en el SVG.
5. **Fin de Partida (Victoria / Derrota):**
   - **Si se aciertan todas las letras:** `Juego.verificarVictoria()` cambia el estado a `'ganado'`. Se detiene el cronómetro, se calculan los puntos exactos y se lanza un modal triunfal. El usuario ingresa su nombre (validado en tiempo real) y se hace `POST /api/score` a MySQL. A continuación, puede descargar un Diploma Oficial en PDF.
   - **Si los intentos llegan a 0:** Se cambia el estado a `'perdido'`, se revela cuál era la palabra secreta en color rojo/gris y se invita al jugador a intentar con otra palabra.

---

## 4. Las 3 Capas de Seguridad y Validación

| Nivel de Validación | Dónde se ejecuta | Mecanismo | Beneficio Académico y Profesional |
| :--- | :--- | :--- | :--- |
| **Nivel 1: HTML5** | Navegador (Declarativo) | Atributos `required`, `minlength="3"`, `maxlength="30"`, `pattern` en formularios. | Primera barrera nativa, gratuita e inmediata para el usuario común. |
| **Nivel 2: JS Cliente** | Navegador (`validations.js`) | Eventos `input` / `blur`, clases `is-valid`/`is-invalid` y `.invalid-feedback`. | Excelente UX: retroalimentación visual al segundo sin saltar molestos `alert()`. |
| **Nivel 3: Backend Node** | Servidor Express (`scores.controller.js`) | Verificación estricta de tipos de datos, longitud exactas, sanitización contra XSS y **Prepared Statements (`?`)** para MySQL. | Seguridad infranqueable: previene trampa mediante Postman/cURL e inyecciones SQL en la base `Score`. |

---

## 5. Instrucciones para Ejecutar y Evaluar el Proyecto

1. **Asegurar base de datos MySQL activa:** Encienda el servicio de MySQL de su sistema (mediante XAMPP, WAMP, MAMP o Docker) en el puerto `3306`.
2. **Instalar dependencias:** Abrir una terminal en la carpeta principal del proyecto y ejecutar:
   ```bash
   npm install
   ```
3. **Iniciar servidor:**
   ```bash
   npm start
   ```
   *(O alternativamente en modo desarrollo observador: `npm run dev`)*
4. **Abrir en navegador web:**
   Ingresar a `http://localhost:3000/`. El sistema habrá verificado y creado automáticamente la base de datos `Score` y la tabla `score`. ¡Listo para evaluar y jugar!
