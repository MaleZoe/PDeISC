# Documentación del Código — Estanga Education (Proyectos A y B)

Esta documentación está pensada para ser **clara, directa y fácil de entender** por cualquier desarrollador o evaluador sin saturar de tecnicismos o explicaciones excesivas.

---

## 🏗 Arquitectura General

El sistema se divide en **dos servidores independientes** pero conectados entre sí mediante **API REST** y **CORS**:

1. **Proyecto A (`http://localhost:3000`)**: Backend con Express + Base de Datos MySQL (`alumnosdb`) y una interfaz de administración completa.
2. **Proyecto B (`http://localhost:3001`)**: Portal Frontend académico que consume los datos expuestos por el Proyecto A utilizando **Fetch** o **Axios**.

---

## 📁 Proyecto A — Gestión y Base de Datos (`/Proyecto-A-BaseDatos-API`)

### 1. Backend (`/server.js`, `/routes/`, `/controllers/`, `/database/`)
- **`server.js`**: Punto de entrada de Node.js/Express en el **puerto 3000**. Configura la lectura de JSON (`express.json()`), sirve la página estática (`index.html`), habilita **CORS** para que el Proyecto B pueda conectarse, e importa las rutas.
- **`database/conexion.js`**: Configura y exporta el **Pool de MySQL** (`mysql2/promise`) conectado a `alumnosdb`. Un pool permite reutilizar conexiones sin saturar la base de datos.
- **`routes/alumnosRoutes.js`**: Define las URL exactas de la API REST (`POST /api/alumnos`, `POST /api/listar-alumnos`, `DELETE /api/alumnos/:id`).
- **`controllers/alumnosController.js`**: Contiene la lógica central de cada ruta:
  - `crearAlumno()`: Valida los datos entrantes y ejecuta el `INSERT INTO alumnos...`.
  - `listarAlumnos()`: Ejecuta la consulta `SELECT * FROM alumnos ORDER BY id ASC` y devuelve un JSON.
  - `eliminarAlumno()`: Verifica que el ID sea numérico y ejecuta el `DELETE FROM alumnos WHERE id = ?`.

### 2. Validaciones (`/validaciones/validaciones.js`)
- Módulo compartido entre el frontend y el backend (doble seguridad).
- **Reglas del Nombre/Apellido (`validarTextoReal`)**: Obligatorio, 2 a 100 caracteres, sin números, con vocales (evita "asdf" o "qwrty") y no permite palabras en lista negra (`test`, `qwerty`, `spam`).
- **Reglas de Edad (`validarEdad`)**: Número entero obligatorio, entre 1 y 120 años.

### 3. Frontend (`/pages/index.html`, `/scripts/app.js`, `/context/`)
- **`index.html`**: Estructura de dos columnas. Izquierda: Panel explicativo y diagrama de flujo horizontal (`→`). Derecha: Formulario compacto de registro y listado inferior de alumnos con botón de eliminación (`🗑 Eliminar`).
- **`scripts/app.js`**:
  - `obtenerMensajeCampo()` / `mostrarEstadoCampo()`: Controlan la validación visual en tiempo real (borde verde/rojo y texto confirmatorio).
  - `validarCampoEnTiempoReal()`: Escucha el evento `input` de cada casillero y valida mientras el usuario teclea.
  - `cargarAlumnos()`: Pide el listado a la API mediante `fetch` y ejecuta `renderizarTabla()`.
  - `eliminarAlumno(id)`: Llama a la ruta `DELETE /api/alumnos/:id` y recarga la tabla dinámicamente.
- **`context/tema.js`**: Lee y guarda el tema (`light` o `dark`) en `localStorage`. Cambia la hoja de estilo activa e inserta el ícono del sol (`☀️`) o la luna (`🌙`) en el botón superior derecho.
- **`context/volverArriba.js`**: Muestra un botón circular flotante (`↑`) cuando el scroll supera los 300px y realiza un desplazamiento suave.

---

## 📁 Proyecto B — Consumo de API (`/Proyecto-B-ConsumoAPI`)

### 1. Servidor (`/server.js`)
- Servidor ligero en el **puerto 3001**. Su único rol es servir el HTML, CSS y JS de la aplicación web del estudiante/portal académico.

### 2. Frontend (`/pages/index.html`, `/scripts/app.js`)
- **`index.html`**: Presenta botones para elegir el método de conexión (`Cargar con Fetch` vs `Cargar con Axios`), una tabla filtrable de alumnos y el panel explicativo que muestra en vivo qué método se ejecutó y cuántos registros obtuvo.
- **`scripts/app.js`**:
  - `cargarConFetch()`: Utiliza la API nativa `fetch('http://localhost:3000/api/listar-alumnos')` para obtener el listado en formato JSON desde el Proyecto A.
  - `cargarConAxios()`: Utiliza la librería `axios.post('http://localhost:3000/api/listar-alumnos')` y accede directamente al resultado en `respuesta.data`.
  - `filtrarAlumnos(termino)`: Permite buscar en tiempo real por nombre o apellido dentro de los datos obtenidos en memoria.
  - `mostrarMetodoActivo()` / `actualizarExplicacion()`: Actualizan visualmente los badges y la caja de explicación del portal en la columna derecha.

---

## 🎨 Sistema de Estilos y Responsive (`/styles/light.css` y `/dark.css`)

Ambos proyectos poseen un diseño visual único y profesional:
- **Proyecto A (SaaS Enterprise Slate & Emerald)**: Modos oscuros en azul pizarra marino y esmeralda brillante (`#10b981`).
- **Proyecto B (Cyber Glass Lavender & Gold)**: Modos oscuros con gradientes violetas (`#d946ef`), ámbar oro y efectos de cristal (`backdrop-filter: blur(12px)`).
- **Características técnicas**:
  - `rem` en todo el CSS: Garantiza una escalabilidad perfecta según las preferencias de accesibilidad del usuario (`1rem = 16px`).
  - `height: auto` en las tarjetas (`.card-estanga`): Evita sobre-extensiones o espacios vacíos al final del contenedor.
  - **Botón ícono de tema**: Ubicado en la esquina derecha superior, alternando entre sol (`☀️`) y luna (`🌙`).
  - **Media Queries responsive**: Ajustan paddings, fuentes y tablas automáticamente en `62rem` (tablets), `48rem` (móviles) y `36rem` (móviles pequeños).
