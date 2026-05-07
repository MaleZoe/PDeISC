
window.Catalogo = (() => {

    const grid = document.getElementById('gridProductos');
    const estadoVacio = document.getElementById('estadoVacio');
    const textoContador = document.getElementById('textoContador');

    function renderizar(vehiculos = window.Almacenamiento.obtenerCatalogo()) {
        if (!grid) return;

        grid.innerHTML = '';
        
        if (vehiculos.length === 0) {
            estadoVacio.classList.remove('d-none');
            textoContador.textContent = 'Mostrando 0 unidades';
            return;
        }

        estadoVacio.classList.add('d-none');
        textoContador.textContent = `Mostrando ${vehiculos.length} unidades`;

        vehiculos.forEach(vehiculo => {
            const card = crearTarjetaVehiculo(vehiculo);
            grid.appendChild(card);
        });
    }

    function crearTarjetaVehiculo(v) {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4 tarjeta-entrada';

        col.innerHTML = `
            <div class="tarjeta-producto h-100 p-4 shadow-sm border border-white border-opacity-10 rounded-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <span class="badge bg-dark bg-opacity-50 text-white border border-white border-opacity-10 rounded-pill px-3 py-2">
                        ${v.stock.toUpperCase()}
                    </span>
                    <span class="badge ${v.condicion === 'Nuevo' ? 'bg-success' : 'bg-primary'} rounded-pill">
                        ${v.condicion}
                    </span>
                </div>
                
                <h3 class="h4 fw-bold mb-1">${v.marca} ${v.nombre}</h3>
                <div class="d-flex gap-2 mb-3 small text-white text-opacity-75">
                    <span>Año: ${v.anio}</span>
                    <span>•</span>
                    <span>Color: ${v.color}</span>
                </div>

                <div class="p-3 mb-4 rounded-3" style="background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.05);">
                    <div class="d-flex justify-content-between mb-2">
                        <span class="small text-white-50">Combustible</span>
                        <span class="fw-medium text-white">${v.categoria}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span class="small text-white-50">Kilometraje</span>
                        <span class="fw-medium text-white">${v.precio.toLocaleString()} km</span>
                    </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-white border-opacity-10">
                    <div>
                        <span class="small text-white text-opacity-50 d-block">Precio</span>
                        <span class="h4 fw-bold text-success m-0">U$S ${parseInt(v.imagen).toLocaleString()}</span>
                    </div>
                    <button class="btn btn-outline-danger btn-sm border-0 bg-danger bg-opacity-10" onclick="window.App.eliminar('${v.id}')">
                        Borrar
                    </button>
                </div>
            </div>
        `;
        return col;
    }

    function aplicarFiltros() {
        const busqueda = document.getElementById('filtro-busqueda').value.toLowerCase();
        const categoria = document.getElementById('filtro-categoria').value;
        const orden = document.getElementById('filtro-orden').value;

        let filtrados = window.Almacenamiento.obtenerCatalogo().filter(v => {
            const matchBusqueda = v.marca.toLowerCase().includes(busqueda) || 
                                 v.nombre.toLowerCase().includes(busqueda) || 
                                 v.stock.toLowerCase().includes(busqueda);
            const matchCat = categoria === 'Todas' || v.categoria === categoria;
            return matchBusqueda && matchCat;
        });

        // Ordenar
        if (orden === 'az') {
            filtrados.sort((a, b) => a.marca.localeCompare(b.marca));
        } else if (orden === 'precio-asc') {
            filtrados.sort((a, b) => parseFloat(a.imagen) - parseFloat(b.imagen));
        } else if (orden === 'precio-desc') {
            filtrados.sort((a, b) => parseFloat(b.imagen) - parseFloat(a.imagen));
        } else {
            // Reciente: por defecto ya vienen en orden de inserción (o ID)
        }

        renderizar(filtrados);
    }

    return {
        renderizar,
        aplicarFiltros
    };

})();
