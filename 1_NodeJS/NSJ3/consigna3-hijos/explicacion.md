# Consigna 3 — Inspector de Nodos Hijos

Proyecto para explorar la jerarquía DOM contando nodos hijos directos de cada componente.

## Objetivo

Al hacer click en una tarjeta `.inspectable`, mostrar en tiempo real cuántos elementos hijos directos tiene (`element.children.length`).

## Estructura

| Archivo | Función |
|---------|---------|
| `pages/index.html` | 5 componentes inspectables + alerta informativa |
| `scripts/main.js` | Contador de hijos y eventos de consigna 2 reutilizados |
| `Context/theme.js` | Toggle claro/oscuro |
| `styles/light.css` / `dark.css` | Temas y responsive |
| `server.js` | Servidor Express (puerto **3003**) |

## Funcionalidades

- Click en tarjeta ? badge muestra `"N hijos"`
- Badge cambia de `bg-secondary-subtle` a `bg-primary` al inspeccionar
- Outline temporal con `var(--primary-color)` como feedback
- Ignora clicks sobre inputs internos para no interferir con eventos de foco

## Tema y responsive

- Badges usan clases theme-aware (`bg-secondary-subtle`) compatibles con ambos modos
- Layout `col-md-6` / `col-md-12` para el componente de ancho completo
- Alertas `alert-info` con overrides en modo oscuro

## Cómo correrlo

```bash
npm install
node server.js
# http://localhost:3003
```
