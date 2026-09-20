const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'El usuario ya existe' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Todos los nuevos registros públicos son por defecto Alumnos (Rol 3)
        // El administrador original debe autorizar elevación de privilegios
        const roleToAssign = 3; 

        await db.query('INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)', 
            [name, email, hashedPassword, roleToAssign]);
        
        res.status(201).json({ message: 'Usuario registrado exitosamente como Alumno' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query(`
            SELECT users.*, roles.name as role_name 
            FROM users 
            JOIN roles ON users.role_id = roles.id 
            WHERE email = ?
        `, [email]);

        if (users.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });

        const token = jwt.sign(
            { id: user.id, role_id: user.role_id, role_name: user.role_name }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role_id: user.role_id,
                role_name: user.role_name
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT users.id, users.name, users.email, users.role_id, roles.name as role_name 
            FROM users 
            JOIN roles ON users.role_id = roles.id
        `);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo usuarios' });
    }
};

const updateRole = async (req, res) => {
    const { id } = req.params;
    const { role_id } = req.body;
    try {
        // Prevenir cambiar el rol del Admin Supremo (id: 4 o email 'malebiblio@com')
        const [targetUser] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        if (targetUser.length > 0 && targetUser[0].email === 'malebiblio@com') {
            return res.status(403).json({ message: 'No se puede modificar el rol del Administrador Supremo' });
        }

        await db.query('UPDATE users SET role_id = ? WHERE id = ?', [role_id, id]);
        res.json({ message: 'Rol actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error actualizando rol' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const [targetUser] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        if (targetUser.length > 0 && targetUser[0].email === 'malebiblio@com') {
            return res.status(403).json({ message: 'No se puede eliminar al Administrador Supremo' });
        }

        // Primero eliminar sus prestamos por clave foranea
        await db.query('DELETE FROM loans WHERE user_id = ?', [id]);
        // Luego eliminar al usuario
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error eliminando usuario' });
    }
};

module.exports = { register, login, getAllUsers, updateRole, deleteUser };
