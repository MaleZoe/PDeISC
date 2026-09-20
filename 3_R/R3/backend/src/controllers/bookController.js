const db = require('../config/db');

// Obtener todos los libros (Todos pueden)
const getBooks = async (req, res) => {
    try {
        const [books] = await db.query('SELECT * FROM books');
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo libros' });
    }
};

// Agregar un libro (Solo Admin - Rol 1)
const createBook = async (req, res) => {
    const { title, author, stock } = req.body;
    try {
        await db.query('INSERT INTO books (title, author, stock) VALUES (?, ?, ?)', [title, author, stock || 1]);
        res.status(201).json({ message: 'Libro agregado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error agregando libro' });
    }
};

// Eliminar un libro (Solo Admin - Rol 1)
const deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM books WHERE id = ?', [id]);
        res.json({ message: 'Libro eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error eliminando libro' });
    }
};

// Actualizar un libro (Solo Admin - Rol 1)
const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, stock } = req.body;
    try {
        await db.query('UPDATE books SET title = ?, author = ?, stock = ? WHERE id = ?', [title, author, stock, id]);
        res.json({ message: 'Libro actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error actualizando libro' });
    }
};

module.exports = { getBooks, createBook, updateBook, deleteBook };
