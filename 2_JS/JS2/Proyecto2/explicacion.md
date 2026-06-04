# explicacion del proyecto 2 - filtro de numeros (protocolo estanga)

este proyecto permite subir un archivo `.txt` (generado por el proyecto 1), leerlo en el servidor, y filtrar los numeros que empiezan y terminan con el mismo digito.

## estructura y archivos

### /server.js
el motor del proyecto.
- usa `multer` para recibir los archivos subidos (se guardan directamente en la raíz del backend).
- **procesamiento real**: lee el archivo usando `fs.readFile` en el servidor.
- filtra los numeros segun la logica: `primer_digito === ultimo_digito`.
- ordena los resultados de forma ascendente.
- **Persistencia**: Al guardar el resultado, genera un `.txt` en la raíz del proyecto y en la carpeta de Descargas del sistema, igual que el Proyecto 1.

### /modules/
logica modularizada para el frente:
- **estado.js**: guarda la informacion recibida del server (stats, listas).
- **renderizador.js**: muestra las estadisticas, los porcentajes y la lista de utiles con animaciones neon.

### /scripts/app.js
maneja el envio del archivo al servidor usando `FormData` y recibe los resultados para mandarlos al renderizador.

---
**nota del alumno:** se cumple con el requerimiento de procesar el archivo en el backend. el filtrado incluye el calculo de porcentaje de utilidad y el ordenamiento ascendente solicitado. No se utilizan carpetas intermedias (como uploads o resultados), guardando todo directamente en el backend y descargas.
