# NSJ3 — Portfolio de Manipulación DOM

Colección de seis proyectos educativos sobre el DOM en JavaScript, más un hub central que los agrupa. Cada consigna es una app independiente con servidor Express, UI responsive y soporte de **modo claro/oscuro**.

## Estructura del repositorio

```
NSJ3/
├── index.html          # Hub central (puerto 3000)
├── server.js           # Servidor del hub
├── README.md           # Este archivo
│
└── consigna{N}-{nombre}/
    ├── pages/index.html
    ├── scripts/main.js
    ├── Context/theme.js
    ├── styles/light.css
    ├── styles/dark.css
    ├── server.js
    └── explicacion.md
```

## Proyectos incluidos

| Proyecto | Puerto | Descripción |
|----------|--------|-------------|
| **Hub central** | 3000 | Dashboard con acceso a todas las consignas |
| consigna1-dom | 3001 | Creación y modificación de H1 e imágenes |
| consigna2-navegacion | 3002 | Eventos de mouse, teclado, foco y contextmenu |
| consigna3-hijos | 3003 | Contador de nodos hijos por componente |
| consigna4-atributos | 3004 | Creación y mutación de atributos HTML |
| consigna5-innerhtml | 3005 | Inyección dinámica con `innerHTML` |
| consigna6-formulario | 3006 | Formulario con validación y CRUD en tabla |

## Cómo ejecutar

### Hub central

```bash
npm install
npm start
# Abrir http://localhost:3000
```

### Cada consigna (por separado)

```bash
cd consigna1-dom   # o la consigna que quieras
npm install
node server.js
```

Los servidores de las consignas deben estar activos para que los enlaces del hub funcionen.

## Modo claro / oscuro

- Cada consigna incluye un botón de tema (luna/sol) en el header.
- La preferencia se guarda en `localStorage` bajo la clave `theme`.
- Si no hay preferencia guardada, se usa `prefers-color-scheme` del sistema operativo.
- El hub central también soporta cambio de tema con la misma clave `localStorage`.

**Archivos involucrados:**

- `Context/theme.js` — lógica de toggle e inicialización
- `styles/light.css` — variables y estilos del tema claro
- `styles/dark.css` — variables y overrides de Bootstrap para tema oscuro

## Diseño responsive

Todas las páginas usan Bootstrap 5.3 con:

- Meta viewport configurado
- Grid responsive (`col-md-*`, `col-lg-*`, `col-xl-*`)
- `container-fluid` con padding adaptativo en CSS
- Sidebars con `sticky-top` desactivado en móvil (< 768px)
- Tablas con `table-responsive` donde corresponde

**Breakpoints Bootstrap usados:** 576px (sm), 768px (md), 992px (lg), 1200px (xl).

## Stack tecnológico

- **Backend:** Node.js + Express (ES Modules)
- **Frontend:** HTML5, JavaScript ES Modules, Bootstrap 5.3, Bootstrap Icons
- **Fuentes:** Google Fonts (Inter en hub, Plus Jakarta Sans en consignas)
- **Sin bundler** — archivos estáticos servidos directamente

## Documentación por consigna

Cada carpeta `consigna*` incluye un `explicacion.md` con detalles específicos de esa unidad.
