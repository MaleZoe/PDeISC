window.Almacenamiento = (() => {
    
    // Array donde se guardan los productos en memoria
    let catalogoProductos = [];

    // Método 1: Agrega al final del array
    function agregarConPush(producto) {
        catalogoProductos.push(producto);
    }

    // Método 2: Agrega al inicio del array
    function agregarConUnshift(producto) {
        catalogoProductos.unshift(producto);
    }

    // Método 3: Crea un nuevo array concatenando el producto al final
    function agregarConConcat(producto) {
        catalogoProductos = catalogoProductos.concat([producto]);
    }

    // Método 4: Crea un nuevo array usando spread operator
    function agregarConSpread(producto) {
        catalogoProductos = [...catalogoProductos, producto];
    }

    // Función principal para insertar un producto en el array según el método elegido
    function agregar(producto, metodo, posicion) {
        producto.id = Date.now().toString() + Math.random().toString(36).slice(2);
        producto.metodoAlmacenamiento = metodo;

        switch (metodo) {
            case 'push':
                agregarConPush(producto);
                break;
            case 'unshift':
                agregarConUnshift(producto);
                break;
            case 'concat':
                agregarConConcat(producto);
                break;
            case 'spread':
                agregarConSpread(producto);
                break;
            default:
                agregarConPush(producto);
        }

        producto.posicionFinal = catalogoProductos.indexOf(producto);
    }

    // Retorna una copia de los productos registrados
    function obtenerCatalogo() {
        return [...catalogoProductos];
    }

    // Elimina un producto por su identificador único
    function eliminarProducto(id) {
        const indice = catalogoProductos.findIndex(p => p.id === id);
        if (indice !== -1) {
            catalogoProductos.splice(indice, 1);
            
            // Actualizamos la posición final guardada en cada objeto
            catalogoProductos.forEach((p, idx) => {
                p.posicionFinal = idx;
            });
        }
    }

    function vaciarCatalogo() {
        catalogoProductos = [];
    }

    // Retorna el total de registros
    function obtenerTotal() {
        return catalogoProductos.length;
    }

    return {
        agregar,
        obtenerCatalogo,
        eliminarProducto,
        vaciarCatalogo,
        obtenerTotal
    };
})();

