/* 
 * ORQUESTADOR PRINCIPAL - APP.JS
 * Punto de entrada de la lógica del cliente. Conecta eventos con el Estado y el Renderizador.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos interactivos
    const input = document.getElementById('inputNumero');
    const btnAgregar = document.getElementById('btnAgregar');
    const btnExportar = document.getElementById('btnExportar');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const listaUI = document.getElementById('listaNumeros');

    // Estado inicial de la aplicación
    actualizarInterfaz();

    /* --- ESCUCHADORES DE EVENTOS --- */

    // Clic en el botón de agregar
    btnAgregar.addEventListener('click', manejarAgregado);

    // Presión de la tecla Enter en el input
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') manejarAgregado();
    });

    // Limpieza de feedback de error al volver a escribir
    input.addEventListener('input', () => {
        window.Renderizador.limpiarError();
    });

    // Resaltado visual del input
    input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
    input.addEventListener('blur', () => input.parentElement.classList.remove('focused'));

    // Delegación de eventos para los botones de eliminación dinámica
    listaUI.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-eliminar');
        if (btn) {
            const indice = parseInt(btn.dataset.idx);
            manejarEliminado(indice);
        }
    });

    // Clic en el botón de exportación
    btnExportar.addEventListener('click', manejarExportacion);

    // Clic en el botón de limpieza total
    btnLimpiar.addEventListener('click', () => {
        if (window.Estado.lista.length === 0) return;
        
        const confirmar = confirm("¿Estás seguro de que deseas vaciar toda la colección?");
        if (confirmar) {
            window.Estado.limpiar();
            window.Renderizador.limpiarLista();
            window.Renderizador.mostrarToast("Laboratorio reiniciado.", "info");
            actualizarInterfaz();
        }
    });

    /* --- LÓGICA DE NEGOCIO --- */

    // Procesa el intento de agregar un número a la colección
    function manejarAgregado() {
        // Validar formato y rango
        const validacion = window.Validador.validarEntrada(input.value);

        if (!validacion.valido) {
            window.Renderizador.mostrarError(validacion.error);
            return;
        }

        try {
            // Intentar persistir en el estado (controla duplicados y máximos)
            window.Estado.agregar(validacion.numero);
            
            // Reflejar cambio en la lista visual
            const indice = window.Estado.lista.length - 1;
            window.Renderizador.agregarItemLista(
                window.Validador.formatearNumero(validacion.numero), 
                indice
            );
            
            // Actualizar contadores y estadísticas
            actualizarInterfaz();
            
            // Resetear campo de entrada
            input.value = '';
            input.focus();
            
        } catch (error) {
            // Mostrar error si el estado rechaza el número (ej: duplicado)
            window.Renderizador.mostrarError(error.message);
        }
    }

    // Procesa la eliminación física y visual de un registro
    function manejarEliminado(indice) {
        const valorEliminado = window.Estado.eliminar(indice);
        if (valorEliminado !== null) {
            window.Renderizador.eliminarItemLista(indice);
            // Sincronizar estadísticas tras el fin de la animación
            setTimeout(() => actualizarInterfaz(), 300);
        }
    }

    // Gestiona la petición asíncrona de exportación al servidor
    async function manejarExportacion() {
        if (!window.Estado.puedeExportar()) {
            window.Renderizador.mostrarToast("Se requieren al menos 10 números.", "advertencia");
            return;
        }

        const textoOriginal = btnExportar.textContent;
        btnExportar.disabled = true;
        btnExportar.textContent = "Guardando...";

        try {
            const respuesta = await fetch('/exportar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numeros: window.Estado.lista })
            });

            const data = await respuesta.json();

            if (data.ok) {
                window.Renderizador.mostrarToast(`✓ Archivo guardado: ${data.archivo}`, "exito");
                window.Renderizador.activarAnimacionExito();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            window.Renderizador.mostrarToast(error.message || "Error al conectar con el servidor.", "error");
        } finally {
            // Restaurar estado del botón
            btnExportar.disabled = false;
            btnExportar.textContent = textoOriginal;
            actualizarInterfaz();
        }
    }

    // Sincroniza todos los componentes de la UI con el estado actual del laboratorio
    function actualizarInterfaz() {
        const stats = window.Estado.estadisticas();
        const cantidad = window.Estado.lista.length;

        window.Renderizador.actualizarContador(cantidad, window.Estado.MAX_NUMEROS);
        window.Renderizador.actualizarEstadisticas(stats);
        window.Renderizador.actualizarBotonExportar(
            window.Estado.puedeExportar(), 
            window.Estado.estaLlena()
        );

        // Controlar visibilidad del placeholder vacío
        if (cantidad === 0) {
            window.Renderizador.mostrarEstadoVacio();
        } else {
            window.Renderizador.ocultarEstadoVacio();
        }
    }
});
