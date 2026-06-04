# guía para el pibe - ejercicio 3 (unshift)

atenti acá, que el `unshift()` es al revés del `push()`. no te me confundas.

## ¿cómo está organizado esto?
- **server.js**: servidor en el puerto 3003. mete los datos al principio de la fila.
- **Context/theme.js**: modo claro/oscuro para que no llores por la vista.
- **modules/operaciones.js**: funciones que usan `unshift()` para insertar datos al inicio.
- **scripts/main.js**: dom, eventos y validaciones.

## paso a paso del código
1. **unshift()**: este método mete el elemento en el índice 0 y corre todo lo demás para atrás.
2. **validaciones**: fijate que si ponés números en el nombre de usuario, el sistema te saca carpiendo.
3. **limites**: pusimos un límite de 3 colores. si llegás a 3, el formulario se va a dormir.
4. **eventos**: usamos click y la tecla enter. no me digas que no sabés usar un teclado.

## preguntas que te puedo hacer (preparate)
1. ¿cuál es la diferencia principal entre `push()` y `unshift()`?
2. ¿qué pasa con los índices de los elementos que ya estaban en el array cuando usás `unshift()`?
3. ¿por qué validamos el tipo de dato tanto en el frontend como en el backend?

dale, metele pata.
