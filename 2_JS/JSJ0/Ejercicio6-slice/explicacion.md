# Explicación Técnica - Ejercicio 6 (Método slice)

Este proyecto académico implementa el método `slice()` de JavaScript de manera modular y estructurada bajo el estándar de Express y ESM (import).

## Estructura del Proyecto
- `server.js`: Servidor Express corriendo en el puerto 3006. Valida las entradas en el Backend antes de modificar el estado.
- `Context/theme.js`: Manejo dinámico del cambio de modo claro a oscuro, persistido en el localStorage.
- `styles/`: Contiene `light.css` y `dark.css` con variables HSL y CSS Grid para ocupar toda la pantalla de forma responsiva.
- `modules/operaciones.js`: Módulo de lógica que encapsula la manipulación real del array.
- `scripts/main.js`: Lógica del DOM. Escucha como mínimo dos eventos de interacción por cada acción y aplica la validación en tiempo real en el frontend con alertas visuales no bloqueantes.

## Puntos de la consigna resueltos:
1. **Copia los primeros 3 elementos de un array de números.**
2. **Crea una copia parcial de un array de películas desde la posición 2 hasta la 4.**
3. **Crea un array nuevo con los últimos 3 elementos sin modificarlos.**

## Validaciones y Eventos Duales
- **Front:** Validación visual con bordes rojos ante caracteres inválidos en tiempo real.
- **Back:** Validación en Express, devolviendo errores 400 si se vulnera el tipo de datos.
- **Doble Evento:** Todo control se ejecuta mediante click ordinario y a través de un evento secundario (Doble Click, Enter o Mouse Enter) para asegurar la accesibilidad.
