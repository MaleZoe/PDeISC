-- ==============================================================================
-- TRABAJO PRÁCTICO: JUEGO DEL AHORCADO FULL STACK
-- Script SQL para creación de Base de Datos y Tabla de Puntuaciones
-- Base de datos solicitada: Score
-- Tabla solicitada: score
-- ==============================================================================

-- Explicación didáctica:
-- Creamos la base de datos 'Score' especificando la codificación utf8mb4 para garantizar
-- perfecta compatibilidad con acentos, caracteres especiales (como la Ñ) y emojis.
CREATE DATABASE IF NOT EXISTS Score
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Seleccionamos la base de datos recién creada o verificada
USE Score;

-- Explicación didáctica:
-- Estructura de la tabla 'score':
-- id: Identificador único autoincremental (Clave primaria).
-- nombre: Nombre del jugador (hasta 50 caracteres, obligatorio y sanitizado en Node).
-- puntos: Puntuación entera obtenida según fórmula (aciertos, errores, tiempo).
-- tiempo: Duración total de la partida en segundos (entero positivo).
-- fecha: Fecha y hora exacta en que finalizó y se registró la partida en el servidor.
CREATE TABLE IF NOT EXISTS score (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la partida registrada',
    nombre VARCHAR(50) NOT NULL COMMENT 'Nombre o apodo del jugador',
    puntos INT NOT NULL COMMENT 'Puntaje total calculado',
    tiempo INT NOT NULL COMMENT 'Tiempo transcurrido en segundos',
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp automático del registro'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabla de posiciones del Juego del Ahorcado';

-- Insertamos algunas puntuaciones de muestra (opcional, para visualización inicial del Top)
INSERT INTO score (nombre, puntos, tiempo, fecha) VALUES 
('Ada Lovelace', 1250, 25, CURRENT_TIMESTAMP - INTERVAL 4 DAY),
('Alan Turing', 1100, 32, CURRENT_TIMESTAMP - INTERVAL 3 DAY),
('Grace Hopper', 980, 40, CURRENT_TIMESTAMP - INTERVAL 2 DAY),
('Dennis Ritchie', 850, 45, CURRENT_TIMESTAMP - INTERVAL 1 DAY),
('Salvador (Profesor/Estudiante)', 1300, 22, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE id=id;
