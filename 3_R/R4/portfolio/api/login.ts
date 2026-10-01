import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;
  const adminPasswordHash = process.env.ADMIN_PASSWORD || '';
  const adminUser = process.env.ADMIN_USER || 'admin';

  // Validate username
  const validUser = !username || username.toLowerCase() === adminUser.toLowerCase();
  if (!validUser) {
    return res.status(401).json({ error: 'Usuario incorrecto' });
  }

  // Compare password against bcrypt hash
  const validPassword = await bcrypt.compare(password || '', adminPasswordHash);
  if (!validPassword) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  const token = jwt.sign(
    { admin: true, user: username || 'admin' },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
  return res.status(200).json({ token });
}
