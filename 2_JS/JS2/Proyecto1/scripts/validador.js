/* 
 * MÓDULO DE VALIDACIÓN - LÓGICA PURA
 * Se encarga de limpiar y verificar que los datos de entrada sean correctos.
 * No tiene acceso al DOM.
 */

window.Validador = {
    
    // Valida exhaustivamente la entrada del usuario antes de procesarla
    validarEntrada(valor) {
        const entradaLimpia = valor.trim();

        // Caso: Campo vacío
        if (entradaLimpia === "") {
            return { valido: false, error: "El campo no puede estar vacío.", numero: null };
        }

        const numero = parseFloat(entradaLimpia);

        // Caso: No es un número o es infinito
        if (isNaN(numero) || !isFinite(numero)) {
            return { valido: false, error: "Ingresa un valor numérico real.", numero: null };
        }

        // Caso: Excede los límites permitidos del laboratorio
        if (numero < -999999 || numero > 999999) {
            return { valido: false, error: "El número debe estar entre -999,999 y 999,999.", numero: null };
        }

        return { valido: true, error: null, numero: numero };
    },

    // Devuelve una representación legible del número con hasta 2 decimales
    formatearNumero(n) {
        if (Number.isInteger(n)) {
            return n.toString();
        }
        // Eliminamos ceros innecesarios al final
        return parseFloat(n.toFixed(2)).toString();
    }
};
