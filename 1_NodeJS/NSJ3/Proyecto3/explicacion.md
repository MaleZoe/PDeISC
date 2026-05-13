# Explicación del Proyecto 3 - Inspector de Hijos

Este proyecto extiende la funcionalidad del explorador de eventos anterior para incluir herramientas de inspección del DOM.

## Conceptos Clave
- **Propiedad `children`**: Se utiliza para acceder a la colección de elementos hijos directos de un nodo específico (`.sidebar` en este caso).
- **Conteo Dinámico**: Al pulsar el botón, el script calcula el `length` de la propiedad `children` y lo muestra en pantalla.
- **Regla Estanga de Un Solo Uso**: Una vez que se realiza el conteo, el botón desaparece (`d-none`) para evitar redundancia en la interfaz, siguiendo el criterio de "funcionalidad de único uso" del protocolo.

## Estructura
Se mantiene la arquitectura modular de `Proyecto2`, asegurando consistencia visual y técnica en toda la suite.
