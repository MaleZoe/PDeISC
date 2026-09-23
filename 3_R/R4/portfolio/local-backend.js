import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

async function getConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is missing');
  }
  return mysql.createConnection(process.env.DATABASE_URL);
}

function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return true;
  } catch (e) {
    return false;
  }
}

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign(
      { admin: true },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    return res.status(200).json({ token });
  }
  return res.status(401).json({ error: 'Contraseña incorrecta' });
});

app.get('/api/projects', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM projects');
    await connection.end();
    const projects = rows.map(r => ({
      ...r,
      tech: typeof r.tech === 'string' ? JSON.parse(r.tech) : r.tech
    }));
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const connection = await getConnection();
    const { id, title, description, tech, link, github, imageUrl } = req.body;
    const techJson = JSON.stringify(tech || []);
    await connection.execute(
      'INSERT INTO projects (id, title, description, tech, link, github, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, title, description, techJson, link || null, github || null, imageUrl || null]
    );
    await connection.end();
    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects', async (req, res) => {
  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const connection = await getConnection();
    const { id, title, description, tech, link, github, imageUrl } = req.body;
    const techJson = JSON.stringify(tech || []);
    await connection.execute(
      'UPDATE projects SET title=?, description=?, tech=?, link=?, github=?, imageUrl=? WHERE id=?',
      [title, description, techJson, link || null, github || null, imageUrl || null, id]
    );
    await connection.end();
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects', async (req, res) => {
  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const connection = await getConnection();
    const { id } = req.query;
    await connection.execute('DELETE FROM projects WHERE id=?', [id]);
    await connection.end();
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Local backend running on http://localhost:3001');
});
