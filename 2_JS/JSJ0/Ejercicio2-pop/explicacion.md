# guía para el pibe - ejercicio 2 (pop)

mirá bien, acá te explico cómo funciona el método `pop()` para que no andes perdido en el examen.

## ¿cómo está organizado esto?
- **server.js**: el servidor en el puerto 3002. se encarga de sacar los elementos del array y avisarte qué borró.
- **Context/theme.js**: lo mismo de siempre, para que no te quedes ciego con el brillo de la pantalla.
- **modules/operaciones.js**: tiene las funciones que usan `pop()` para volar el último elemento.
- **scripts/main.js**: maneja los botones y los eventos (click, doble click y hasta el botón derecho del mouse).

## paso a paso del código
1. **los arrays**: arrancamos con listas de animales, productos e items.
2. **el método pop()**: cuando gatillás la acción, el código usa `pop()`. este método es clave porque saca el último y te lo devuelve.
3. **el bucle while**: para vaciar la lista de un saque, usamos un `while` que sigue sacando elementos con `pop()` hasta que el array queda en cero.
4. **eventos duales**: fijate que para los animales podés usar click o doble click, y para los productos tenés el click derecho habilitado.
5. **ocultar cosas**: cuando la lista de items se vacía, el botón desaparece. si ya no hay nada que borrar, ¿para qué querés el botón?

## preguntas que te puedo hacer (preparate)
1. ¿qué valor devuelve el método `pop()` cuando lo ejecutás?
2. ¿por qué usamos un `while` para vaciar el array y no un `forEach`?
3. ¿cómo hacés para mostrar en la pantalla qué producto fue el último que se eliminó?

estudiá, no seas vago.
