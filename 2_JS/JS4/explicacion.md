# Explicación del Proyecto JS4 — Consumo de APIs

## ¿Qué hace este proyecto?

Este proyecto trabaja con APIs de dos formas distintas: usando la API pública **JSONPlaceholder** (que simula un servidor real) y usando una **API propia** creada con Node.js y Express. Está dividido en 4 ejercicios independientes, cada uno accesible desde la página principal.

---

## Estructura de carpetas

```
JS4/
│
├── server.js              → El servidor Express que sirve todo
├── package.json           → Dependencias del proyecto
│
├── pages/                 → Las páginas HTML de cada ejercicio
│   ├── index.html
│   ├── ejercicio1.html
│   ├── ejercicio2.html
│   ├── ejercicio3.html
│   └── ejercicio4.html
│
├── styles/
│   └── global.css         → Todos los estilos, modo oscuro y claro
│
├── modules/
│   ├── utils.js           → Funciones reutilizables (toast, scroll, hamburguesa)
│   └── alumnos.js         → Router de Express para la API de alumnos
│
└── Context/
    └── tema.js            → Manejo del modo oscuro/claro con localStorage
```

---

## Cómo correrlo

1. Instalar dependencias:
   ```
   npm install
   ```

2. Iniciar el servidor:
   ```
   npm run dev
   ```

3. Entrar a `http://localhost:3000`

---

## Ejercicio 1 — GET con Fetch y Axios

**¿Qué hace?** Pide los usuarios de JSONPlaceholder con los dos métodos disponibles y los muestra en pantalla como tarjetas.

**Paso a paso:**

1. El usuario hace clic en uno de los dos botones ("Cargar con Fetch" o "Cargar con Axios")
2. Se deshabilita el botón y aparece un spinner mientras se espera la respuesta
3. **Con fetch():**
   - Se llama a `fetch(URL)` que devuelve una promesa
   - Se verifica que la respuesta fue exitosa con `respuesta.ok`
   - Se parsea el JSON con `respuesta.json()`
4. **Con axios.get():**
   - Se llama a `axios.get(URL)` que ya parsea el JSON automáticamente
   - Los datos están en `respuesta.data` directamente
5. Se renderizan las tarjetas con nombre y email de cada usuario
6. Si falla, se muestra un mensaje de error en el lugar de las tarjetas

**Diferencia clave entre fetch y axios:**
- `fetch` devuelve la respuesta HTTP cruda, hay que parsear el JSON manualmente y verificar si fue exitosa
- `axios` lo hace todo solo, ya parsea el JSON y lanza un error automáticamente si el status no es 2xx

---

## Ejercicio 2 — POST con Formulario

**¿Qué hace?** Muestra dos formularios (uno para cada método). Al enviar, manda los datos a la API y muestra el ID que devuelve como respuesta.

**Paso a paso:**

1. El usuario completa los campos "Nombre" y "Email"
2. **Validación en tiempo real:** mientras escribe, el campo se pone rojo si el dato es inválido, sin esperar al envío
   - Nombre: solo letras, mínimo 3 caracteres
   - Email: tiene que tener el formato `algo@algo.algo`
3. Al hacer clic en "Enviar", primero se valida todo nuevamente en JavaScript
4. Si pasa, se hace el POST:
   - **Con fetch:** hay que configurar el método `POST`, el header `Content-Type: application/json` y convertir los datos con `JSON.stringify()`
   - **Con axios:** `axios.post(URL, datos)` lo hace solo, no hay que convertir ni poner headers manualmente
5. JSONPlaceholder devuelve el objeto creado con un ID simulado
6. Se muestra ese ID en pantalla con una animación

**¿Por qué JSONPlaceholder devuelve ID 11?** Porque simula que ya hay 10 usuarios y el próximo sería el 11. No guarda nada realmente.

---

## Ejercicio 3 — Búsqueda en tiempo real

**¿Qué hace?** Carga todos los usuarios de la API (con los dos métodos en paralelo) y permite buscar por nombre mientras se escribe.

**Paso a paso:**

