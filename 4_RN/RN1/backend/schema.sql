-- ============================================================
-- Base de Datos para Sistema de Login RN1
-- Compatible con MySQL (XAMPP / WAMP / LAMP / MySQL Server)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `sistema_login` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sistema_login`;

-- Tabla de Usuarios
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `rol` VARCHAR(50) DEFAULT 'Usuario',
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Registros de prueba
-- Nota: Para contraseñas en producción se recomienda hash (password_hash / bcrypt)
INSERT INTO `usuarios` (`usuario`, `email`, `password`, `nombre`, `rol`) VALUES
('admin', 'admin@ejemplo.com', 'admin123', 'Juan Pérez', 'Administrador'),
('maria', 'maria@ejemplo.com', '123456', 'María Gómez', 'Desarrolladora'),
('carlos', 'carlos@ejemplo.com', 'secret123', 'Carlos Rodríguez', 'Analista');
