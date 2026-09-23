require('dotenv').config();
const mysql = require('mysql2/promise');

async function init() {
  const url = process.env.DATABASE_URL;
  console.log("Connecting to", url);
  const connection = await mysql.createConnection(url);
  
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      tech JSON NOT NULL,
      link VARCHAR(255),
      github VARCHAR(255),
      imageUrl VARCHAR(255)
    )
  `);

  console.log("Table created.");
  
  // check if empty
  const [rows] = await connection.execute('SELECT COUNT(*) as count FROM projects');
  if (rows[0].count === 0) {
    console.log("Inserting default projects...");
    const defaultProjects = [
      {
        id: '1',
        title: 'Acren',
        description: 'Desarrollo de sitio web de marca personal para cliente. Diseño y maquetación de servicios y contacto.',
        tech: JSON.stringify(['HTML', 'CSS', 'JavaScript']),
        link: 'https://acren.ar/',
        imageUrl: '/projects/acren.png',
      },
      {
        id: '2',
        title: 'Criminal Training Club',
        description: 'Módulo de horarios para el sitio web de un gimnasio, permitiendo visualizar y gestionar las clases disponibles.',
        tech: JSON.stringify(['HTML', 'CSS', 'JavaScript']),
        link: 'https://criminal.com.ar/',
        imageUrl: '/projects/criminal.png',
      },
      {
        id: '3',
        title: 'Juegos Clásicos (Pacman & Snake)',
        description: 'Desarrollo de videojuegos clásicos utilizando lógica pura en JavaScript y manipulación del DOM.',
        tech: JSON.stringify(['JavaScript', 'HTML5 Canvas', 'CSS3']),
        link: '#',
        imageUrl: '/projects/juegos.jpg',
      },
      {
        id: '4',
        title: 'Sitio Web Escolar - Técnica 5',
        description: 'Desarrollo del sitio web institucional para la Escuela Técnica N.º 5, con secciones informativas y académicas.',
        tech: JSON.stringify(['HTML', 'CSS', 'JavaScript']),
        link: '#',
        imageUrl: '/projects/tecnica.png',
      }
    ];

    for (const p of defaultProjects) {
      await connection.execute(
        'INSERT INTO projects (id, title, description, tech, link, github, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [p.id, p.title, p.description, p.tech, p.link, p.github || null, p.imageUrl]
      );
    }
    console.log("Default projects inserted.");
  } else {
    console.log("Table already has data.");
  }

  await connection.end();
}

init().catch(console.error);
