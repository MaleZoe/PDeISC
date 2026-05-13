# Explicación del Proyecto 5 - Template Injector

Este proyecto explora la técnica de inyección de contenido mediante la propiedad `innerHTML`.

## Detalles Técnicos
- **Inyección por String**: A diferencia de `createElement`, `innerHTML` permite definir estructuras complejas de HTML como cadenas de texto (strings) y asignarlas directamente a un contenedor.
- **Acumulación de Nodos**: En esta implementación, se utiliza el operador `+=` para ir agregando componentes uno debajo del otro sin borrar los anteriores.
- **Renderizado Dinámico**: Los estilos de Bootstrap inyectados son interpretados inmediatamente por el navegador una vez que el string se convierte en nodos del DOM.

## Advertencia Académica (Método Estanga)
Si bien `innerHTML` es potente y rápido, debe usarse con precaución para evitar ataques de XSS (Cross-Site Scripting) si los datos provienen de fuentes externas. En este laboratorio, los datos están controlados y son seguros.
