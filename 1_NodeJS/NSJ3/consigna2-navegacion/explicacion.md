# Consigna 2 — Eventos de Navegación

Proyecto sobre eventos interactivos del navegador: mouse, teclado, foco y menú contextual.

## Objetivo

Implementar al menos cinco tipos de eventos DOM con feedback visual inmediato en cada componente.

## Estructura

| Archivo | Función |
|---------|---------|
| `pages/index.html` | Grid de 5 tarjetas interactivas |
| `scripts/main.js` | Listeners de eventos por componente |
| `Context/theme.js` | Toggle claro/oscuro |
| `styles/light.css` / `dark.css` | Temas y responsive |
| `server.js` | Servidor Express (puerto **3002**) |

## Eventos implementados

| Componente | Evento | Efecto |
|------------|--------|--------|
| Comp 1 | `mouseover` / `mouseout` | Resalta con `bg-primary` |
| Comp 2 | `dblclick` | Rota 10° y borde verde |
| Comp 3 | `keyup` | Muestra última tecla presionada |
| Comp 4 | `focus` / `blur` | Cambia badge de inactivo a activo |
| Comp 5 | `contextmenu` | Bloquea/libera click derecho con toggle visual |

## Tema y responsive

- Modo claro/oscuro con detección de preferencia del sistema
- Grid `col-md-6` — dos columnas en tablet, una en móvil
- Header glass con blur adaptado a cada tema

## Cómo correrlo

```bash
npm install
node server.js
# http://localhost:3002
```
