# Explicación del Proyecto 2 - Explorador de Eventos

Este proyecto implementa una arquitectura de navegación tipo SPA (Single Page Application) dentro de un entorno Express.

## Conceptos Aplicados
- **Navegación Dinámica**: Se utilizan atributos `data-target` en los botones laterales para alternar la visibilidad de las secciones mediante clases de Bootstrap (`d-none`).
- **Eventos de Mouse**: Uso de `mousemove` para trackear coordenadas y `contextmenu` para anular el comportamiento por defecto del navegador y mostrar un menú personalizado.
- **Eventos de Teclado**: Captura global de `keydown` filtrada por la sección activa para mostrar información de la tecla pulsada.
- **Interacción Avanzada**: Uso de `dblclick` para cambios visuales y el par `focus`/`blur` para feedback de formularios.

## Estilo Estanga
- Código atomizado.
- Sin alertas intrusivas.
- Diseño responsivo y moderno.
