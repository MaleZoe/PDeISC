# Lista de Tareas (React Router SPA)

Aplicación web de Lista de Tareas tipo Single Page Application (SPA), construida con React, Vite, React Router y Bootstrap 5.

## Características

- **Enrutamiento del lado del cliente**: Navegación sin recargas usando React Router (`/`, `/tarea/:id`, `/crear`, `/editar/:id`).
- **Estado Global**: Manejo de tareas en memoria mediante React Context (`TareasContext`).
- **Diseño Responsivo y Temas Premium**: Interfaz adaptable a móviles con un rediseño que soporta modo oscuro elegante y modo claro suavizado (Glassmorphism, iconos Sol/Luna).
- **Validación de Formularios**: Creación y edición de tareas con validaciones de longitud mínima.
- **Interacciones personalizadas**: Modales en React para confirmar acciones (ej. cambiar el estado de la tarea) sin usar alertas del sistema.

## Tecnologías

- React 18
- React Router DOM v6
- Vite
- Bootstrap 5 & Bootstrap Icons
- CSS personalizado (Variables CSS)
- UUID

## Instrucciones de Instalación y Ejecución

1. Asegúrate de tener Node.js instalado.
2. Clona este repositorio o navega a la carpeta del proyecto.
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abre la URL local proporcionada en tu navegador (generalmente `http://localhost:5173`).
