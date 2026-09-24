const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
    try {
        // Connect without database selected to create it if it doesn't exist
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        console.log('Conectado a MySQL (XAMPP). Creando base de datos y tablas...');

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        await connection.query(`USE \`${process.env.DB_NAME}\`;`);

        // Create Roles Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(50) NOT NULL UNIQUE
            );
        `);

        // Insert Default Roles
        await connection.query(`
            INSERT IGNORE INTO roles (id, name) VALUES 
            (1, 'Admin'), 
            (2, 'Bibliotecario'), 
            (3, 'Alumno');
        `);

        // Create Users Table (3NF - role_id is FK)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role_id INT NOT NULL,
                FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
            );
        `);

        // Create Books Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS books (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                stock INT NOT NULL DEFAULT 1
            );
        `);

        // Create Loans Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS loans (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                book_id INT NOT NULL,
                status ENUM('PENDING', 'ACTIVE', 'RETURNED') DEFAULT 'PENDING',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
            );
        `);

        console.log('Base de datos inicializada correctamente con 3FN.');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error inicializando BBDD:', error);
        process.exit(1);
    }
}

initDB();
