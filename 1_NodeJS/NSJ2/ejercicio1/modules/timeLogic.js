

/**
 * Devuelve la fecha y hora actuales como una cadena.
 * @returns {string} - La fecha y hora actuales.
 */
const getCurrentDateTime = () => {
    const now = new Date();
    
    // Devolver una cadena de fecha y hora legible para humanos
    return now.toLocaleString();
};

// Exportar la función para ser utilizada en otros lugares
module.exports = {
    getCurrentDateTime
};