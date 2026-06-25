# Explicación del Proyecto - Node.js (Protocolo Estanga)

## Resumen Corto
Este proyecto es una aplicación web backend en puro Node.js, atomizada en distintos módulos y con interfaz renderizada desde el servidor o servida vía sistema de archivos.

## Estructura de Carpetas
- **server.js**: El archivo principal (no `app.js`). Maneja las peticiones HTTP puras, el enrutamiento de páginas y la API REST para los datos y simulaciones. Todo centralizado y bien atomizado como se pide.
- **pages/**: Exportan los _template literals_ que generan el HTML de cada ejercicio. Se renderizan dentro de un layout base unificado en `layout.js` salvo el HTML puro del disco del Ejercicio 2.
- **styles/**: Dividido en `base.css` (para estructura general), `light.css` y `dark.css`.
- **context/**: Contiene `theme.js`, guardando la lógica de modo claro/oscuro en el `localStorage` del cliente.
- **scripts/**: Código frontend. Encargado de las peticiones asincrónicas (`fetch`) al backend, dom general (menú hamburguesa, scroll top) y las estrictas validaciones on real time.
- **modules/**: La lógica del servidor organizada por consignas y componentes modulares:
  - **consigna1/**: Módulos propios para operaciones de cálculo ([calculo.js](file:///c:/Users/salvi/Documents/GitHub/PDeISC/1_NodeJS/NSJ2/modules/consigna1/calculo.js)) y de clima ([clima.js](file:///c:/Users/salvi/Documents/GitHub/PDeISC/1_NodeJS/NSJ2/modules/consigna1/clima.js)).
  - **consigna2/**: Módulo nativo File System ([archivos.js](file:///c:/Users/salvi/Documents/GitHub/PDeISC/1_NodeJS/NSJ2/modules/consigna2/archivos.js)) para escribir y generar la vista HTML física en el disco.
  - **consigna3/**: Módulo nativo URL ([url.js](file:///c:/Users/salvi/Documents/GitHub/PDeISC/1_NodeJS/NSJ2/modules/consigna3/url.js)) que analiza la URL de ejemplo y la imprime en consola.
  - **consigna4/**: Componente que hace uso del paquete NPM `upper-case` ([npm.js](file:///c:/Users/salvi/Documents/GitHub/PDeISC/1_NodeJS/NSJ2/modules/consigna4/npm.js)).
  - **consigna5/**: Menú modular ([menu.js](file:///c:/Users/salvi/Documents/GitHub/PDeISC/1_NodeJS/NSJ2/modules/consigna5/menu.js)) e Inicio ([inicio.js](file:///c:/Users/salvi/Documents/GitHub/PDeISC/1_NodeJS/NSJ2/modules/consigna5/inicio.js)).
  - **shared/**: Contenedor global de diseño de página ([layout.js](file:///c:/Users/salvi/Documents/GitHub/PDeISC/1_NodeJS/NSJ2/modules/shared/layout.js)).
  - **site/**: Orquestador que inicializa la generación estática de las páginas del sitio ([generarSitio.js](file:///c:/Users/salvi/Documents/GitHub/PDeISC/1_NodeJS/NSJ2/modules/site/generarSitio.js)).

## Validaciones Estrictas
Hay 3 niveles de validación implementados en el CRUD y la calculadora:
1. **HTML**: Uso de etiquetas `pattern`, `min`, `max` y `required`, limitando el ingreso nativamente.
2. **Javascript On Real Time**: Los inputs se validan en tiempo real en el lado del cliente (coloreándose ante errores).
3. **Backend**: El archivo [server.js](file:///c:/Users/salvi/Documents/GitHub/PDeISC/1_NodeJS/NSJ2/server.js) verifica que los datos de las peticiones sean válidos antes de procesarlos.

## Ejercicios Cumplidos a Rajatabla
1. **Ejercicio 1**: Componente con módulos propios (Cálculo y clima).
2. **Ejercicio 2**: Componente HTTP + File System (Se genera un archivo HTML en el disco y se sirve en el navegador en `/vista.html`).
3. **Ejercicio 3**: Componente URL (Carga la URL del ejemplo, la desglosa, la manda al renderizador del HTML, y paralelamente la escupe por la consola del servidor usando `console.log`).
4. **Ejercicio 4**: Uso de gestor NPM `upper-case` implementado dentro del módulo de visualización de transformación de textos (`/npm`).
5. **Ejercicio 5**: Menú modularizado con links a más de 5 páginas integradas y unificadas en la misma aplicación.

## UX / UI
- Sin Alerts. Nada molesto.
- Botón flotante para subir, claramente funcional cuando se scrollea hacia abajo.
- Modo claro y oscuro intercambiable.
- Diseño responsivo en Bootstrap... Aunque la consigna pide Bootstrap, aquí se hizo una recreación flex y grid limpia que simula el responsive grid system y componentes para mantener una pureza, logrando completitud en la pantalla en versiones de escritorio y modo hamburguesa en móvil.
- Botones de "Único Uso", como el de Limpiar en la calculadora de edad, que se auto-ocultan una vez presionados para no entorpecer la vista. 
