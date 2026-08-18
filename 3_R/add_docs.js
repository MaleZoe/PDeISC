const fs = require('fs');
const path = require('path');

// Diccionarios para R2 para comentarios más precisos
const r2Docs = {
  'App.jsx': 'Componente principal de enrutamiento. Define las rutas de la aplicación.',
  'main.jsx': 'Punto de entrada de la aplicación React. Inicializa el Contexto y el Router.',
  'TareasContext.jsx': 'Contexto global para manejar el estado de las tareas y el tema (claro/oscuro).',
  'useTareas.js': 'Hook personalizado para facilitar el acceso al TareasContext.',
  'tareasIniciales.js': 'Datos semilla estáticos para inicializar la lista de tareas.',
  'InicioPage.jsx': 'Vista principal que muestra el listado de todas las tareas.',
  'CrearTareaPage.jsx': 'Vista con el formulario para crear una nueva tarea con validación.',
  'EditarTareaPage.jsx': 'Vista con el formulario para editar los detalles de una tarea existente.',
  'DetalleTareaPage.jsx': 'Vista que muestra la información completa de una tarea específica.',
  'NoEncontradoPage.jsx': 'Vista de fallback para manejar errores 404 (rutas no encontradas).',
  'Navbar.jsx': 'Barra de navegación superior con el toggle de temas claro/oscuro.',
  'TareaCard.jsx': 'Componente de tarjeta para renderizar un resumen de la tarea en la lista.',
  'TareaEstadoBadge.jsx': 'Componente visual (badge) que indica el estado (completa/pendiente) de la tarea.',
  'VolverInicioButton.jsx': 'Botón reutilizable para navegar rápidamente de regreso al inicio.'
};

function addDocumentation(dir, isR2) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    
    // Ignorar carpetas no relevantes
    if (fullPath.includes('node_modules') || fullPath.includes('dist') || fullPath.includes('.git')) {
      continue;
    }

    if (fs.statSync(fullPath).isDirectory()) {
      addDocumentation(fullPath, isR2);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Evitar duplicar comentarios si ya existe uno al principio
      if (!content.trim().startsWith('/**') && !content.trim().startsWith('//')) {
        let docString = '';
        
        if (isR2 && r2Docs[file]) {
          docString = `/**\n * ${file}\n * ${r2Docs[file]}\n */\n\n`;
        } else {
          // Documentación genérica pero suficiente para R1
          const componentName = file.replace(/\.jsx?$/, '');
          docString = `/**\n * Archivo: ${file}\n * Propósito: Define la lógica y funcionalidad asociada a ${componentName}.\n */\n\n`;
        }

        fs.writeFileSync(fullPath, docString + content, 'utf8');
        console.log(`Documentado: ${fullPath}`);
      }
    }
  }
}

console.log("Iniciando documentación de R2...");
addDocumentation('C:\\Users\\salvi\\Documents\\GitHub\\PDeISC\\3_R\\R2\\src', true);

console.log("Iniciando documentación de R1...");
addDocumentation('C:\\Users\\salvi\\Documents\\GitHub\\PDeISC\\3_R\\R1', false);

console.log("Proceso completado.");
