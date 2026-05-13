# Explicación del Proyecto 4 - Auditor de Nodos y Atributos

Este proyecto demuestra la creación dinámica de elementos y la manipulación de sus atributos específicos en el DOM.

## Componentes Técnicos
1. **Creación Dinámica**: Se utiliza `document.createElement('a')` dentro de un bucle para generar una lista de enlaces basada en un array de objetos.
2. **Manipulación de Atributos**: Uso del método `setAttribute('href', valor)` para modificar los enlaces existentes de forma masiva.
3. **Auditoría en Tiempo Real**: Un sistema de "logs" inyecta dinámicamente elementos en un contenedor para mostrar al usuario qué atributo se está modificando, el valor anterior y el nuevo valor.

## Criterio Estanga
- **Validación Visual**: El usuario recibe feedback constante de lo que sucede en el código.
- **Control de Estado**: Los botones se deshabilitan una vez cumplen su función para mantener la integridad de la demostración.
- **Identificación**: Cada nodo creado posee un ID único para su rastreo.
