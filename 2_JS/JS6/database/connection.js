/**
 * ============================================================================
 * MÓDULO DE CONEXIÓN A BASE DE DATOS MYSQL (mysql2/promise)
 * ============================================================================
 * Explicación didáctica:
 * Utilizamos `mysql2/promise` para poder trabajar de manera asíncrona y limpia
 * con `async/await` en los controladores, en lugar de callbacks anidados.
 * Implementamos un "Pool de Conexiones" (Connection Pool) en lugar de una
 * conexión única persistente, porque el pool maneja múltiples solicitudes concurrentes
 * reabriendo y reciclando conexiones automáticamente, lo que es el estándar en
 * producción para Node.js y Express.
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargamos variables de entorno desde .env
dotenv.config();

/**
 * Configuración base para conectarse al servidor MySQL (sin seleccionar base de datos inicialmente
 * para permitir la autoinicialización si la base 'Score' aún no ha sido creada).
 */
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 3000
};

// Creamos el pool de conexiones principal (con base de datos especificada cuando ya esté creada)
let pool;

/**
 * Función para inicializar la base de datos y la tabla 'score' automáticamente al arrancar.
 * Esto asegura que el profesor o evaluador pueda clonar el proyecto, ejecutar `node server.js`
 * y tener la base de datos funcional en segundos.
 */
export async function checkAndInitDatabase() {
  try {
    console.log('🔄 Verificando y conectando con el servidor MySQL...');
    // Conectamos inicialmente sin especificar la base de datos para poder crearla
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    // 1. Crear la base de datos 'Score' si no existe
    const dbName = process.env.DB_NAME || 'Score';
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await tempConnection.query(`USE \`${dbName}\`;`);

    // 2. Crear la tabla 'score' solicitada en el requerimiento del Trabajo Práctico
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS score (
          id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único del registro',
          nombre VARCHAR(50) NOT NULL COMMENT 'Nombre del jugador',
          puntos INT NOT NULL COMMENT 'Puntaje obtenido',
          tiempo INT NOT NULL COMMENT 'Tiempo en segundos que duró la partida',
          fecha DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Hora de finalización'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await tempConnection.query(createTableQuery);

    // Verificamos si la tabla está vacía para insertar datos iniciales de prueba (Opcional didáctico)
    const [rows] = await tempConnection.query(`SELECT COUNT(*) as count FROM score`);
    if (rows[0].count === 0) {
      await tempConnection.query(`
        INSERT INTO score (nombre, puntos, tiempo) VALUES 
        ('Ada Lovelace', 1250, 25),
        ('Alan Turing', 1100, 32),
        ('Grace Hopper', 980, 40),
        ('Salvador', 1300, 22)
      `);
      console.log('✅ Datos iniciales de prueba insertados en la tabla `score`.');
    }

    await tempConnection.end();

    // 3. Inicializar el pool con la base de datos ya creada y seleccionada
    pool = mysql.createPool({
      ...dbConfig,
      database: dbName
    });

    // Probamos el pool
    const connection = await pool.getConnection();
    console.log(`✅ Conexión exitosa a MySQL (Pool activo en BD: '${dbName}')`);
    connection.release();

    return true;
  } catch (error) {
    console.error('❌ ERROR AL CONECTAR O INICIALIZAR MYSQL:');
    console.error(`   Detalle: ${error.message}`);
    console.error('   👉 Verifique que el servicio de MySQL (XAMPP/WAMP/Docker) esté corriendo y las credenciales en .env sean correctas.');
    return false;
  }
}

/**
 * Función helper para obtener el pool desde los modelos o controladores
 */
export function getPool() {
  if (!pool) {
    throw new Error('El pool de base de datos no ha sido inicializado aún. Ejecute checkAndInitDatabase() primero.');
  }
  return pool;
}

export default {
  checkAndInitDatabase,
  getPool
};
