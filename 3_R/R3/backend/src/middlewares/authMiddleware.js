const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token requerido' });

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded; // { id, role_id }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

// Rol 1: Admin, Rol 2: Bibliotecario, Rol 3: Alumno
const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }
        
        if (!allowedRoles.includes(req.user.role_id)) {
            return res.status(403).json({ message: 'No tienes permisos suficientes (RBAC - Acceso Denegado)' });
        }
        
        next();
    };
};

module.exports = { verifyToken, verifyRole };
