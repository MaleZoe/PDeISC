// scripts/verify_system.js
// Script de auditoría y verificación integral End-to-End del sistema de autenticación

const http = require('http');

function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

async function runAudit() {
  console.log('🔍 INICIANDO AUDITORÍA INTEGRAL DEL SISTEMA...\n');

  const BASE_URL = 'http://localhost:3000';
  let passedCount = 0;
  let totalCount = 5;

  // 1. Test Login con Credenciales por Defecto
  try {
    console.log('1️⃣ Test de Inicio de Sesión (admin / admin123)...');
    const res1 = await postJson(`${BASE_URL}/api/login`, { usuario: 'admin', password: 'admin123' });
    if (res1.body.success && res1.body.user) {
      console.log('   ✅ LOGIN EXITOSO: Usuario recibido correctamente ->', res1.body.user.nombre);
      passedCount++;
    } else {
      console.error('   ❌ FALLÓ LOGIN:', res1.body);
    }
  } catch (err) {
    console.error('   ❌ ERROR EN TEST 1:', err.message);
  }

  // 2. Test Registro de Nuevo Usuario
  const testUser = {
    nombre: 'Auditor Test',
    usuario: 'auditor_' + Date.now().toString(36),
    email: 'auditor_' + Date.now().toString(36) + '@test.com',
    password: 'Password123!',
  };

  try {
    console.log('\n2️⃣ Test de Registro de Nuevo Usuario...');
    const res2 = await postJson(`${BASE_URL}/api/register`, testUser);
    if (res2.body.success && res2.body.user) {
      console.log('   ✅ REGISTRO EXITOSO: Usuario creado ->', res2.body.user.usuario);
      passedCount++;
    } else {
      console.error('   ❌ FALLÓ REGISTRO:', res2.body);
    }
  } catch (err) {
    console.error('   ❌ ERROR EN TEST 2:', err.message);
  }

  // 3. Test Login con el Usuario Recién Registrado
  try {
    console.log('\n3️⃣ Test de Login con el nuevo usuario registrado...');
    const res3 = await postJson(`${BASE_URL}/api/login`, { usuario: testUser.usuario, password: testUser.password });
    if (res3.body.success && res3.body.user) {
      console.log('   ✅ LOGIN CON NUEVA CUENTA EXITOSO -> ID:', res3.body.user.id);
      passedCount++;
    } else {
      console.error('   ❌ FALLÓ LOGIN DE NUEVA CUENTA:', res3.body);
    }
  } catch (err) {
    console.error('   ❌ ERROR EN TEST 3:', err.message);
  }

  // 4. Test Solicitud de Restablecimiento de Contraseña (Gmail SMTP real)
  let resetToken = null;
  try {
    console.log('\n4️⃣ Test de Solicitud de Restablecimiento de Contraseña (Gmail SMTP)...');
    const res4 = await postJson(`${BASE_URL}/api/forgot-password`, { email: 'salviamale08@gmail.com' });
    if (res4.body.success && res4.body.token) {
      resetToken = res4.body.token;
      console.log('   ✅ ENVÍO REAL DE GMAIL EXITOSO!');
      console.log('      • Correo Destino:', res4.body.email);
      console.log('      • Token Generado:', resetToken);
      console.log('      • Link generado:', res4.body.resetLink);
      passedCount++;
    } else {
      console.error('   ❌ FALLÓ RECUPERACIÓN DE CONTRASEÑA:', res4.body);
    }
  } catch (err) {
    console.error('   ❌ ERROR EN TEST 4:', err.message);
  }

  // 5. Test Ejecución de Cambio de Contraseña con Token
  if (resetToken) {
    try {
      console.log('\n5️⃣ Test de Actualización de Contraseña mediante Token...');
      const newPass = 'NuevaClaveSegura2026!';
      const res5 = await postJson(`${BASE_URL}/api/reset-password`, {
        token: resetToken,
        email: 'salviamale08@gmail.com',
        newPassword: newPass,
      });

      if (res5.body.success) {
        console.log('   ✅ CAMBIO DE CONTRASEÑA EXITOSO!');
        
        // Verificar login con la nueva contraseña
        const resVerify = await postJson(`${BASE_URL}/api/login`, {
          usuario: 'salviamale08@gmail.com',
          password: newPass,
        });

        if (resVerify.body.success) {
          console.log('   ✅ VERIFICACIÓN FINAL: Login con nueva contraseña comprobado exitosamente!');
          passedCount++;
        } else {
          console.error('   ❌ VERIFICACIÓN FINAL FALLÓ:', resVerify.body);
        }
      } else {
        console.error('   ❌ FALLÓ CAMBIO DE CONTRASEÑA:', res5.body);
      }
    } catch (err) {
      console.error('   ❌ ERROR EN TEST 5:', err.message);
    }
  }

  console.log('\n==================================================');
  console.log(`📊 RESULTADO DE LA AUDITORÍA: ${passedCount}/${totalCount} Pruebas Pasadas Exitósamente`);
  console.log('==================================================\n');

  if (passedCount === totalCount) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAudit();
