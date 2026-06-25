# Consigna 6 — Formulario con Validación y CRUD

Proyecto completo de registro de usuarios con validación en tiempo real y gestión CRUD en tabla.

## Objetivo

Validar un formulario de inscripción, persistir registros en memoria y permitir editar/eliminar entradas con feedback visual.

## Estructura

| Archivo | Función |
|---------|---------|
| `pages/index.html` | Formulario + tabla de usuarios registrados |
| `scripts/main.js` | Validación, renderizado CRUD y scroll-to-top |
| `modules/validador.js` | Funciones de validación reutilizables |
| `Context/theme.js` | Toggle claro/oscuro |
| `styles/light.css` / `dark.css` | Temas con estilos de formularios y tablas |
| `server.js` | Servidor Express (puerto **3006**) |

## Validaciones (`validador.js`)

- **Nombre:** mínimo 3 caracteres, solo letras y espacios
- **Email:** formato válido con regex
- **Legajo:** obligatorio, mínimo 1, sin duplicados
- **Email duplicado:** verificación contra registros existentes

## CRUD

- **Create:** submit del formulario agrega fila a la tabla
- **Read:** render dinámico con avatar, nombre, email y materia
- **Update:** click en editar carga datos al formulario
- **Delete:** click en eliminar quita el registro

## Tema y responsive

- Formulario en sidebar sticky (desktop) / apilado (móvil < 768px)
- `form-control`, `form-select` y `form-floating` estilizados en modo oscuro
- Botón scroll-to-top con `btn-primary` y posición fija
- Tabla con `table-responsive` para scroll horizontal en pantallas chicas

## Cómo correrlo

```bash
npm install
node server.js
# http://localhost:3006
```
