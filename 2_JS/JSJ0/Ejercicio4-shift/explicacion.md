# Explicación Técnica - Ejercicio 4 (Método shift)

Este proyecto académico implementa el método `shift()` de JavaScript de manera modular y estructurada bajo el estándar de Express y ESM (import).

## Estructura del Proyecto
- `server.js`: Servidor Express corriendo en el puerto 3004. Valida las entradas en el Backend antes de modificar el estado.
- `Context/theme.js`: Manejo dinámico del cambio de modo claro a oscuro, persistido en el localStorage.
- `styles/`: Contiene `light.css` y `dark.css` con variables HSL y CSS Grid para ocupar toda la pantalla de forma responsiva.
- `modules/operaciones.js`: Módulo de lógica que encapsula la manipulación real del array.
- `scripts/main.js`: Lógica del DOM. Escucha como mínimo dos eventos de interacción por cada acción y aplica la validación en tiempo real en el frontend con alertas visuales no bloqueantes.

## Puntos de la consigna resueltos:
1. **Quita el primer número de un array de enteros.**
2. **Elimina el primer mensaje de un array de mensajes de chat.**
3. **Usa shift() para simular una cola de atención al cliente (se oculta al no haber mas clientes).**

## Validaciones y Eventos Duales
- **Front:** Validación visual con bordes rojos ante caracteres inválidos en tiempo real.
- **Back:** Validación en Express, devolviendo errores 400 si se vulnera el tipo de datos.
- **Doble Evento:** Todo control se ejecuta mediante click ordinario y a través de un evento secundario (Doble Click, Enter o Mouse Enter) para asegurar la accesibilidad.
