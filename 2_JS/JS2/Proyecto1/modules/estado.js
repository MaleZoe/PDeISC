// aca guardo los numeros y hago las cuentas
// no toco el dom acá, es pura logica
export const Estado = {
    // el minimo que pide el profe para exportar
    MIN_NUMEROS: 10,
    // para que no explote pongo un maximo
    MAX_NUMEROS: 20,
    
    // aca guardo todo
    lista: [],

    // para meter un numero nuevo
    agregar(numero) {
        if (this.estaLlena()) {
            throw new Error("ya llenaste todo, borra algo si queres meter mas");
        }
        if (this.lista.includes(numero)) {
            throw new Error(`el ${numero} ya lo pusiste, no seas repetitivo`);
        }
        
        this.lista.push(numero);
        return true;
    },

    // para sacar uno si el usuario se arrepiente
    eliminar(indice) {
        if (indice < 0 || indice >= this.lista.length) return null;
        const eliminado = this.lista.splice(indice, 1);
        return eliminado[0];
    },

    // para corregir un numero que ya estaba
    actualizar(indice, nuevoValor) {
        if (indice < 0 || indice >= this.lista.length) return false;
        
        // valido que no este repetido en otra posicion
        if (this.lista.some((val, idx) => val === nuevoValor && idx !== indice)) {
            throw new Error(`el ${nuevoValor} ya lo pusiste antes`);
        }

        this.lista[indice] = nuevoValor;
        return true;
    },

    // borro todo a la mierda
    limpiar() {
        this.lista = [];
    },

    // chequeo si ya no entra mas nada
    estaLlena() {
        return this.lista.length >= this.MAX_NUMEROS;
    },

    // para saber si me dejan bajar el txt
    puedeExportar() {
        return this.lista.length >= this.MIN_NUMEROS;
    },

    // hago las cuentas de la facu
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
