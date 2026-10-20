// backend/server.js
// API Backend en Node.js + Express + MySQL + Nodemailer (Gmail SMTP)

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const os = require('os');

// Función para obtener la IP de la red local (Wi-Fi/LAN) para que celulares puedan acceder
function getLocalIp() {
  const nets = os.networkInterfaces();
  // 1. Prioridad: interfaz con nombre Wi-Fi o Wireless o WLAN
  for (const name of Object.keys(nets)) {
    if (/wi-?fi|wlan|wireless/i.test(name)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) return net.address;
      }
    }
  }
  // 2. Otras interfaces que no sean virtuales ni host-only
  for (const name of Object.keys(nets)) {
    if (!/vmware|virtual|loopback|pseudo/i.test(name)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('192.168.56.')) {
          return net.address;
        }
      }
    }
  }
  return 'localhost';
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configuración de MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistema_login',
};

// Base de datos en memoria (con persistencia durante la ejecución)
const mockUsers = [
  { id: 1, usuario: 'admin', email: 'admin@ejemplo.com', password: 'admin123', nombre: 'Juan Pérez (Demo)', rol: 'Administrador' },
  { id: 2, usuario: 'maria', email: 'maria@ejemplo.com', password: '123456', nombre: 'María Gómez', rol: 'Desarrolladora' },
  { id: 3, usuario: 'salvi', email: 'salviamale08@gmail.com', password: 'admin', nombre: 'Salvia Male', rol: 'Administrador' },
];

// Almacén en memoria de tokens de restablecimiento activos: { token: { email, expires } }
const resetTokens = new Map();

// Transportador Nodemailer con Gmail SMTP del usuario
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'salviamale08@gmail.com',
    pass: 'wuhjgwtplkfrnqpa',
  },
});

// Endpoint POST /api/login
app.post('/api/login', async (req, res) => {
  const { usuario, email, password } = req.body;
  const usernameOrEmail = (usuario || email || '').trim();

  if (!usernameOrEmail || !password) {
    return res.status(400).json({
      success: false,
      message: 'Debe ingresar un usuario o correo y contraseña.',
    });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT id, usuario, email, password, nombre, rol FROM usuarios WHERE usuario = ? OR email = ?',
      [usernameOrEmail, usernameOrEmail]
    );
    await connection.end();

    if (rows.length > 0) {
      const user = rows[0];
      if (user.password !== password) {
        return res.json({
          success: false,
          message: 'Contraseña incorrecta.',
        });
      }

      return res.json({
        success: true,
        message: 'Acceso concedido',
        user: {
          id: user.id,
          usuario: user.usuario,
          email: user.email,
          nombre: user.nombre,
          rol: user.rol,
        },
      });
    }
  } catch (error) {
    console.warn('⚠️ Consulta MySQL en login no disponible, buscando en mockUsers:', error.message);
  }

  // Búsqueda en mockUsers
  const foundUser = mockUsers.find(
    (u) => (u.usuario.toLowerCase() === usernameOrEmail.toLowerCase() || u.email.toLowerCase() === usernameOrEmail.toLowerCase()) && u.password === password
  );

  if (foundUser) {
    return res.json({
      success: true,
      message: 'Acceso concedido',
      user: {
        id: foundUser.id,
        usuario: foundUser.usuario,
        email: foundUser.email,
        nombre: foundUser.nombre,
        rol: foundUser.rol,
      },
    });
  }

  return res.json({
    success: false,
    message: 'Credenciales inválidas. Revisa tu usuario y contraseña.',
  });
});

