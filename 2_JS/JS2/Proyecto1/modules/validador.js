// aca me fijo que no me manden fruta en el input
// es pura logica, nada de dom
export const Validador = {
    
    // para ver si lo que escribieron sirve
    validarEntrada(valor) {
        const entradaLimpia = valor.trim();

        // si no escribieron nada los saco cagando
        if (entradaLimpia === "") {
            return { valido: false, error: "pone algo nene, no esta vacio esto", numero: null };
        }

        const numero = parseFloat(entradaLimpia);

        // si mandan letras o cosas raras
        if (isNaN(numero) || !isFinite(numero)) {
            return { valido: false, error: "eso no es un numero, no te hagas el vivo", numero: null };
        }

        // limites para que no se rompa todo
        if (numero < -999999 || numero > 999999) {
            return { valido: false, error: "te pasaste de rosca, pone uno mas chico", numero: null };
        }

        return { valido: true, error: null, numero: numero };
    },

    // para que quede lindo con decimales
    formatearNumero(n) {
        if (Number.isInteger(n)) {
            return n.toString();
        }
        // maximo dos decimales para que no sea un choclo
        return parseFloat(n.toFixed(2)).toString();
    }
};
