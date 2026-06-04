# guía para el pibe - ejercicio 1 (push)

escuchame bien, acá te explico cómo funciona este código para que no pases vergüenza cuando te pregunte. 

## ¿cómo está organizado esto?
- **server.js**: es el cerebro que vive en el servidor (puerto 3001). usa `import` porque no somos cavernícolas. se encarga de recibir los datos, fijarse que no le mandes fruta (literalmente) y devolver el array actualizado.
- **Context/theme.js**: acá se cocina el cambio de luces. guarda en el `localStorage` si sos de los que les gusta el modo oscuro o el claro.
- **modules/operaciones.js**: acá está la lógica pura. son funciones cortitas que usan el método `push()` para meter cosas al final del array.
- **scripts/main.js**: este maneja el dom. escucha los eventos (click, enter, etc.) y le avisa al servidor qué tiene que hacer. también tiene las validaciones para que no metas números donde van nombres.

## paso a paso del código
1. **carga del dom**: apenas abrís la página, el `main.js` inicializa el tema y renderiza lo que haya en los arrays.
2. **validación en tiempo real**: mientras vas escribiendo, el código se fija si lo que ponés está bien. si te mandás una macana, el input se pone rojo y te tira un mensaje. nada de alerts molestos.
3. **envío de datos**: cuando apretás el botón o le das al enter, se manda un `fetch` al servidor.
4. **procesamiento**: el servidor recibe la info, la valida de nuevo (porque no hay que confiar en nadie) y usa `push()` para guardar el dato con la fecha en formato `DD/MM/AA`.
5. **respuesta**: el servidor te devuelve el array nuevo y el `main.js` vuelve a dibujar todo en la pantalla.

## preguntas que te puedo hacer (preparate)
1. ¿por qué usamos `push()` y no simplemente asignamos el valor en una posición fija?
2. ¿en qué parte del código te asegurás de que no se agreguen más de 3 frutas?
3. ¿cómo hacés para que el servidor sepa si tiene que agregar un amigo nuevo o modificar uno que ya existe?

si no sabés esto, ni te gastes en venir.
