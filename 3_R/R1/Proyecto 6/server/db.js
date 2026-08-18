/**
 * Archivo: db.js
 * Propósito: Define la lógica y funcionalidad asociada a db.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'tic_tac_toe.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Crear tabla de partidas si no existe
        db.run(`CREATE TABLE IF NOT EXISTS partidas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ganador TEXT NOT NULL,
            total_movimientos INTEGER NOT NULL,
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

module.exports = db;
