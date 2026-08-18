/**
 * Archivo: server.js
 * Propósito: Define la lógica y funcionalidad asociada a server.
 */

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Obtener el historial de partidas
app.get('/api/partidas', (req, res) => {
    const sql = 'SELECT * FROM partidas ORDER BY fecha DESC LIMIT 15';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error interno del servidor al obtener partidas.' });
        }
        res.json(rows);
    });
});

// Guardar una nueva partida terminada
app.post('/api/partidas', (req, res) => {
    const { ganador, total_movimientos } = req.body;
    
    // Validación de entrada
    if (!ganador || typeof total_movimientos !== 'number') {
        return res.status(400).json({ error: 'Datos de partida inválidos.' });
    }

    const sql = 'INSERT INTO partidas (ganador, total_movimientos) VALUES (?, ?)';
    db.run(sql, [ganador, total_movimientos], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error interno al guardar la partida.' });
        }
        res.status(201).json({ id: this.lastID, ganador, total_movimientos });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
