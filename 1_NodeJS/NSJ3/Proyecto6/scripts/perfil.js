function generarColorAvatar(nombre, apellido) {
  let str = (nombre + apellido).toLowerCase();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 60%, 45%)`;
}

const contenedorPerfil = document.getElementById('contenedorPerfil');
const estadoVacio = document.getElementById('estadoVacio');

function repoblarFormulario(datos) {
  document.getElementById('inp-nombre').value   = datos.nombre   || '';
  document.getElementById('inp-apellido').value = datos.apellido || '';
  document.getElementById('inp-fecha').value    = datos.fechaNacimiento || '';
  document.getElementById('inp-telefono').value = datos.telefono || '';

  document.querySelectorAll('input[name="genero"]').forEach(radio => {
    radio.checked = (radio.value === datos.genero);
  });

  window.Validador.resetearValidacion();
  
  const btnEnviar = document.getElementById('btnEnviar');
  if (btnEnviar) btnEnviar.disabled = false;
}

function calcularEdadStr(fechaString) {
  if (!fechaString) return '—';
  const fecha = new Date(fechaString);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fecha.getFullYear();
  const m = hoy.getMonth() - fecha.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
    edad--;
  }
  return edad + ' años';
}

function mostrar(datos) {
  estadoVacio.style.display = 'none';
  
  const iniciales = (datos.nombre.charAt(0) + datos.apellido.charAt(0)).toUpperCase();
  const bgColor = generarColorAvatar(datos.nombre, datos.apellido);
  const avatarHtml = `<div class="avatar-iniciales" style="background-color: ${bgColor}">${iniciales}</div>`;

  const timestamp = new Date().toLocaleString('es-AR');
  const generoVal = datos.genero ? datos.genero.charAt(0).toUpperCase() + datos.genero.slice(1).replace('-', ' ') : '—';
  const edadVal = calcularEdadStr(datos.fechaNacimiento);

  contenedorPerfil.innerHTML = `
    <article class="tarjeta-perfil">
      <header class="perfil-header">
        <div class="perfil-avatar">
          ${avatarHtml}
        </div>
        <div class="perfil-info-basica">
          <h3 class="perfil-nombre">${datos.nombre} ${datos.apellido}</h3>
        </div>
      </header>

      <div class="perfil-cuerpo">
        
        <section class="perfil-seccion">
          <h4 class="perfil-seccion-titulo">Información Personal</h4>
          <div class="perfil-fila"><span class="etiqueta">Nacimiento</span><span class="valor">${datos.fechaNacimiento || '—'}</span></div>
          <div class="perfil-fila"><span class="etiqueta">Edad</span><span class="valor">${edadVal}</span></div>
          <div class="perfil-fila"><span class="etiqueta">Género</span><span class="valor">${generoVal}</span></div>
          <div class="perfil-fila"><span class="etiqueta">Teléfono</span><span class="valor ${!datos.telefono ? 'valor-vacio' : ''}">${datos.telefono || '—'}</span></div>
        </section>

      </div>

      <footer class="perfil-footer">
        <span class="perfil-timestamp">Registrado: ${timestamp}</span>
        <button type="button" id="btnEditarPerfil" class="btn-editar">✏️ Editar perfil</button>
      </footer>
    </article>
  `;

  document.getElementById('btnEditarPerfil').addEventListener('click', () => {
    repoblarFormulario(datos);
    ocultar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  contenedorPerfil.style.display = 'block';
  contenedorPerfil.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ocultar() {
  contenedorPerfil.innerHTML = '';
  contenedorPerfil.style.display = 'none';
  estadoVacio.style.display = 'flex';
}

window.Perfil = {
  mostrar,
  ocultar,
  repoblarFormulario
};