1. El botón "Cargar usuarios" aparece una sola vez. Cuando se hace clic, se usa para ambos métodos
2. Se cargan los datos **en paralelo** usando `Promise.all()`:
   ```javascript
   const [datosFetch, datosAxios] = await Promise.all([fetch(...), axios.get(...)]);
   ```
   Esto es más eficiente que esperar uno y después el otro
3. Los datos se guardan en dos arrays: `usuariosFetch` y `usuariosAxios`
4. El botón se oculta (es de único uso) y aparecen los dos buscadores
5. Al escribir en cualquiera de los buscadores, se ejecuta `filtrarPorNombre()`:
   - Convierte la búsqueda y el nombre a minúsculas para comparar sin distinción de mayúsculas
   - Usa `Array.filter()` para quedarse solo con los que incluyen el texto buscado
6. El resultado se renderiza instantáneamente, mostrando cuántos resultados hay

---

## Ejercicio 4 — API propia de alumnos

**¿Qué hace?** Tiene una API propia en el servidor (`/api/alumnos`) y una interfaz para hacer CRUD completo: ver, agregar, editar y borrar alumnos.

### El servidor (modules/alumnos.js)

Crea un **Router de Express** con los siguientes endpoints:

| Método | Ruta | Qué hace |
|--------|------|----------|
| GET | `/api/alumnos` | Devuelve todos los alumnos |
| POST | `/api/alumnos` | Agrega un alumno nuevo |
| PUT | `/api/alumnos/:id` | Edita un alumno existente |
| DELETE | `/api/alumnos/:id` | Borra un alumno |

Los datos viven en un array en memoria (se reinician al reiniciar el servidor). Cada alumno tiene: id, nombre, email, carrera, legajo y fecha de creación.

**Validaciones en el backend:**
- Todos los campos son obligatorios
- El nombre y la carrera solo pueden tener letras
- El email debe tener formato válido
- El legajo debe ser: 1 letra mayúscula + 4 números (ej: S1001)
- No puede haber dos alumnos con el mismo legajo o email

### La interfaz (ejercicio4.html)

**Agregar un alumno:**
1. Se completan los 4 campos con validación en tiempo real
2. Al enviar, se hace un `fetch POST` a `/api/alumnos`
3. Si el backend devuelve un error (duplicado, formato inválido), se muestra en pantalla
4. Si todo está bien, se recarga la tabla

**Editar un alumno:**
1. Al hacer clic en ✏️, se piden los datos actuales al servidor
2. Se rellenan los campos del formulario con esos datos
3. El botón cambia a "Guardar cambios"
4. Aparece un botón "Cancelar" para volver al estado de agregar
5. Al guardar, se hace un `fetch PUT` con el id del alumno

**Borrar un alumno:**
1. Al hacer clic en 🗑️, aparece un modal de confirmación (no se borra directo)
2. Si se confirma, se hace un `fetch DELETE` con el id
3. El modal se cierra y la tabla se actualiza

**La tabla muestra:**
- ID, nombre, email, carrera, legajo
- Fecha de creación en formato DD/MM/AA
- Botones de editar y borrar por fila

---

## Modo oscuro y claro (Context/tema.js)

El módulo de tema:
1. Al cargar la página, mira si hay un tema guardado en `localStorage`
2. Si no hay ninguno, detecta si el sistema operativo está en modo oscuro
3. Aplica el tema al elemento `<html>` con el atributo `data-theme="dark"` o `data-theme="light"`
4. El CSS usa variables CSS (`--bg-primary`, `--text-primary`, etc.) que cambian según ese atributo
5. Al hacer clic en el botón 🌙/☀️, se llama a `toggleTema()` que cambia y guarda el nuevo tema

---

## Utilidades compartidas (modules/utils.js)

- **`mostrarToast()`**: Muestra un mensaje flotante (verde = éxito, rojo = error) que desaparece solo
- **`iniciarScrollTop()`**: Escucha el scroll y muestra/oculta el botón de "ir arriba"
- **`iniciarHamburguesa()`**: Abre y cierra el menú móvil al hacer clic
- **`getIniciales()`**: Convierte un nombre en sus iniciales para el avatar (ej: "Lucas Fernández" → "LF")
