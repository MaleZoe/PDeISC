/**
 * uvIndex.js
 * Módulo para calcular el nivel de riesgo por radiación UV y recomendaciones de salud.
 * Utiliza los colores de la identidad visual de Telefe (RGB).
 */

/**
 * Retorna información de salud basada en la intensidad del índice UV.
 * @param {number} intensity - Valor numérico del índice UV (1 a 11+).
 * @returns {Object} - Objeto con nivel, recomendación y color Telefe.
 */
const getUVInfo = (intensity) => {
    let level = "";
    let recommendation = "";
    let color = ""; // Colores Telefe: Blue (#005595), Green (#00A650), Red (#ED1C24)

    if (intensity <= 2) {
        level = "Bajo";
        recommendation = "Puede permanecer en el exterior sin riesgo. Use gafas de sol si el día es brillante.";
        color = "#00A650"; // Verde Telefe
    } else if (intensity <= 5) {
        level = "Moderado";
        recommendation = "Use protector solar y permanezca en la sombra durante las horas centrales del día.";
        color = "#005595"; // Azul Telefe
    } else if (intensity <= 7) {
        level = "Alto";
        recommendation = "Reduzca el tiempo al sol entre las 11 a.m. y las 4 p.m. Use sombrero y ropa protectora.";
        color = "#ED1C24"; // Rojo Telefe
    } else if (intensity <= 10) {
        level = "Muy Alto";
        recommendation = "Es imprescindible usar protector solar SPF 30+, camisa, gafas y sombrero. Busque sombra.";
        color = "#ED1C24"; // Rojo Telefe (Riesgo severo)
    } else {
        level = "Extremo";
        recommendation = "Evite salir durante las horas centrales. La piel y los ojos sin protección pueden quemarse en minutos.";
        color = "#ED1C24"; // Rojo Telefe (Riesgo máximo)
    }

    return {
        level,
        recommendation,
        color
    };
};

module.exports = {
    getUVInfo
};