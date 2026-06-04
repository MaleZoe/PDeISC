# Explicación Ejercicio 4

Acá la posta es la modularización. Separamos la lógica matemática de la lógica del servidor y de la interfaz.

### Lo que hay que saber:
1. **Módulos**: Creamos `calculos.js` en la carpeta `modules`. Usamos `export` para que las funciones se puedan usar en otros archivos.
2. **Reutilización**: El mismo archivo de cálculos lo usa el `server.js` (Backend) y el `main.js` (Frontend). Eso es eficiencia, pibe.
3. **Dinámico**: Los resultados en la página no están escritos a mano, se generan recorriendo un array de objetos con JS.
4. **Bootstrap**: Usamos el componente `list-group` para que quede bien prolijo.
