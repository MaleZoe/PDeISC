// NJS4/Proyecto 3/scripts/listado.js

/**
 * Módulo Listado
 * Responsabilidad: Generar y actualizar el HTML dinámico de las tarjetas 
 * de personas y manejar el filtrado local (sin alterar localStorage).
 */

window.Listado = (() => {

    const listaPersonas = document.getElementById('listaPersonas');
    const estadoVacio = document.getElementById('estadoVacio');
    const textoContador = document.getElementById('textoContadorListado');
    const badgeContadorNavbar = document.getElementById('badgeContador');
    const btnVaciarTodo = document.getElementById('btnVaciarTodo');

    /**
     * Convierte texto a minúsculas y elimina tildes/acentos
     */
    function normalizarTexto(texto) {
        if (!texto) return '';
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    /**
     * Deriva un número de 1 a 8 basado en los caracteres del ID de forma determinista
     */
    function generarColorAvatar(id) {
        if (!id) return 1;
        let suma = 0;
        for (let i = 0; i < id.length; i++) {
            suma += id.charCodeAt(i);
        }
        return (suma % 8) + 1; // Devuelve 1 a 8
    }

    /**
     * Construye y retorna el string HTML de la tarjeta de persona
     */
    function crearFilaPersona(persona, indice) {
        const nombreCompl = `${persona.apellido}, ${persona.nombre}`;
        const iniciales = (persona.nombre.charAt(0) + persona.apellido.charAt(0)).toUpperCase();
        const colorAvatar = generarColorAvatar(persona.id);
        
        const esMasculino = persona.sexo === 'Masculino';
        const badgeSexoHtml = `<span class="badge rounded-pill ${esMasculino ? 'badge-masculino' : 'badge-femenino'} shadow-sm">${persona.sexo}</span>`;
        
        const formatFechaNac = persona.fechaNac 
            ? new Date(persona.fechaNac).toLocaleDateString('es-AR', { timeZone: 'UTC' }) 
            : '—';
        
        const edadTexto = persona.edad !== null ? `${persona.edad} años` : '—';
        const docTexto = persona.documento || '—';
        const ecTexto = persona.estadoCivil || '—';
        const nacTexto = persona.nacionalidad || '—';
        const telTexto = persona.telefono || '—';
        const emailHtml = persona.email ? `<a href="mailto:${persona.email}" class="text-primary text-decoration-none">${persona.email}</a>` : '—';
        
        let hijosTexto = 'No';
        if (persona.tieneHijos === 'Si') {
            hijosTexto = `Sí — ${persona.cantidadHijos} hijo${persona.cantidadHijos > 1 ? 's' : ''}`;
        }

        const fechaRegTexto = new Date(persona.fechaRegistro).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });

        return `
            <div class="col-lg-6">
            <article class="tarjeta-persona tarjeta-entrada h-100" style="animation-delay: ${indice * 0.05}s">
                <div class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-secondary border-opacity-25">
                    <div class="avatar avatar-color-${colorAvatar}">
                        ${iniciales}
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="m-0 fw-bold">${nombreCompl}</h6>
                        <div class="d-flex align-items-center gap-2 mt-1">
                            ${badgeSexoHtml}
                            <span class="badge bg-dark bg-opacity-50 text-secondary border border-secondary border-opacity-25 rounded-pill" style="font-size: 0.65rem;">#${indice + 1}</span>
                        </div>
                    </div>
                </div>

                <div class="grilla-datos">
                    <div class="dato-item">
                        <div class="dato-etiqueta">Edad</div>
                        <div class="dato-valor">${edadTexto}</div>
                    </div>
                    <div class="dato-item">
                        <div class="dato-etiqueta">Fecha de Nac.</div>
                        <div class="dato-valor">${formatFechaNac}</div>
                    </div>
                    <div class="dato-item">
                        <div class="dato-etiqueta">Documento</div>
                        <div class="dato-valor">${docTexto}</div>
                    </div>
                    <div class="dato-item">
                        <div class="dato-etiqueta">Estado Civil</div>
                        <div class="dato-valor text-truncate" title="${ecTexto}">${ecTexto}</div>
                    </div>
                    <div class="dato-item">
                        <div class="dato-etiqueta">Nacionalidad</div>
                        <div class="dato-valor text-truncate" title="${nacTexto}">${nacTexto}</div>
                    </div>
                    <div class="dato-item">
                        <div class="dato-etiqueta">Teléfono</div>
                        <div class="dato-valor">${telTexto}</div>
                    </div>
                    <div class="dato-item">
                        <div class="dato-etiqueta">Email</div>
                        <div class="dato-valor text-truncate" title="${persona.email}">${emailHtml}</div>
                    </div>
                    <div class="dato-item">
                        <div class="dato-etiqueta">Hijos</div>
                        <div class="dato-valor">${hijosTexto}</div>
                    </div>
                    <div class="dato-item">
                        <div class="dato-etiqueta">Dirección</div>
                        <div class="dato-valor text-truncate" title="${persona.direccion || '—'}">${persona.direccion || '—'}</div>
                    </div>
                </div>

                <div class="text-muted small mt-3 pt-2 border-top border-secondary border-opacity-25">
                    Registrado el ${fechaRegTexto}
                </div>
            </article>
            </div>
        `;
    }

    /**
     * Punto de entrada principal para renderizar
     */
    function renderizarListado(personasAMostrar, totalAbsoluto = personasAMostrar.length) {
        actualizarEstadoVacio(totalAbsoluto);
        actualizarContador(personasAMostrar.length, totalAbsoluto);
        
        // Habilitar/deshabilitar botón vaciar
        if (btnVaciarTodo) {
            btnVaciarTodo.disabled = totalAbsoluto === 0;
        }

        if (!listaPersonas) return;
        listaPersonas.innerHTML = '';
        
        if (personasAMostrar.length === 0 && totalAbsoluto > 0) {
            listaPersonas.innerHTML = `
                <div class="text-center py-5 bg-dark bg-opacity-25 rounded-3 border border-secondary border-opacity-25">
                    <p class="text-muted m-0">Sin resultados para la búsqueda.</p>
                </div>`;
            return;
        }

        let htmlFinal = '';
        personasAMostrar.forEach((p, idx) => {
            htmlFinal += crearFilaPersona(p, idx);
        });
        listaPersonas.innerHTML = htmlFinal;
    }

    /**
     * Muestra un popup modal para confirmar la eliminación
     */
    function confirmarEliminacion(id, nombre) {
        // Crear modal si no existe
        let modal = document.getElementById('modalEliminar');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalEliminar';
            modal.className = 'modal fade';
            modal.tabIndex = -1;
            modal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered modal-sm">
                    <div class="modal-content border-0 shadow-lg" style="background: #1e293b;">
                        <div class="modal-header border-bottom border-danger border-opacity-25 px-4 pt-4 pb-3">
                            <h5 class="modal-title text-danger fw-bold">Confirmar Eliminación</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body px-4 py-3">
                            <p class="text-white mb-0">¿Estás seguro de que querés eliminar a <strong id="modalNombrePersona" class="text-danger"></strong>?</p>
                        </div>
                        <div class="modal-footer border-0 px-4 pb-4 pt-2">
                            <button type="button" class="btn btn-outline-secondary btn-sm px-3" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" id="btnConfirmarEliminar" class="btn btn-danger btn-sm px-4 fw-bold">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        document.getElementById('modalNombrePersona').textContent = nombre;
        
        // Clonar botón para limpiar listeners anteriores
        const btnConfirmar = document.getElementById('btnConfirmarEliminar');
        const nuevoBtn = btnConfirmar.cloneNode(true);
        btnConfirmar.parentNode.replaceChild(nuevoBtn, btnConfirmar);

        // Obtener o crear instancia (evita conflictos si el modal ya fue usado)
        const bsModal = bootstrap.Modal.getOrCreateInstance(modal);

        document.getElementById('btnConfirmarEliminar').addEventListener('click', () => {
            eliminarPersona(id);
            bsModal.hide();
        });

        bsModal.show();
    }

    /**
     * Filtra localmente el array obtenido del Storage
     */
    function filtrar(textoBusqueda) {
        const personas = window.Storage.obtenerPersonas();
        const textoNorm = normalizarTexto(textoBusqueda.trim());
        
        if (!textoNorm) {
            renderizarListado(personas, personas.length);
            return;
        }

        const filtradas = personas.filter(p => {
            const doc = p.documento ? p.documento.toLowerCase() : '';
            return normalizarTexto(p.nombre).includes(textoNorm) || 
                   normalizarTexto(p.apellido).includes(textoNorm) ||
                   doc.includes(textoNorm);
        });

        renderizarListado(filtradas, personas.length);
    }

    function actualizarContador(visibles, total) {
        if (textoContador) {
            textoContador.textContent = `Mostrando ${visibles} de ${total} personas`;
        }
    }

    function actualizarBadgeNavbar(total) {
        if (badgeContadorNavbar) {
            badgeContadorNavbar.textContent = total;
            // Animación de 'pop' si hay un cambio
            badgeContadorNavbar.style.transform = 'scale(1.2)';
            setTimeout(() => badgeContadorNavbar.style.transform = 'scale(1)', 200);
        }
    }

    function actualizarEstadoVacio(total) {
        if (!estadoVacio) return;
        if (total === 0) {
            estadoVacio.classList.remove('d-none');
            if (listaPersonas) listaPersonas.classList.add('d-none');
            // Ocultar barra de búsqueda si está vacío
            const busq = document.getElementById('busquedaPersona');
            if(busq) busq.disabled = true;
        } else {
            estadoVacio.classList.add('d-none');
            if (listaPersonas) listaPersonas.classList.remove('d-none');
            const busq = document.getElementById('busquedaPersona');
            if(busq) busq.disabled = false;
        }
    }

    /**
     * Es llamada desde el HTML onclick
     */
    function eliminarPersona(id) {
        const exito = window.Storage.eliminarPersona(id);
        if (exito) {
            // Refrescar vistas respetando el filtro actual
            const busquedaVal = document.getElementById('busquedaPersona').value;
            filtrar(busquedaVal);
            actualizarBadgeNavbar(window.Storage.obtenerTotal());
            
            // Notificar a App para actualizar estadisticas
            document.dispatchEvent(new Event('persona-eliminada'));
        }
    }

    return {
        renderizarListado,
        filtrar,
        actualizarContador,
        actualizarBadgeNavbar,
        actualizarEstadoVacio,
        eliminarPersona,
        confirmarEliminacion
    };
})();