// Endpoint POST /api/register
app.post('/api/register', async (req, res) => {
  const { nombre, usuario, email, password } = req.body;

  if (!nombre || !usuario || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son obligatorios.',
    });
  }

  const cleanNombre = nombre.trim();
  const cleanUsuario = usuario.trim();
  const cleanEmail = email.trim().toLowerCase();

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [existing] = await connection.execute(
      'SELECT id FROM usuarios WHERE usuario = ? OR email = ?',
      [cleanUsuario, cleanEmail]
    );

    if (existing.length > 0) {
      await connection.end();
      return res.json({
        success: false,
        message: 'El nombre de usuario o correo electrónico ya se encuentra registrado.',
      });
    }

    const [result] = await connection.execute(
      'INSERT INTO usuarios (nombre, usuario, email, password, rol) VALUES (?, ?, ?, ?, ?)',
      [cleanNombre, cleanUsuario, cleanEmail, password, 'Usuario Registrado']
    );

    await connection.end();

    const newUser = {
      id: result.insertId,
      nombre: cleanNombre,
      usuario: cleanUsuario,
      email: cleanEmail,
      password: password,
      rol: 'Usuario Registrado',
    };

    mockUsers.push(newUser);

    return res.json({
      success: true,
      message: '¡Registro completado exitosamente!',
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        usuario: newUser.usuario,
        email: newUser.email,
        rol: newUser.rol,
      },
    });
  } catch (error) {
    console.warn('⚠️ Registro en MySQL falló, registrando en memoria:', error.message);

    const existsInMock = mockUsers.some(
      (u) => u.usuario.toLowerCase() === cleanUsuario.toLowerCase() || u.email.toLowerCase() === cleanEmail
    );

    if (existsInMock) {
      return res.json({
        success: false,
        message: 'El nombre de usuario o correo ya está en uso.',
      });
    }

    const newId = mockUsers.length + 1;
    const newUser = {
      id: newId,
      nombre: cleanNombre,
      usuario: cleanUsuario,
      email: cleanEmail,
      password: password,
      rol: 'Usuario Registrado',
    };

    mockUsers.push(newUser);

    return res.json({
      success: true,
      message: '¡Registro completado exitosamente!',
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        usuario: newUser.usuario,
        email: newUser.email,
        rol: newUser.rol,
      },
    });
  }
});

