import type { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

async function getConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is missing');
  }
  return mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true }
  });
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
      const [rows] = await connection.execute('SELECT * FROM skills ORDER BY category, sort_order ASC');
      await connection.end();
      return res.status(200).json(rows);
    }

    if (!verifyToken(req)) {
      await connection.end();
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
      const { id, category, name, icon_key, sort_order } = req.body;
      await connection.execute(
        'INSERT INTO skills (id, category, name, icon_key, sort_order) VALUES (?, ?, ?, ?, ?)',
        [id, category, name, icon_key || null, sort_order || 0]
      );
      await connection.end();
      return res.status(201).json({ success: true });
    }

    if (req.method === 'PUT') {
      const { id, category, name, icon_key, sort_order } = req.body;
      await connection.execute(
        'UPDATE skills SET category=?, name=?, icon_key=?, sort_order=? WHERE id=?',
        [category, name, icon_key || null, sort_order || 0, id]
      );
      await connection.end();
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await connection.execute('DELETE FROM skills WHERE id=?', [id]);
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
