# Explicación Técnica - Ejercicio 13 (Método sort)

Este proyecto académico implementa el método `sort()` de JavaScript de manera modular y estructurada bajo el estándar de Express y ESM (import).

## Estructura del Proyecto
- `server.js`: Servidor Express corriendo en el puerto 3013. Valida las entradas en el Backend antes de modificar el estado.
- `Context/theme.js`: Manejo dinámico del cambio de modo claro a oscuro, persistido en el localStorage.
- `styles/`: Contiene `light.css` y `dark.css` con variables HSL y CSS Grid para ocupar toda la pantalla de forma responsiva.
- `modules/operaciones.js`: Módulo de lógica que encapsula la manipulación real del array.
- `scripts/main.js`: Lógica del DOM. Escucha como mínimo dos eventos de interacción por cada acción y aplica la validación en tiempo real en el frontend con alertas visuales no bloqueantes.

## Puntos de la consigna resueltos:
1. **Ordena un array de números de menor a mayor.**
2. **Ordena un array de palabras alfabéticamente.**
3. **Dado un array de objetos {nombre, edad}, ordénalos por edad.**

## Validaciones y Eventos Duales
- **Front:** Validación visual con bordes rojos ante caracteres inválidos en tiempo real.
- **Back:** Validación en Express, devolviendo errores 400 si se vulnera el tipo de datos.
- **Doble Evento:** Todo control se ejecuta mediante click ordinario y a través de un evento secundario (Doble Click, Enter o Mouse Enter) para asegurar la accesibilidad.
