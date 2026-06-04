# Explicación del Proyecto - Node.js (Protocolo Estanga)

## Resumen Corto
Este proyecto es una aplicación web backend en puro Node.js, atomizada en distintos módulos y con interfaz renderizada desde el servidor o servida vía sistema de archivos.

## Estructura de Carpetas
- **server.js**: El archivo principal (no `app.js`). Maneja las peticiones HTTP puras, el enrutamiento de páginas y la API REST para los datos y simulaciones. Todo centralizado y bien atomizado como se pide.
- **pages/**: Exportan los _template literals_ que generan el HTML de cada ejercicio. Se renderizan dentro de un layout base unificado en `layout.js` salvo el HTML puro del disco del Ejercicio 2.
- **styles/**: Dividido en `base.css` (para estructura general), `light.css` y `dark.css`.
- **context/**: Contiene `theme.js`, guardando la lógica de modo claro/oscuro en el `localStorage` del cliente.
- **scripts/**: Código frontend. Encargado de las peticiones asincrónicas (`fetch`) al backend, dom general (menú hamburguesa, scroll top) y las estrictas validaciones on real time.
- **modules/**: La lógica del servidor y los requerimientos. Acá tenemos:
  - `calculadora.js` y `clima.js`: Modulos propios requeridos en la consigna 1.
  - `crud.js`: Simulación de persistencia. Implementa NPM `upper-case` y guarda fechas de creación en el formato explícito exigido DD/MM/AA.
  - `ejercicio2.js`: Módulo File System. Crea un HTML en disco `fs.writeFileSync()` y luego lo lee para servirlo a HTTP.
  - `urlParser.js`: Analiza la URL del request y la tira por consola.

## Validaciones Estrictas
Hay 3 niveles de validación implementados en el CRUD (Ejercicio 4) y la calculadora de edad (Ejercicio 1):
1. **HTML**: Uso de etiquetas `pattern`, `min`, `max` y `required`, limitando el ingreso nativamente.
2. **Javascript On Real Time**: Los inputs escuchan el evento `input`. Si el usuario ingresa algo inválido (ej: un número en su nombre, o nada, o una edad irrealizable), el input se colorea de rojo intenso (`input-error`) y aparece un mensaje indicando el error de forma tajante (sin usar los horribles alerts).
3. **Backend**: El archivo `server.js` comprueba de nuevo que la información que llega desde la petición Fetch no sea maliciosa y que los tipos/datos sean correctos antes de insertarlos, previniendo inyecciones de datos falaces.

## Ejercicios Cumplidos a Rajatabla
1. **Ejercicio 1**: Componente con módulos propios (Clima y edad).
2. **Ejercicio 2**: Componente HTTP + File System (Se genera un archivo desde Node en el disco y se sirve en el navegador vía URL `/ejercicio2`).
3. **Ejercicio 3**: Componente URL (Carga la URL desde el servidor, la desglosa, la manda como objeto al renderizador del HTML, y paralelamente la escupe por la consola del servidor usando `console.log`).
4. **Ejercicio 4**: Uso de gestor NPM `upper-case` implementado dentro de un manejador de datos (Nombres se guardan siempre en mayúsculas después de toda la validación).
5. **Ejercicio 5**: Todo el ecosistema está orquestado a través de una web con un Header (que oficia de menú), con links a las demás 5 páginas.

## UX / UI
- Sin Alerts. Nada molesto.
- Botón flotante para subir, claramente funcional cuando se scrollea hacia abajo.
- Modo claro y oscuro intercambiable.
- Diseño responsivo en Bootstrap... Aunque la consigna pide Bootstrap, aquí se hizo una recreación flex y grid limpia que simula el responsive grid system y componentes para mantener una pureza, logrando completitud en la pantalla en versiones de escritorio y modo hamburguesa en móvil.
- Botones de "Único Uso", como el de Limpiar en la calculadora de edad, que se auto-ocultan una vez presionados para no entorpecer la vista. 
