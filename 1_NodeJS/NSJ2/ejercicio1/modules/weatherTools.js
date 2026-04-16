/**
 * weatherTools.js
 * Este módulo contiene herramientas matemáticas para cálculos meteorológicos.
 */

/**
 * Convierte grados Celsius a Fahrenheit.
 * @param {number} c - Temp en C.
 * @returns {number} - Temp en F.
 */
const celsiusToFahrenheit = (c) => {
    return (c * 9/5) + 32;
};

/**
 * Calcula la sensación térmica (Wind Chill).
 * Fórmula: 13.12 + 0.6215T - 11.37(V^0.16) + 0.3965T(V^0.16)
 * @param {number} temp - Temperatura en Celsius.
 * @param {number} speed - Velocidad del viento en km/h.
 * @returns {number} - Sensación térmica calculada.
 */
const calculateWindChill = (temp, speed) => {
    // Solo es válido para temperaturas <= 10°C y vientos > 4.8 km/h
    if (temp <= 10 && speed > 4.8) {
        const vPow = Math.pow(speed, 0.16);
        return 13.12 + (0.6215 * temp) - (11.37 * vPow) + (0.3965 * temp * vPow);
    }
    return temp; // Si no aplica, devolvemos la temp original
};

module.exports = {
    celsiusToFahrenheit,
    calculateWindChill
};