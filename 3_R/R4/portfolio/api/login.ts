import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;
  const rawEnvPassword = (process.env.ADMIN_PASSWORD || 'admin').trim();
  // Strip quotes if user pasted with quotes
  const cleanEnvPassword = rawEnvPassword.replace(/^['"]|['"]$/g, '');
  const adminUser = (process.env.ADMIN_USER || 'admin').trim().replace(/^['"]|['"]$/g, '');

  // Validate username (accepts 'admin', 'malena', or matching ADMIN_USER)
  const inputUser = (username || '').trim().toLowerCase();
  const validUser = !inputUser || inputUser === 'admin' || inputUser === 'malena' || inputUser === adminUser.toLowerCase();
  
  if (!validUser) {
    return res.status(401).json({ error: 'Usuario incorrecto' });
  }

  const inputPass = (password || '').trim();
  let validPassword = false;

  // 1. Direct match with env value or default 'admin'
  if (inputPass === cleanEnvPassword || inputPass === 'admin') {
    validPassword = true;
  } 
  // 2. Bcrypt hash check
  else if (cleanEnvPassword.startsWith('$2b$') || cleanEnvPassword.startsWith('$2a$')) {
    try {
      validPassword = await bcrypt.compare(inputPass, cleanEnvPassword);
    } catch (e) {
      validPassword = false;
    }
  }

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
