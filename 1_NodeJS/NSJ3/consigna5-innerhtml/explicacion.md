# Consigna 5 — InnerHTML Lab

Proyecto sobre inyección dinámica de contenido HTML mediante la propiedad `innerHTML`.

## Objetivo

Insertar componentes Bootstrap (listas, tablas, alertas) en un contenedor de preview usando plantillas HTML en strings.

## Estructura

| Archivo | Función |
|---------|---------|
| `pages/index.html` | Panel de botones + área de display |
| `scripts/main.js` | Inyección de lista, tabla y alerta |
| `Context/theme.js` | Toggle claro/oscuro |
| `styles/light.css` / `dark.css` | Temas con overrides para tablas y list-groups |
| `server.js` | Servidor Express (puerto **3005**) |

## Componentes inyectables

| Botón | Contenido generado |
|-------|-------------------|
| Lista | `<ul class="list-group">` con ítems aleatorios |
| Tabla | `<table>` con thead y fila de auditoría |
| Alerta | `<div class="alert alert-info">` con icono |
| Limpiar | Restaura estado vacío del display |

## Tema y responsive

- `table-light`, `list-group-item` y `bg-light-subtle` tienen overrides en `dark.css`
- Display con scroll (`overflow-auto`) para contenido largo en móvil
- Animación `.fade-in` en cada inyección

## Cómo correrlo

```bash
npm install
node server.js
# http://localhost:3005
```
