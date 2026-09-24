const mysql = require('mysql2/promise');
require('dotenv').config();
async function run() {
    const c = await mysql.createConnection({
        host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME
    });
    await c.query("ALTER TABLE loans MODIFY status ENUM('PENDING', 'ACTIVE', 'RETURNED', 'REJECTED') DEFAULT 'PENDING'");
    await c.end();
}
run();
