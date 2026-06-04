# Explicación Paso a Paso del Proyecto 1 - Colector de Datos

Este proyecto es un laboratorio digital diseñado para recolectar números, procesar estadísticas en tiempo real y persistir los datos siguiendo el **Protocolo Estanga**.

## Funcionamiento del Proyecto (Paso a Paso)

### 1. Inicialización y Entorno
- **Servidor (`server.js`)**: Al ejecutar `node server.js`, se levanta un servidor Express en el puerto **3002**. El servidor utiliza módulos ESM y sirve de forma estática las carpetas de estilos, scripts y módulos.
- **Interfaz**: Al cargar la página, se inicializa el estado de la aplicación y se aplica el tema guardado (por defecto **Dark Neon**).

### 2. Ingreso y Validación de Datos
- **Captura**: El usuario ingresa un valor numérico en el panel "Ingreso de Datos".
- **Validación (`Validador.js`)**: Al presionar Enter o "Cargar", el sistema verifica:
    - Que el campo no esté vacío.
    - Que el contenido sea un número válido y finito.
    - Que el número no sea repetido (gestionado por el Estado).
- **Feedback**: Si hay un error, se muestra un mensaje animado bajo el input. Si es exitoso, se limpia el campo automáticamente.

### 3. Gestión de Estado y Estadísticas (`Estado.js`)
- **Almacenamiento**: Los números se guardan en un array real dentro del módulo `Estado`.
- **Cálculo Automático**: Cada vez que se agrega o elimina un número, se recalculan:
    - **Promedio**: Media aritmética con 2 decimales.
    - **Suma**: Total acumulado.
    - **Mínimo y Máximo**: Extremos de la colección.
- **Límites**: El sistema impone un mínimo de **10 números** para permitir la exportación y un máximo de **20** para mantener la integridad del laboratorio.

### 4. Renderizado Dinámico (`Renderizador.js`)
- **Lista Interactiva**: Los números aparecen en la "Colección" con animaciones de entrada. Cada ítem tiene un botón para eliminarlo individualmente.
- **Barra de Progreso**: Se actualiza visualmente según la cantidad de números cargados respecto al máximo.
- **Toasts**: Notificaciones flotantes informan sobre el éxito de las operaciones o advertencias (ej: "Limpiaste el laboratorio").

### 5. Exportación de Datos (Persistencia Dual)
Cuando se alcanzan los 10 números y se presiona "Exportar a .txt":
1. **Petición al Servidor**: Se envía la lista vía `fetch` al endpoint `/exportar`.
2. **Guardado en Servidor**: El backend genera un archivo `.txt` en la raíz del proyecto con los números puros (uno por línea).
3. **Guardado en Sistema**: El servidor también intenta guardar una copia directamente en la carpeta **Downloads** del usuario.
4. **Descarga Local**: El cliente recibe la respuesta y dispara una descarga automática en el navegador como respaldo.

### 6. Sistema de Temas (Dark/Light Mode)
- Se puede alternar entre modo Oscuro y Claro.
- El sistema ajusta el atributo `data-theme` en el HTML y cambia las clases de la `navbar` para garantizar que el diseño "Neon Lab" mantenga su visibilidad (especialmente el color turquesa del acento).

---
**Nota Técnica**: Se utiliza una arquitectura modular (ESM) que separa la lógica de negocio (`Estado`, `Validador`) de la manipulación del DOM (`Renderizador`), cumpliendo con los estándares profesionales exigidos.
