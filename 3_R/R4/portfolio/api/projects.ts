import type { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

async function getConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is missing');
  }
  return mysql.createConnection(process.env.DATABASE_URL as string);
}

function verifyToken(req: VercelRequest) {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const connection = await getConnection();

    if (req.method === 'GET') {
      const [rows] = await connection.execute('SELECT * FROM projects');
      await connection.end();
      // Parse tech string to array
      const projects = (rows as any[]).map(r => ({
        ...r,
        tech: typeof r.tech === 'string' ? JSON.parse(r.tech) : r.tech
      }));
      return res.status(200).json(projects);
    }

    // Protect writing routes
    if (!verifyToken(req)) {
      await connection.end();
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
      const { id, title, description, tech, link, github, imageUrl } = req.body;
      const techJson = JSON.stringify(tech || []);
      await connection.execute(
        'INSERT INTO projects (id, title, description, tech, link, github, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, title, description, techJson, link || null, github || null, imageUrl || null]
      );
      await connection.end();
      return res.status(201).json({ success: true });
    }

    if (req.method === 'PUT') {
      const { id, title, description, tech, link, github, imageUrl } = req.body;
      const techJson = JSON.stringify(tech || []);
      await connection.execute(
        'UPDATE projects SET title=?, description=?, tech=?, link=?, github=?, imageUrl=? WHERE id=?',
        [title, description, techJson, link || null, github || null, imageUrl || null, id]
      );
      await connection.end();
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await connection.execute('DELETE FROM projects WHERE id=?', [id]);
      await connection.end();
      return res.status(200).json({ success: true });
    }

    await connection.end();
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
