// servidor del ejercicio 2 - post con formulario
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { usuarios } from './data/usuarios.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname));

// copio el array para poder agregarle usuarios en el ejercicio
let listaUsuarios = [...usuarios];
let nextId = listaUsuarios.length + 1;

// devuelvo todos los usuarios
app.get('/api/usuarios', (req, res) => {
    res.json(listaUsuarios);
});

// recibo un nuevo usuario y devuelvo el id generado
app.post('/api/usuarios', (req, res) => {
    const { nombre, email } = req.body;

    // valido los datos en el backend
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3 || /(.)\1{2,}/.test(nombre)) {
        return res.status(400).json({ ok: false, error: 'el nombre es obligatorio, debe tener al menos 3 caracteres y no más de 2 letras consecutivas iguales' });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ ok: false, error: 'el email no tiene un formato válido' });
    }

    // creo el nuevo usuario con el formato de la api
    const nuevo = {
        id: nextId++,
        nombre: nombre.trim(),
        "correo electrónico": email.trim()
    };

    listaUsuarios.push(nuevo);
    res.status(201).json({ ok: true, id: nuevo.id, usuario: nuevo });
});

// página del ejercicio 2
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'ejercicio2.html'));
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`ejercicio 2 corriendo en http://localhost:${PORT}`);
});