// Endpoint POST /api/forgot-password (Despacho real vía Gmail SMTP)
app.post('/api/forgot-password', async (req, res) => {
  const { usuario, email, appUrl } = req.body;
  const usernameOrEmail = (usuario || email || '').trim().toLowerCase();

  if (!usernameOrEmail) {
    return res.status(400).json({
      success: false,
      message: 'Por favor, ingresa tu correo electrónico o usuario.',
    });
  }

  let userFound = null;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT id, usuario, email, nombre FROM usuarios WHERE LOWER(usuario) = ? OR LOWER(email) = ?',
      [usernameOrEmail, usernameOrEmail]
    );
    await connection.end();

    if (rows.length > 0) {
      userFound = rows[0];
    }
  } catch (error) {
    console.warn('⚠️ Consulta MySQL falló en forgot-password, buscando en memoria:', error.message);
  }

  if (!userFound) {
    userFound = mockUsers.find(
      (u) => u.usuario.toLowerCase() === usernameOrEmail || u.email.toLowerCase() === usernameOrEmail
    );
  }

  if (!userFound && usernameOrEmail.includes('@')) {
    userFound = {
      nombre: usernameOrEmail.split('@')[0],
      usuario: usernameOrEmail.split('@')[0],
      email: usernameOrEmail,
    };
  }

  if (!userFound) {
    return res.json({
      success: false,
      message: 'No existe ningún usuario registrado con esos datos.',
    });
  }

  try {
    const token = 'tok_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    resetTokens.set(token, {
      email: userFound.email,
      usuario: userFound.usuario,
      expires: Date.now() + 3600000,
    });

    const localIp = getLocalIp();

    // Detectar puerto del frontend web (por defecto 8082 si no se indica)
    let clientPort = '8082';
    if (appUrl) {
      try {
        const parsed = new URL(appUrl);
        if (parsed.port) clientPort = parsed.port;
      } catch (e) {}
    }

    // Enlace para celular (utiliza la IP LAN de la PC en la red Wi-Fi; funciona en celular y PC)
    const mobileLink = `http://${localIp}:${clientPort}?resetToken=${token}&email=${encodeURIComponent(userFound.email)}`;
    // Enlace para la computadora
    const pcLink = `http://localhost:${clientPort}?resetToken=${token}&email=${encodeURIComponent(userFound.email)}`;

    const mailOptions = {
      from: '"SecureAuth Portal" <salviamale08@gmail.com>',
      to: userFound.email,
      subject: '🔑 Restablece tu contraseña - SecureAuth Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; background-color: #0F172A; color: #F8FAFC; padding: 32px; border-radius: 16px; border: 1px solid #334155;">
          <h2 style="color: #818CF8; margin-top: 0; font-size: 22px;">Restablecimiento de Contraseña</h2>
          <p style="font-size: 15px; color: #CBD5E1;">Hola <strong>${userFound.nombre}</strong>,</p>
          <p style="font-size: 14px; color: #94A3B8; line-height: 22px;">
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta (<strong>${userFound.email}</strong>).
          </p>
          <div style="margin: 28px 0; text-align: center;">
            <a href="${mobileLink}" style="background-color: #4F46E5; color: #FFFFFF; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px; display: inline-block;">
              📱 Restablecer desde mi Celular
            </a>
          </div>
          <div style="margin: 12px 0 24px; text-align: center;">
            <a href="${pcLink}" style="background-color: #1E293B; color: #CBD5E1; border: 1px solid #475569; padding: 10px 20px; border-radius: 10px; text-decoration: none; font-size: 13px; display: inline-block;">
              💻 O abrir desde la PC (localhost)
            </a>
          </div>
          <p style="font-size: 13px; color: #94A3B8;">
            <strong>Nota para celular:</strong> Tu teléfono debe estar conectado a la misma red Wi-Fi que tu PC para acceder al enlace.<br/>
            Enlace directo: <a href="${mobileLink}" style="color: #818CF8;">${mobileLink}</a>
          </p>
          <hr style="border: 0; border-top: 1px solid #334155; margin: 24px 0;" />
          <p style="font-size: 12px; color: #64748B; margin-bottom: 0;">
            Si no solicitaste este cambio, puedes ignorar este mensaje de forma segura.
          </p>
        </div>
      `,
    };

    const info = await gmailTransporter.sendMail(mailOptions);
    console.log(`✅ Correo enviado con éxito a ${userFound.email}. MessageId: ${info.messageId}`);

    return res.json({
      success: true,
      message: `¡Correo enviado exitosamente a ${userFound.email} desde salviamale08@gmail.com! Revisa tu bandeja de entrada o spam.`,
      email: userFound.email,
      token: token,
      resetLink: mobileLink,
      pcLink: pcLink,
    });
  } catch (mailError) {
    console.error('❌ Error al enviar correo por Gmail SMTP:', mailError);
    return res.status(500).json({
      success: false,
      message: `Error al enviar correo por Gmail: ${mailError.message}`,
    });
  }
});

// Endpoint POST /api/reset-password (Robusto: Acepta token O email)
app.post('/api/reset-password', async (req, res) => {
  const { token, email, usuario, newPassword } = req.body;

  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({
      success: false,
      message: 'La nueva contraseña debe tener al menos 4 caracteres.',
    });
  }

  let userTarget = (email || usuario || '').trim();

  if (token && resetTokens.has(token)) {
    const tokenData = resetTokens.get(token);
    userTarget = tokenData.email || tokenData.usuario;
  }

  if (!userTarget) {
    return res.status(400).json({
      success: false,
      message: 'No se pudo identificar la cuenta para restablecer la contraseña. Ingresa tu usuario o correo.',
    });
  }

  let updatedInDb = false;
  const cleanTarget = userTarget.toLowerCase();

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'UPDATE usuarios SET password = ? WHERE LOWER(email) = ? OR LOWER(usuario) = ?',
      [newPassword, cleanTarget, cleanTarget]
    );
    await connection.end();
    if (result.affectedRows > 0) {
      updatedInDb = true;
    }
  } catch (error) {
    console.warn('⚠️ No se pudo actualizar en MySQL, actualizando en mockUsers:', error.message);
  }

  // Actualizar en memoria mockUsers
  const mockIndex = mockUsers.findIndex(
    (u) => u.email.toLowerCase() === cleanTarget || u.usuario.toLowerCase() === cleanTarget
  );

  if (mockIndex !== -1) {
    mockUsers[mockIndex].password = newPassword;
    updatedInDb = true;
  }

  if (updatedInDb) {
    if (token) resetTokens.delete(token);
    console.log(`🔑 Contraseña de ${cleanTarget} actualizada exitosamente a "${newPassword}".`);

    return res.json({
      success: true,
      message: `¡Contraseña de ${cleanTarget} actualizada exitosamente! Ya puedes iniciar sesión con tu nueva contraseña.`,
    });
  }

  return res.json({
    success: false,
    message: `No se encontró la cuenta "${cleanTarget}" para actualizar la contraseña.`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Servidor de Login escuchando en http://localhost:${PORT}`);
});
