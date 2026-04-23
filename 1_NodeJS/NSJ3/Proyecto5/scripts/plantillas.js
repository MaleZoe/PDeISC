// Este archivo contiene funciones puras que retornan strings HTML.
// No manipulan el DOM. La inyección es responsabilidad de inyector.js.
// Esto permite que las plantillas sean fácilmente testeables y reutilizables.
window.PLANTILLAS = {
  tarjeta: function({ nombre = 'Usuario Nuevo', rol = 'Desarrollador Frontend', avatar = 'perfil' } = {}) {
    return `<div class="objeto-tarjeta">
  <img src="https://picsum.photos/seed/${avatar}/80/80" alt="Avatar de ${nombre}" class="tarjeta-avatar">
  <div class="tarjeta-cuerpo">
    <h3 class="tarjeta-nombre">${nombre}</h3>
    <p class="tarjeta-rol">${rol}</p>
    <button class="btn-tarjeta">Ver perfil</button>
  </div>
</div>`;
  },
  
  tabla: function({ titulo = 'Datos del sistema' } = {}) {
    return `<table class="objeto-tabla table table-bordered table-striped mt-3">
  <caption>${titulo}</caption>
  <thead class="table-dark">
    <tr>
      <th>Producto</th>
      <th>Cantidad</th>
      <th>Estado</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Teclado Mecánico</td>
      <td>15</td>
      <td><span class="badge bg-success">Activo</span></td>
    </tr>
    <tr>
      <td>Monitor 27"</td>
      <td>4</td>
      <td><span class="badge bg-warning text-dark">Pendiente</span></td>
    </tr>
    <tr>
      <td>Ratón Inalámbrico</td>
      <td>0</td>
      <td><span class="badge bg-danger">Inactivo</span></td>
    </tr>
    <tr>
      <td>Soporte Portátil</td>
      <td>23</td>
      <td><span class="badge bg-success">Activo</span></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2" class="text-end fw-bold">Total ítems registrados:</td>
      <td class="fw-bold">42</td>
    </tr>
  </tfoot>
</table>`;
  },

  formulario: function({ titulo = 'Formulario de Contacto' } = {}) {
    return `<form class="objeto-formulario" onsubmit="window.Inyector.manejarEnvio(event)">
  <fieldset>
    <legend>${titulo}</legend>
    <div class="mb-3">
      <label for="inputNombre" class="form-label">Nombre completo</label>
      <input type="text" id="inputNombre" class="form-control" placeholder="Ej. Juan Pérez" required>
    </div>
    <div class="mb-3">
      <label for="inputCorreo" class="form-label">Correo electrónico</label>
      <input type="email" id="inputCorreo" class="form-control" placeholder="juan@ejemplo.com" required>
    </div>
    <div class="mb-3">
      <label for="inputMensaje" class="form-label">Mensaje</label>
      <textarea id="inputMensaje" class="form-control" rows="3" placeholder="Escriba su mensaje aquí..." required></textarea>
    </div>
    <button type="submit" class="btn btn-primary w-100">Enviar mensaje</button>
  </fieldset>
</form>`;
  },

  galeria: function({ semilla = 'gal' } = {}) {
    return `<div class="objeto-galeria">
  <figure>
    <img src="https://picsum.photos/seed/${semilla}1/300/200" alt="Imagen 1">
    <figcaption>Vista panorámica 1</figcaption>
  </figure>
  <figure>
    <img src="https://picsum.photos/seed/${semilla}2/300/200" alt="Imagen 2">
    <figcaption>Vista panorámica 2</figcaption>
  </figure>
  <figure>
    <img src="https://picsum.photos/seed/${semilla}3/300/200" alt="Imagen 3">
    <figcaption>Detalle arquitectónico 3</figcaption>
  </figure>
  <figure>
    <img src="https://picsum.photos/seed/${semilla}4/300/200" alt="Imagen 4">
    <figcaption>Paisaje natural 4</figcaption>
  </figure>
</div>`;
  },

  lista: function({ titulo = 'Lista de tareas' } = {}) {
    return `<div class="objeto-lista">
  <h4>${titulo}</h4>
  <ul>
    <li>
      <input type="checkbox" id="tarea1" checked>
      <label for="tarea1">Revisar pull requests</label>
    </li>
    <li>
      <input type="checkbox" id="tarea2" checked>
      <label for="tarea2">Actualizar documentación</label>
    </li>
    <li>
      <input type="checkbox" id="tarea3">
      <label for="tarea3">Optimizar imágenes de la página principal</label>
    </li>
    <li>
      <input type="checkbox" id="tarea4">
      <label for="tarea4">Implementar modo oscuro</label>
    </li>
    <li>
      <input type="checkbox" id="tarea5">
      <label for="tarea5">Corregir bug en el enrutador</label>
    </li>
  </ul>
</div>`;
  },

  alerta: function({ tipo = 'info', mensaje } = {}) {
    const iconos = { info: 'ℹ️', exito: '✅', advertencia: '⚠️', error: '❌' };
    const etiquetas = { info: 'Información', exito: 'Éxito', advertencia: 'Advertencia', error: 'Error' };
    const mensajes = {
      info: 'El sistema se actualizará a la medianoche.',
      exito: 'Los cambios se han guardado correctamente.',
      advertencia: 'Su sesión expirará en 5 minutos.',
      error: 'No se pudo conectar con la base de datos.'
    };
    
    const msj = mensaje || mensajes[tipo] || 'Mensaje no especificado.';
    const icono = iconos[tipo] || 'ℹ️';
    const etiqueta = etiquetas[tipo] || 'Información';

    return `<div class="objeto-alerta alerta-${tipo}">
  <div class="d-flex w-100 align-items-center">
    <span class="fs-4 me-2">${icono}</span>
    <div>
      <strong>${etiqueta}:</strong> ${msj}
    </div>
  </div>
  <button onclick="this.parentElement.remove()" class="btn-cerrar-alerta">✕</button>
</div>`;
  },

  articulo: function({ titulo = 'Artículo de ejemplo', categoria = 'tecnología', autor = 'Autor Anónimo' } = {}) {
    return `<article class="objeto-articulo">
  <img src="https://picsum.photos/seed/${categoria}/600/200" alt="Portada del artículo">
  <div class="articulo-cuerpo">
    <span class="badge-categoria">${categoria}</span>
    <h3 class="mt-2">${titulo}</h3>
    <p class="text-muted">Este es un párrafo de ejemplo que funciona como resumen del artículo. Aquí se introducen los conceptos clave que atraerán al lector.</p>
    <hr>
    <div class="d-flex justify-content-between align-items-center">
      <small class="text-muted">Por ${autor} - 23 Abr 2026</small>
    </div>
  </div>
</article>`;
  },

  estadisticas: function() {
    return `<div class="objeto-estadisticas">
  <div class="metrica-card">
    <div class="metrica-icono">👥</div>
    <div class="metrica-valor">1,284</div>
    <div class="metrica-etiqueta">Usuarios activos</div>
    <div class="tendencia-positiva">↑ 12%</div>
  </div>
  <div class="metrica-card">
    <div class="metrica-icono">📦</div>
    <div class="metrica-valor">347</div>
    <div class="metrica-etiqueta">Pedidos del mes</div>
    <div class="tendencia-positiva">↑ 8%</div>
  </div>
  <div class="metrica-card">
    <div class="metrica-icono">⭐</div>
    <div class="metrica-valor">4.7</div>
    <div class="metrica-etiqueta">Valoración media</div>
    <div class="tendencia-positiva">↑ 3%</div>
  </div>
  <div class="metrica-card">
    <div class="metrica-icono">🔁</div>
    <div class="metrica-valor">23%</div>
    <div class="metrica-etiqueta">Tasa de rebote</div>
    <div class="tendencia-negativa">↓ 5%</div>
  </div>
</div>`;
  }
};
