// aca toco el html para que se vea lo que pasa
// nada de logica pesada aca, solo dibujo
export const Renderizador = {
    // me guardo los elementos para no buscarlos cada vez
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

    // meto un numero nuevo en la lista
    agregarItemLista(numero, indice) {
        const li = document.createElement('li');
        li.className = 'item-numero';
        li.dataset.indice = indice;
        // que entre con onda
        li.style.animation = 'entradaItem 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        
        li.innerHTML = `
            <span class="numero-indice">#${indice + 1}</span>
            <span class="numero-valor">${numero}</span>
            <div class="acciones-item">
                <button class="btn-editar" aria-label="editar numero ${numero}" data-idx="${indice}">✎</button>
                <button class="btn-eliminar" aria-label="borrar numero ${numero}" data-idx="${indice}">×</button>
            </div>
        `;
        
        this.elementos.lista.appendChild(li);
    },

    // saco un numero y reacomodo todo
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

    // para que los numeros de orden no queden mal al borrar
    reindexarLista() {
        const items = this.elementos.lista.querySelectorAll('.item-numero');
        items.forEach((item, index) => {
            item.dataset.indice = index;
            item.querySelector('.numero-indice').textContent = `#${index + 1}`;
            item.querySelector('.btn-eliminar').dataset.idx = index;
            const btnEditar = item.querySelector('.btn-editar');
            if (btnEditar) btnEditar.dataset.idx = index;
        });
    },

    // pongo el item en modo edicion
    activarModoEdicion(indice) {
        const item = Array.from(this.elementos.lista.querySelectorAll('.item-numero'))
            .find(el => parseInt(el.dataset.indice) === indice);
        
        if (!item) return;

        const spanValor = item.querySelector('.numero-valor');
        const valorActual = spanValor.textContent;
        const btnEditar = item.querySelector('.btn-editar');

        // cambio el texto por un input
        spanValor.innerHTML = `<input type="number" class="input-edit" value="${valorActual}" step="any">`;
        const input = spanValor.querySelector('input');
        input.focus();
        input.select();

        // cambio el icono del boton
        btnEditar.textContent = 'ok';
        btnEditar.classList.add('modo-guardar');

        return input;
    },

    // vuelvo al estado normal
    finalizarEdicion(indice, nuevoValor) {
        const item = Array.from(this.elementos.lista.querySelectorAll('.item-numero'))
            .find(el => parseInt(el.dataset.indice) === indice);
        
        if (!item) return;

        const spanValor = item.querySelector('.numero-valor');
        const btnEditar = item.querySelector('.btn-editar');

        spanValor.textContent = nuevoValor;
        btnEditar.textContent = '✎';
        btnEditar.classList.remove('modo-guardar');
    },

    // para ver cuanto falta para llenar
    actualizarContador(cantidad, max) {
        const porcentaje = (cantidad / max) * 100;
        this.elementos.barraProgreso.style.width = `${porcentaje}%`;
        
        let texto = `${cantidad} / ${max} numeros`;
        this.elementos.contadorTexto.className = 'badge contador-badge';
        
        if (cantidad >= 10 && cantidad < 20) {
            this.elementos.contadorTexto.classList.add('estado-listo');
        } else if (cantidad >= 20) {
            this.elementos.contadorTexto.classList.add('estado-lleno');
            texto = `no entra mas nada! ${cantidad} / ${max}`;
        }
        
        this.elementos.contadorTexto.textContent = texto;
    },

    // pongo los resultados de las cuentas en el panel
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

    // aviso que se mandaron una macana
    mostrarError(mensaje) {
        this.elementos.error.textContent = mensaje;
        this.elementos.input.classList.add('input-error');
        
        if (this._errorTimeout) clearTimeout(this._errorTimeout);
        this._errorTimeout = setTimeout(() => this.limpiarError(), 3000);
    },

    // saco el color de error
    limpiarError() {
        this.elementos.error.textContent = '';
        this.elementos.input.classList.remove('input-error');
    },

    // un cartelito que aparece y se va
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

    // limpio toda la vista
    limpiarLista() {
        this.elementos.lista.innerHTML = '';
    },

    // muestro que no hay nada
    mostrarEstadoVacio() {
        this.elementos.estadoVacio.style.display = 'flex';
    },

    // saco el cartel de vacio
    ocultarEstadoVacio() {
        this.elementos.estadoVacio.style.display = 'none';
    },

    // prendo o apago botones segun la cantidad
    actualizarBotonExportar(puedeExportar, llena) {
        this.elementos.btnExportar.disabled = !puedeExportar;
        
        if (!puedeExportar) {
            this.elementos.btnExportar.setAttribute('title', 'metele al menos 10');
        } else {
            this.elementos.btnExportar.setAttribute('title', 'ahora si podes guardar');
        }

        if (llena) {
            this.elementos.input.disabled = true;
            this.elementos.btnAgregar.disabled = true;
        } else {
            this.elementos.input.disabled = false;
            this.elementos.btnAgregar.disabled = false;
        }
    },

    // una animacion copada cuando todo sale bien
    activarAnimacionExito() {
        const card = this.elementos.lista.closest('.card-neon');
        card.classList.add('animacion-exito');
        setTimeout(() => card.classList.remove('animacion-exito'), 600);
    }
};
