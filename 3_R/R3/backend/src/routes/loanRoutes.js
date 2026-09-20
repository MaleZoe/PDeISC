const express = require('express');
const { getLoans, createLoan, updateLoanStatus, deleteLoan } = require('../controllers/loanController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const router = express.Router();

// Todos los autenticados pueden ver préstamos (lógica en el controller filtra por rol)
router.get('/', verifyToken, getLoans);

// Alumnos(3) y otros pueden solicitar préstamos
router.post('/', verifyToken, verifyRole([1, 2, 3]), createLoan);

// Solo Admin(1) y Bibliotecario(2) pueden cambiar estado
router.put('/:id', verifyToken, verifyRole([1, 2]), updateLoanStatus);

// Todos pueden eliminar sus propios registros (Admin/Biblio pueden eliminar cualquiera)
router.delete('/:id', verifyToken, deleteLoan);

module.exports = router;
