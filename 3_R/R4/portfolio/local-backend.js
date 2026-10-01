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
  return mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true }
  });
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

// ── Auth ────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
  const adminUser = process.env.ADMIN_USER || 'admin';

  const validUser = !username || username.toLowerCase() === adminUser.toLowerCase() || username.toLowerCase() === 'malena';

  if (validUser && password === adminPassword) {
    const token = jwt.sign(
      { admin: true, user: username || 'admin' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    return res.status(200).json({ token });
  }

  if (!validUser) {
    return res.status(401).json({ error: 'Usuario incorrecto' });
  }

  return res.status(401).json({ error: 'Contraseña incorrecta' });
});

// ── Projects ────────────────────────────────────────────────────
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

// ── Site Content (Hero, About, Stats) ───────────────────────────
app.get('/api/content', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT key_name, value FROM site_content');
    await connection.end();
    const content = {};
    rows.forEach(r => { content[r.key_name] = r.value; });
    return res.status(200).json(content);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/content', async (req, res) => {
  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const connection = await getConnection();
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      await connection.execute(
        'INSERT INTO site_content (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
        [key, value, value]
      );
    }
    await connection.end();
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ── Certificates ────────────────────────────────────────────────
app.get('/api/certificates', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM certificates ORDER BY sort_order ASC');
    await connection.end();
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/certificates', async (req, res) => {
  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const connection = await getConnection();
    const { id, year, platform, platform_color, title, description, url, featured, sort_order } = req.body;
    await connection.execute(
      'INSERT INTO certificates (id, year, platform, platform_color, title, description, url, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, year, platform, platform_color || '#c8903a', title, description, url || null, featured ? 1 : 0, sort_order || 0]
    );
    await connection.end();
    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/certificates', async (req, res) => {
  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const connection = await getConnection();
    const { id, year, platform, platform_color, title, description, url, featured, sort_order } = req.body;
    await connection.execute(
      'UPDATE certificates SET year=?, platform=?, platform_color=?, title=?, description=?, url=?, featured=?, sort_order=? WHERE id=?',
      [year, platform, platform_color || '#c8903a', title, description, url || null, featured ? 1 : 0, sort_order || 0, id]
    );
    await connection.end();
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/api/certificates', async (req, res) => {
  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const connection = await getConnection();
    const { id } = req.query;
    await connection.execute('DELETE FROM certificates WHERE id=?', [id]);
    await connection.end();
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ── Skills ──────────────────────────────────────────────────────
app.get('/api/skills', async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM skills ORDER BY category, sort_order ASC');
    await connection.end();
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/skills', async (req, res) => {
  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const connection = await getConnection();
    const { id, category, name, icon_key, sort_order } = req.body;
    await connection.execute(
      'INSERT INTO skills (id, category, name, icon_key, sort_order) VALUES (?, ?, ?, ?, ?)',
      [id, category, name, icon_key || null, sort_order || 0]
    );
    await connection.end();
    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/skills', async (req, res) => {
  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const connection = await getConnection();
    const { id, category, name, icon_key, sort_order } = req.body;
    await connection.execute(
      'UPDATE skills SET category=?, name=?, icon_key=?, sort_order=? WHERE id=?',
      [category, name, icon_key || null, sort_order || 0, id]
    );
    await connection.end();
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/api/skills', async (req, res) => {
  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const connection = await getConnection();
    const { id } = req.query;
    await connection.execute('DELETE FROM skills WHERE id=?', [id]);
    await connection.end();
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Local backend running on http://localhost:3001');
});
