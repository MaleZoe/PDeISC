
window.App = (() => {

    let metodoActual = 'push';

    function inicializar() {
        const form = document.getElementById('formularioProducto');
        
        // Listeners para validación en tiempo real
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => window.Validador.validarCampo(input.id));
            input.addEventListener('input', () => {
                window.Validador.validarCampo(input.id);
                actualizarEstadoBoton();
            });
        });

        // Manejo de radios de condición
        const radiosCondicion = document.querySelectorAll('input[name="condicion"]');
        radiosCondicion.forEach(radio => {
            radio.addEventListener('change', (e) => {
                document.getElementById('inp-condicion').value = e.target.value;
            });
        });

        // Manejo de métodos de inserción
        const tarjetasMetodo = document.querySelectorAll('.tarjeta-metodo');
        tarjetasMetodo.forEach(tarjeta => {
            tarjeta.addEventListener('click', () => {
                metodoActual = tarjeta.dataset.metodo;
                actualizarUIMetodo();
            });
        });

        // Filtros
        document.getElementById('filtro-busqueda')?.addEventListener('input', debounce(() => window.Catalogo.aplicarFiltros(), 300));
        document.getElementById('filtro-categoria')?.addEventListener('change', () => window.Catalogo.aplicarFiltros());
        document.getElementById('filtro-orden')?.addEventListener('change', () => window.Catalogo.aplicarFiltros());

        const inpAnio = document.getElementById('inp-anio');
        if (inpAnio) {
            inpAnio.addEventListener('change', () => {
                window.Validador.validarCampo('inp-stock');
            });
        }

        // Lógica de Marcas y Modelos
        const inpMarca = document.getElementById('inp-marca');
        if (inpMarca) {
            inpMarca.addEventListener('change', manejarCambioMarca);
        }

        // Lógica de Kilómetros vs Condición
        const inpKms = document.getElementById('inp-precio');
        if (inpKms) {
            inpKms.addEventListener('input', validarCondicionSegunKms);
        }

        // Submit
        form.addEventListener('submit', manejarSubmit);
        form.addEventListener('reset', manejarReset);

        // UI inicial
        actualizarUIMetodo();
        window.Catalogo.renderizar();
    }

    function manejarSubmit(e) {
        e.preventDefault();
        
        if (!window.Validador.validarFormulario()) {
            mostrarBanner('error', 'Por favor, revisá los campos marcados.');
            return;
        }

        const vehiculo = {
            marca: document.getElementById('inp-marca').value,
            nombre: document.getElementById('inp-nombre').value,
            anio: document.getElementById('inp-anio').value,
            color: document.getElementById('inp-color').value,
            stock: document.getElementById('inp-stock').value, // Patente
            precio: parseFloat(document.getElementById('inp-precio').value), // Kms
            categoria: document.getElementById('inp-categoria').value, // Combustible
            imagen: document.getElementById('inp-imagen').value, // Precio USD
            condicion: document.getElementById('inp-condicion').value,
            descripcion: document.getElementById('inp-descripcion').value
        };

        const posicion = document.getElementById('inp-posicion').value;
        window.Almacenamiento.agregar(vehiculo, metodoActual, posicion);
        
        mostrarBanner('exito', 'Vehículo registrado correctamente.');
        e.target.reset();
        manejarReset();
        window.Catalogo.renderizar();
    }

    function manejarReset() {
        const form = document.getElementById('formularioProducto');
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => window.Validador.limpiarValidacion(input.id));
        
        // Reset de condición
        const radioNuevo = document.getElementById('cond-nuevo');
        const radioUsado = document.getElementById('cond-usado');
        if (radioNuevo && radioUsado) {
            radioNuevo.disabled = false;
            radioNuevo.parentElement.style.opacity = '1';
            radioUsado.disabled = false;
            radioUsado.parentElement.style.opacity = '1';
        }
        // Reset de modelos
        const selectModelo = document.getElementById('inp-nombre');
        if (selectModelo) {
            selectModelo.innerHTML = '<option value="" selected disabled>Seleccioná modelo...</option>';
            selectModelo.disabled = true;
        }
        
        actualizarEstadoBoton();
    }

    function actualizarEstadoBoton() {
        const btn = document.getElementById('btnAgregar');
        const form = document.getElementById('formularioProducto');
        const inputsObligatorios = form.querySelectorAll('[required]');
        
        let todoCompleto = true;
        inputsObligatorios.forEach(input => {
            if (!input.value.trim()) todoCompleto = false;
        });

        btn.disabled = !todoCompleto;
    }

    function actualizarUIMetodo() {
        document.querySelectorAll('.tarjeta-metodo').forEach(t => {
            t.classList.toggle('metodo-activo', t.dataset.metodo === metodoActual);
        });
        
        const badge = document.getElementById('metodoActivo');
        badge.textContent = `Método: ${metodoActual === 'indice' ? 'índice direct' : metodoActual + '()'}`;
        
        const wrapperPos = document.querySelector('.input-posicion-wrapper');
        wrapperPos.classList.toggle('d-none', metodoActual !== 'splice');
    }

    const MODELOS_POR_MARCA = {
        'Toyota': ['Corolla', 'Hilux', 'Etios', 'Yaris', 'SW4', 'RAV4', 'Camry', '86', 'Prius', 'Land Cruiser'],
        'Fiat': ['Cronos', 'Pulse', 'Toro', 'Mobi', 'Strada', 'Argo', '500', 'Fiorino', 'Ducato', 'Fastback'],
        'Volkswagen': ['Gol', 'Amarok', 'T-Cross', 'Taos', 'Polo', 'Virtus', 'Nivus', 'Vento', 'Tiguan', 'Saveiro'],
        'Renault': ['Sandero', 'Stepway', 'Logan', 'Kangoo', 'Oroch', 'Alaskan', 'Duster', 'Captur', 'Koleos', 'Kwid'],
        'Chevrolet': ['Onix', 'Tracker', 'Cruze', 'S10', 'Spin', 'Joy', 'Equinox', 'Trailblazer', 'Camaro', 'Montana'],
        'Ford': ['Ranger', 'Territory', 'Maverick', 'Bronco', 'Mustang', 'Kuga', 'Transit', 'F-150', 'EcoSport', 'Ka'],
        'Peugeot': ['208', '2008', '3008', '5008', 'Partner', 'Expert', 'Boxer', '308', '408', '508'],
        'Nissan': ['Frontier', 'Kicks', 'Versa', 'Sentra', 'X-Trail', 'Leaf', 'Murano', 'March', 'Note', 'Qashqai'],
        'Jeep': ['Renegade', 'Compass', 'Commander', 'Grand Cherokee', 'Wrangler', 'Gladiator', 'Patriot', 'Liberty', 'Cherokee', 'Wagoneer'],
        'Citroën': ['C3', 'C4 Cactus', 'C5 Aircross', 'Berlingo', 'Jumpy', 'Jumper', 'C3 Aircross', 'C4', 'C5', 'DS3']
    };

    function manejarCambioMarca(e) {
        const marca = e.target.value;
        const selectModelo = document.getElementById('inp-nombre');
        
        // Limpiar
        selectModelo.innerHTML = '<option value="" selected disabled>Seleccioná modelo...</option>';
        
        if (marca && MODELOS_POR_MARCA[marca]) {
            MODELOS_POR_MARCA[marca].forEach(modelo => {
                const opt = document.createElement('option');
                opt.value = modelo;
                opt.textContent = modelo;
                selectModelo.appendChild(opt);
            });
            selectModelo.disabled = false;
        } else {
            selectModelo.disabled = true;
        }
        
        // Validar el cambio
        window.Validador.validarCampo('inp-marca');
        window.Validador.limpiarValidacion('inp-nombre');
    }

    function validarCondicionSegunKms() {
        const kms = parseInt(document.getElementById('inp-precio').value) || 0;
        const radioNuevo = document.getElementById('cond-nuevo');
        const radioUsado = document.getElementById('cond-usado');
        const hiddenCond = document.getElementById('inp-condicion');

        if (kms > 0) {
            // Si tiene kms, debe ser usado obligatoriamente
            radioUsado.checked = true;
            radioUsado.disabled = false;
            radioUsado.parentElement.style.opacity = '1';
            
            radioNuevo.disabled = true;
            radioNuevo.parentElement.style.opacity = '0.5';
            radioNuevo.parentElement.title = 'Un vehículo con kilometraje no puede ser Nuevo';
            hiddenCond.value = 'Usado';
        } else {
            // Si es 0km, debe ser nuevo obligatoriamente
            radioNuevo.checked = true;
            radioNuevo.disabled = false;
            radioNuevo.parentElement.style.opacity = '1';

            radioUsado.disabled = true;
            radioUsado.parentElement.style.opacity = '0.5';
            radioUsado.parentElement.title = 'Un vehículo con 0km no puede ser Usado';
            hiddenCond.value = 'Nuevo';
        }
    }

    function mostrarBanner(tipo, mensaje) {
        const banner = document.getElementById('bannerFeedback');
        banner.className = `mt-4 p-3 rounded-3 d-flex align-items-center bg-white bg-opacity-10 border ${tipo === 'exito' ? 'border-success text-success' : 'border-danger text-danger'}`;
        banner.innerHTML = `
            <span class="me-2"></span>
            <span class="fw-medium">${mensaje}</span>
        `;
        banner.classList.remove('d-none');
        if (tipo === 'exito') setTimeout(() => banner.classList.add('d-none'), 3000);
    }

    function eliminar(id) {
        window.Almacenamiento.eliminarProducto(id);
        window.Catalogo.renderizar();
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    return { inicializar, eliminar };

})();

document.addEventListener('DOMContentLoaded', window.App.inicializar);
