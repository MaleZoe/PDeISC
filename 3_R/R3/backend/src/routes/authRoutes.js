const express = require('express');
const { register, login, getAllUsers, updateRole, deleteUser } = require('../controllers/authController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// User management for Admin
router.get('/users', verifyToken, verifyRole([1]), getAllUsers);
router.put('/users/:id/role', verifyToken, verifyRole([1]), updateRole);
router.delete('/users/:id', verifyToken, verifyRole([1]), deleteUser);

module.exports = router;
