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
      const [rows] = await connection.execute('SELECT key_name, value FROM site_content');
      await connection.end();
      const content: Record<string, string> = {};
      (rows as any[]).forEach(r => { content[r.key_name] = r.value; });
      return res.status(200).json(content);
    }

    if (!verifyToken(req)) {
      await connection.end();
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'PUT') {
      const updates = req.body as Record<string, string>;
      for (const [key, value] of Object.entries(updates)) {
        await connection.execute(
          'INSERT INTO site_content (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
          [key, value, value]
        );
      }
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
