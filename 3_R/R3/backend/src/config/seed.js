const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function seedUsers() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const pwdAdmin = await bcrypt.hash('admin123', 10);
        const pwdBiblio = await bcrypt.hash('juan123', 10);
        const pwdAlumno = await bcrypt.hash('pedro123', 10);

        await connection.query(`
            INSERT INTO users (id, name, email, password, role_id) VALUES 
            (1, 'Admin Supremo', 'admin@biblio.com', ?, 1),
            (2, 'Bibliotecario Juan', 'juan@biblio.com', ?, 2),
            (3, 'Alumno Pedro', 'pedro@biblio.com', ?, 3)
            ON DUPLICATE KEY UPDATE password=VALUES(password)
        `, [pwdAdmin, pwdBiblio, pwdAlumno]);

        console.log('Usuarios de prueba actualizados:');
        console.log('1. admin@biblio.com / admin123 (Admin)');
        console.log('2. juan@biblio.com / juan123 (Biblio)');
        console.log('3. pedro@biblio.com / pedro123 (Alumno)');

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
seedUsers();
