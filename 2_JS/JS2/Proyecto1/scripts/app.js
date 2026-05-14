// aca arranca todo el bardo
import { Estado } from '../modules/estado.js';
import { Validador } from '../modules/validador.js';
import { Renderizador } from '../modules/renderizador.js';

document.addEventListener('DOMContentLoaded', () => {
    // me traigo los botones y el input
    const input = document.getElementById('inputNumero');
    const btnAgregar = document.getElementById('btnAgregar');
    const btnExportar = document.getElementById('btnExportar');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const listaUI = document.getElementById('listaNumeros');

    // pongo la pantalla como debe estar al principio
    actualizarInterfaz();

    // cuando clickean el boton de agregar
    btnAgregar.addEventListener('click', manejarAgregado);

    // si aprietan enter tambien vale
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') manejarAgregado();
    });

    // si escriben, les limpio el error anterior
    input.addEventListener('input', () => {
        Renderizador.limpiarError();
    });

    // para borrar uno solo de la lista
    listaUI.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-eliminar');
        if (btn) {
            const indice = parseInt(btn.dataset.idx);
            manejarEliminado(indice);
        }
    });

    // para guardar el txt
    btnExportar.addEventListener('click', manejarExportacion);

    // para vaciar todo
    btnLimpiar.addEventListener('click', () => {
        if (Estado.lista.length === 0) return;
        
        // sin alerts dice el estanga, asi que lo borro de una
        Estado.limpiar();
        Renderizador.limpiarLista();
        Renderizador.mostrarToast("limpiaste todo el laboratorio", "info");
        actualizarInterfaz();
    });

    // para meter un numero nuevo
    function manejarAgregado() {
        // me fijo si lo que puso es un numero
        const validacion = Validador.validarEntrada(input.value);

        if (!validacion.valido) {
            Renderizador.mostrarError(validacion.error);
            return;
        }

        try {
            // lo meto en el estado
            Estado.agregar(validacion.numero);
            
            // lo dibujo en la lista
            const indice = Estado.lista.length - 1;
            Renderizador.agregarItemLista(
                Validador.formatearNumero(validacion.numero), 
                indice
            );
            
            // actualizo los numeritos de la pantalla
            actualizarInterfaz();
            
            // limpio para el que viene
            input.value = '';
            input.focus();
            
        } catch (error) {
            // si el estado chilla (duplicado por ejemplo)
            Renderizador.mostrarError(error.message);
        }
    }

    // para sacar uno
    function manejarEliminado(indice) {
        const valorEliminado = Estado.eliminar(indice);
        if (valorEliminado !== null) {
            Renderizador.eliminarItemLista(indice);
            // espero a que termine la animacion para actualizar cuentas
            setTimeout(() => actualizarInterfaz(), 300);
        }
    }

    // hablo con el server para bajar el archivo
    async function manejarExportacion() {
        if (!Estado.puedeExportar()) {
            Renderizador.mostrarToast("te faltan numeros che", "advertencia");
            return;
        }

        const textoOriginal = btnExportar.textContent;
        btnExportar.disabled = true;
        btnExportar.textContent = "guardando...";

        try {
            const respuesta = await fetch('/exportar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numeros: Estado.lista })
            });

            const data = await respuesta.json();

            if (data.ok) {
                Renderizador.mostrarToast(`listo! se guardo como ${data.archivo}`, "exito");
                Renderizador.activarAnimacionExito();

                // tambíen lo bajamos al dispositivo local del usuario
                const contenido = Estado.lista.join('\n');
                const blob = new Blob([contenido], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = data.archivo;
                document.body.appendChild(link);
                link.click();
                
                // limpio el bardo
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Error en la exportacion:", error);
            Renderizador.mostrarToast("Error: " + error.message, "error");
        } finally {
            // dejo el boton como estaba
            btnExportar.disabled = false;
            btnExportar.textContent = textoOriginal;
            actualizarInterfaz();
        }
    }

    // refresco toda la pantalla
    function actualizarInterfaz() {
        const stats = Estado.estadisticas();
        const cantidad = Estado.lista.length;

        Renderizador.actualizarContador(cantidad, Estado.MAX_NUMEROS);
        Renderizador.actualizarEstadisticas(stats);
        Renderizador.actualizarBotonExportar(
            Estado.puedeExportar(), 
            Estado.estaLlena()
        );

        // si no hay nada pongo el cartelito
        if (cantidad === 0) {
            Renderizador.mostrarEstadoVacio();
        } else {
            Renderizador.ocultarEstadoVacio();
        }
    }
});
