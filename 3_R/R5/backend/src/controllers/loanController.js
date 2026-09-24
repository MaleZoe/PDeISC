const db = require('../config/db');

// Obtener préstamos
// Si es Admin(1) o Biblio(2), ve todos. Si es Alumno(3), ve los suyos.
const getLoans = async (req, res) => {
    try {
        const { id, role_id } = req.user;
        let query = `
            SELECT loans.*, books.title as book_title, users.name as user_name 
            FROM loans 
            JOIN books ON loans.book_id = books.id 
            JOIN users ON loans.user_id = users.id
        `;
        let params = [];

        if (role_id === 3) {
            query += ' WHERE loans.user_id = ?';
            params.push(id);
        }

        const [loans] = await db.query(query, params);
        res.json(loans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo préstamos' });
    }
};

// Crear préstamo (Alumno solicita un libro)
const createLoan = async (req, res) => {
    const { book_id } = req.body;
    const user_id = req.user.id; // Del token

    try {
        // Verificar stock
        const [books] = await db.query('SELECT stock FROM books WHERE id = ?', [book_id]);
        if (books.length === 0 || books[0].stock <= 0) {
            return res.status(400).json({ message: 'Libro no disponible' });
        }

        await db.query('INSERT INTO loans (user_id, book_id, status) VALUES (?, ?, "PENDING")', [user_id, book_id]);
        // Bajar el stock (opcional, se puede hacer al aceptar el préstamo, lo haremos acá por simplicidad)
        await db.query('UPDATE books SET stock = stock - 1 WHERE id = ?', [book_id]);

        res.status(201).json({ message: 'Préstamo solicitado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error solicitando préstamo' });
    }
};

// Cambiar estado de préstamo (Solo Admin(1) o Biblio(2))
const updateLoanStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // PENDING, ACTIVE, RETURNED, REJECTED

    try {
        await db.query('UPDATE loans SET status = ? WHERE id = ?', [status, id]);
        
        // Si lo devuelve o lo rechaza, restaurar stock
        if (status === 'RETURNED' || status === 'REJECTED') {
            const [loan] = await db.query('SELECT book_id FROM loans WHERE id = ?', [id]);
            if (loan.length > 0) {
                await db.query('UPDATE books SET stock = stock + 1 WHERE id = ?', [loan[0].book_id]);
            }
        }
        
        res.json({ message: 'Estado del préstamo actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error actualizando préstamo' });
    }
};

// Eliminar un registro de préstamo
const deleteLoan = async (req, res) => {
    const { id: loanId } = req.params;
    const { id: userId, role_id } = req.user;

    try {
        // Verificar si el préstamo existe y pertenece al usuario (si es alumno)
        const [loan] = await db.query('SELECT user_id FROM loans WHERE id = ?', [loanId]);
        if (loan.length === 0) return res.status(404).json({ message: 'Préstamo no encontrado' });

        if (role_id === 3 && loan[0].user_id !== userId) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este registro' });
        }

        await db.query('DELETE FROM loans WHERE id = ?', [loanId]);
        res.json({ message: 'Registro eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error eliminando registro' });
    }
};

module.exports = { getLoans, createLoan, updateLoanStatus, deleteLoan };
