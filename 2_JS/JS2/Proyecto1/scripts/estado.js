/* 
 * MÓDULO DE ESTADO - GESTIÓN DE DATOS
 * Centraliza la lista de números y realiza cálculos matemáticos.
 * No tiene acceso al DOM.
 */

window.Estado = {
    // Límite mínimo requerido para habilitar la exportación
    MIN_NUMEROS: 10,
    // Límite máximo de elementos permitidos en la colección
    MAX_NUMEROS: 20,
    
    // Almacenamiento volátil de los números ingresados
    lista: [],

    // Agrega un número a la lista verificando duplicados y capacidad máxima
    agregar(numero) {
        if (this.estaLlena()) {
            throw new Error("Se ha alcanzado el límite máximo de 20 números.");
        }
        if (this.lista.includes(numero)) {
            throw new Error(`El número ${numero} ya está en la lista.`);
        }
        
        this.lista.push(numero);
        return true;
    },

    // Elimina un número por su posición en el array
    eliminar(indice) {
        if (indice < 0 || indice >= this.lista.length) return null;
        const eliminado = this.lista.splice(indice, 1);
        return eliminado[0];
    },

    // Vacía completamente la colección de números
    limpiar() {
        this.lista = [];
    },

    // Verifica si la lista ha llegado al tope de su capacidad
    estaLlena() {
        return this.lista.length >= this.MAX_NUMEROS;
    },

    // Determina si se cumplen los requisitos mínimos para exportar a .txt
    puedeExportar() {
        return this.lista.length >= this.MIN_NUMEROS;
    },

    // Realiza el procesamiento matemático de la colección actual
    estadisticas() {
        if (this.lista.length === 0) {
            return { promedio: 0, minimo: 0, maximo: 0, suma: 0, cantidad: 0 };
        }

        const cantidad = this.lista.length;
        const suma = this.lista.reduce((acc, val) => acc + val, 0);
        const promedio = (suma / cantidad).toFixed(2);
        const minimo = Math.min(...this.lista);
        const maximo = Math.max(...this.lista);

        return {
            promedio,
            minimo,
            maximo,
            suma,
            cantidad
        };
    }
};
