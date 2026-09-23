import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    const token = jwt.sign(
      { admin: true },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    return res.status(200).json({ token });
  }

  return res.status(401).json({ error: 'Contraseña incorrecta' });
}
