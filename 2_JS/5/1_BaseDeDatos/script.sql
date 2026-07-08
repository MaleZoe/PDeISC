-- 1_BaseDeDatos/script.sql
-- Este script crea la base de datos y la tabla para el proyecto de alumnos

-- aca creo la base de datos
CREATE DATABASE IF NOT EXISTS alumnosDB;

-- aca selecciono la base de datos
USE alumnosDB;

-- aca creo la tabla de alumnos
CREATE TABLE IF NOT EXISTS alumnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    edad INT NOT NULL
);
