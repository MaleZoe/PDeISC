import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
