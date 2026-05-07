import { Validador } from './validador.js';
import { Lector } from './lector.js';

export const App = (() => {

    // Variables de estado de la aplicación
    let metodoActivo = 'formdata';
    let listaUsuarios = [];

    // Configuración inicial al cargar la página
    function inicializar() {
        const formulario = document.getElementById('formularioUsuario');
        formulario.addEventListener('submit', manejarSubmit);
        
        const btnLimpiar = document.getElementById('btnLimpiar');
        btnLimpiar.addEventListener('click', manejarReset);

        // Eventos para cambiar entre los 3 métodos de lectura
        const tarjetasMetodo = document.querySelectorAll('.tarjeta-metodo');
        tarjetasMetodo.forEach(tarjeta => {
            tarjeta.addEventListener('click', () => {
                seleccionarMetodo(tarjeta.dataset.metodo);
            });
        });

        seleccionarMetodo('formdata');
        renderizarListado();
    }

    // Procesa el formulario cuando se intenta guardar
    function manejarSubmit(evento) {
        evento.preventDefault();
        const formulario = evento.target;

        // Primero validamos los campos
        if (!Validador.validarFormulario()) {
            mostrarBanner('error');
            return;
        }

        // Leemos los datos usando el método que esté activo
        const datos = Lector.leer(formulario, metodoActivo);
        
        // Guardamos información del método usado para mostrarlo en la lista
        let nombreMetodoUI = '';
        if (metodoActivo === 'formdata') nombreMetodoUI = 'FormData API';
        if (metodoActivo === 'getelementbyid') nombreMetodoUI = 'Acceso por ID';
        if (metodoActivo === 'formelements') nombreMetodoUI = 'form.elements[]';
        
        datos.metodoUsado = nombreMetodoUI;

        // Guardamos el usuario y actualizamos la interfaz
        guardarUsuario(datos);
        renderizarListado();
        actualizarContador();

        // Mostramos aviso de éxito y reseteamos el formulario
        mostrarBanner('exito');
        setTimeout(() => {
            ocultarBanner();
        }, 4000);

        formulario.reset();
        Validador.resetearValidacion();
        
        const contador = document.getElementById('contadorNotas');
        if (contador) {
            contador.textContent = '0 / 100';
            contador.className = 'contador-caracteres mt-1';
        }

        document.getElementById('seccionListado').scrollIntoView({ behavior: 'smooth' });
    }

    function guardarUsuario(datos) {
        listaUsuarios.push(datos);
    }

    // Dibuja la lista de usuarios en el HTML
    function renderizarListado() {
        const contenedor = document.getElementById('listaUsuarios');
        
        if (listaUsuarios.length === 0) {
            mostrarEstadoVacio();
            contenedor.innerHTML = '';
            return;
        }

        ocultarEstadoVacio();
        
        const html = listaUsuarios.map((usuario, index) => crearTarjetaUsuario(usuario, index)).join('');
        contenedor.innerHTML = html;
    }

    // Genera el código HTML para una tarjeta de usuario
    function crearTarjetaUsuario(datos, indice) {
        const notasHTML = datos.notas 
            ? `<div class="mt-3 pt-3 border-top"><small class="text-muted d-block mb-1">Objetivos:</small><p class="small mb-0">${datos.notas}</p></div>` 
            : '';

        return `
            <div class="col-md-6 col-lg-4">
                <div class="tarjeta-usuario tarjeta-entrada">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h5 class="fw-bold text-truncate mb-0" title="${datos.nombre}">
                            ${datos.nombre}
                        </h5>
                        <span class="badge bg-secondary rounded-pill">#${indice + 1}</span>
                    </div>
                    
                    <div class="mb-3">
                        <span class="badge bg-primario bg-opacity-25 text-primario border border-primario rounded-pill px-2 py-1" style="font-size: 0.7rem;">
                            Método: ${datos.metodoUsado}
                        </span>
                    </div>

                    <ul class="list-unstyled small mb-0 d-flex flex-column gap-2 text-muted">
                        <li><strong>Email:</strong> ${datos.email}</li>
                        <li><strong>Nacimiento:</strong> ${datos.fecha}</li>
                        <li><strong>Plan:</strong> ${datos.plan}</li>
                        <li><strong>Horario:</strong> ${datos.horario}</li>
                        <li><strong>Certificado:</strong> ${datos.certificado}</li>
                    </ul>

                    ${notasHTML}
                </div>
            </div>
        `;
    }

    function manejarReset() {
        setTimeout(() => {
            Validador.resetearValidacion();
            ocultarBanner();
            
            const contador = document.getElementById('contadorNotas');
            if (contador) {
                contador.textContent = '0 / 100';
                contador.className = 'contador-caracteres mt-1';
            }
        }, 10);
    }

    // Cambia el método de lectura de datos actual
    function seleccionarMetodo(metodo) {
        metodoActivo = metodo;

        document.querySelectorAll('.tarjeta-metodo').forEach(tarjeta => {
            if (tarjeta.dataset.metodo === metodo) {
                tarjeta.classList.add('metodo-activo');
            } else {
                tarjeta.classList.remove('metodo-activo');
            }
        });

        const indicador = document.getElementById('metodoActivo');
        let nombre = '';
        if (metodo === 'formdata') nombre = 'FormData API';
        if (metodo === 'getelementbyid') nombre = 'Acceso por ID';
        if (metodo === 'formelements') nombre = 'form.elements[]';
        indicador.textContent = `Método activo: ${nombre}`;
    }

    // Muestra avisos visuales en la parte superior del formulario
    function mostrarBanner(tipo) {
        const banner = document.getElementById('bannerFeedback');
        const icono = banner.querySelector('.banner-icono');
        const texto = banner.querySelector('.banner-texto');

        banner.className = `mt-4 p-3 d-flex align-items-center gap-3 banner-${tipo}`;
        
        if (tipo === 'exito') {
            icono.textContent = '';
            texto.textContent = '¡Inscripción realizada con éxito!';
        } else {
            icono.textContent = '';
            texto.textContent = 'Hay errores en los datos. Revisá los campos.';
        }

        banner.style.display = 'flex';
    }

    function ocultarBanner() {
        const banner = document.getElementById('bannerFeedback');
        banner.style.display = 'none';
    }

    function actualizarContador() {
        const contador = document.getElementById('contadorUsuarios');
        contador.textContent = `${listaUsuarios.length} miembros inscritos`;
    }

    function mostrarEstadoVacio() {
        document.getElementById('estadoVacio').style.display = 'block';
    }

    function ocultarEstadoVacio() {
        document.getElementById('estadoVacio').style.display = 'none';
    }

    document.addEventListener('DOMContentLoaded', inicializar);

    return {
        seleccionarMetodo,
        getMetodoActivo: () => metodoActivo,
        getListaUsuarios: () => listaUsuarios
    };

})();


