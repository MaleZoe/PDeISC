/* 
 * MÓDULO DE RENDERIZADO - MANIPULACIÓN DEL DOM
 * Encargado de actualizar la interfaz visual basándose en los datos.
 * No contiene lógica de negocio.
 */

window.Renderizador = {
    // Referencias cacheadas a los elementos del DOM
    elementos: {
        lista: document.getElementById('listaNumeros'),
        input: document.getElementById('inputNumero'),
        btnAgregar: document.getElementById('btnAgregar'),
        error: document.getElementById('mensajeError'),
        contadorTexto: document.getElementById('contadorTexto'),
        barraProgreso: document.getElementById('barraProgreso'),
        estadoVacio: document.getElementById('estadoVacio'),
        btnExportar: document.getElementById('btnExportar'),
        stats: {
            promedio: document.getElementById('statsPromedio'),
            suma: document.getElementById('statsSuma'),
            minimo: document.getElementById('statsMinimo'),
            maximo: document.getElementById('statsMaximo')
        },
        contenedorToast: document.getElementById('contenedorToast')
    },

    // Inyecta un nuevo item en la lista con animación de entrada
    agregarItemLista(numero, indice) {
        const li = document.createElement('li');
        li.className = 'item-numero';
        li.dataset.indice = indice;
        // Animación de entrada definida en CSS
        li.style.animation = 'entradaItem 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        
        li.innerHTML = `
            <span class="numero-indice">#${indice + 1}</span>
            <span class="numero-valor">${numero}</span>
            <button class="btn-eliminar" aria-label="Eliminar número ${numero}" data-idx="${indice}">×</button>
        `;
        
        this.elementos.lista.appendChild(li);
    },

    // Elimina un item con animación de salida y dispara el re-indexado
    eliminarItemLista(indice) {
        const items = this.elementos.lista.querySelectorAll('.item-numero');
        const itemAEliminar = Array.from(items).find(el => parseInt(el.dataset.indice) === indice);
        
        if (itemAEliminar) {
            itemAEliminar.style.animation = 'salidaItem 0.3s ease forwards';
            setTimeout(() => {
                itemAEliminar.remove();
                this.reindexarLista();
            }, 300);
        }
    },

    // Actualiza los números de orden (#1, #2...) tras una eliminación
    reindexarLista() {
        const items = this.elementos.lista.querySelectorAll('.item-numero');
        items.forEach((item, index) => {
            item.dataset.indice = index;
            item.querySelector('.numero-indice').textContent = `#${index + 1}`;
            item.querySelector('.btn-eliminar').dataset.idx = index;
        });
    },

    // Actualiza el badge del contador y los estados de color (ámbar/verde/rojo)
    actualizarContador(cantidad, max) {
        const porcentaje = (cantidad / max) * 100;
        this.elementos.barraProgreso.style.width = `${porcentaje}%`;
        
        let texto = `${cantidad} / ${max} números`;
        this.elementos.contadorTexto.className = 'badge contador-badge';
        
        if (cantidad >= 10 && cantidad < 20) {
            this.elementos.contadorTexto.classList.add('estado-listo');
        } else if (cantidad >= 20) {
            this.elementos.contadorTexto.classList.add('estado-lleno');
            texto = `¡Límite alcanzado! ${cantidad} / ${max}`;
        }
        
        this.elementos.contadorTexto.textContent = texto;
    },

    // Actualiza el panel lateral de estadísticas con los nuevos valores
    actualizarEstadisticas(stats) {
        const { promedio, minimo, maximo, suma, cantidad } = stats;
        
        if (cantidad === 0) {
            this.elementos.stats.promedio.textContent = '—';
            this.elementos.stats.suma.textContent = '—';
            this.elementos.stats.minimo.textContent = '—';
            this.elementos.stats.maximo.textContent = '—';
            return;
        }

        this.elementos.stats.promedio.textContent = promedio;
        this.elementos.stats.suma.textContent = suma;
        this.elementos.stats.minimo.textContent = minimo;
        this.elementos.stats.maximo.textContent = maximo;
    },

    // Muestra un error efímero debajo del input de ingreso
    mostrarError(mensaje) {
        this.elementos.error.textContent = mensaje;
        this.elementos.input.classList.add('input-error');
        
        if (this._errorTimeout) clearTimeout(this._errorTimeout);
        this._errorTimeout = setTimeout(() => this.limpiarError(), 3000);
    },

    // Limpia el estado de error del input
    limpiarError() {
        this.elementos.error.textContent = '';
        this.elementos.input.classList.remove('input-error');
    },

    // Genera y muestra una notificación toast en pantalla
    mostrarToast(mensaje, tipo = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-item toast-${tipo}`;
        
        const iconos = {
            exito: '✓',
            error: '✕',
            info: 'ℹ',
            advertencia: '⚠'
        };

        toast.innerHTML = `<span>${iconos[tipo] || '•'}</span> ${mensaje}`;
        this.elementos.contenedorToast.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(20px)';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    },

    // Vacía la lista visual de números
    limpiarLista() {
        this.elementos.lista.innerHTML = '';
    },

    // Alterna la visibilidad del placeholder de lista vacía
    mostrarEstadoVacio() {
        this.elementos.estadoVacio.style.display = 'flex';
    },

    ocultarEstadoVacio() {
        this.elementos.estadoVacio.style.display = 'none';
    },

    // Controla el estado habilitado/deshabilitado de los controles según el volumen de datos
    actualizarBotonExportar(puedeExportar, llena) {
        this.elementos.btnExportar.disabled = !puedeExportar;
        
        if (!puedeExportar) {
            this.elementos.btnExportar.setAttribute('title', 'Necesitás al menos 10 números para exportar.');
        } else {
            this.elementos.btnExportar.setAttribute('title', 'Guardar lista como archivo .txt');
        }

        if (llena) {
            this.elementos.input.disabled = true;
            this.elementos.btnAgregar.disabled = true;
            this.elementos.input.placeholder = "Límite alcanzado";
        } else {
            this.elementos.input.disabled = false;
            this.elementos.btnAgregar.disabled = false;
            this.elementos.input.placeholder = "Ej: 42.5";
        }
    },

    // Dispara un flash visual de confirmación
    activarAnimacionExito() {
        const card = this.elementos.lista.closest('.card-neon');
        card.classList.add('animacion-exito');
        setTimeout(() => card.classList.remove('animacion-exito'), 600);
    }
};
