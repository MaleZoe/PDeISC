const express = require('express');
const { getBooks, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const router = express.Router();

// Todos los autenticados pueden ver el catálogo (Admin: 1, Biblio: 2, Alumno: 3)
router.get('/', verifyToken, getBooks);

// Solo Admin puede crear, actualizar o eliminar libros (Rol 1)
router.post('/', verifyToken, verifyRole([1]), createBook);
router.put('/:id', verifyToken, verifyRole([1]), updateBook);
router.delete('/:id', verifyToken, verifyRole([1]), deleteBook);

module.exports = router;
