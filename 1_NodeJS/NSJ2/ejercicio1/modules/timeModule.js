/**
 * timeModule.js
 * Este módulo devuelve la fecha y hora actuales del servidor.
 */

/**
 * Devuelve la fecha y hora actuales formateadas.
 * @returns {string} 
 */
const getCurrentServerTime = () => {
    const now = new Date();
    return now.toLocaleString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

module.exports = {
    getCurrentServerTime
};