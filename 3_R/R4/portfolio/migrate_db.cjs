require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const c = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true }
  });
  console.log('Connected!');

  // Table: site_content
  await c.execute(
    'CREATE TABLE IF NOT EXISTS site_content (key_name VARCHAR(100) PRIMARY KEY, value TEXT NOT NULL)'
  );
  console.log('site_content table ready');

  // Table: certificates
  await c.execute(
    'CREATE TABLE IF NOT EXISTS certificates (' +
    'id VARCHAR(255) PRIMARY KEY,' +
    'year VARCHAR(100),' +
    'platform VARCHAR(255) NOT NULL,' +
    'platform_color VARCHAR(20) DEFAULT \'#c8903a\',' +
    'title VARCHAR(255) NOT NULL,' +
    'description TEXT,' +
    'url VARCHAR(500),' +
    'featured TINYINT(1) DEFAULT 0,' +
    'sort_order INT DEFAULT 0)'
  );
  console.log('certificates table ready');

  // Table: skills
  await c.execute(
    'CREATE TABLE IF NOT EXISTS skills (' +
    'id VARCHAR(255) PRIMARY KEY,' +
    'category VARCHAR(100) NOT NULL,' +
    'name VARCHAR(100) NOT NULL,' +
    'icon_key VARCHAR(100),' +
    'sort_order INT DEFAULT 0)'
  );
  console.log('skills table ready');

  // Seed site_content
  const contentItems = [
    ['hero_tagline', 'Full-Stack Developer Jr. | AI-Assisted Development.'],
    ['hero_description', 'Estudiante de Informatica. Especializada en Front-End, pero con capacidad y experiencia desarrollando en Back-End. Creo aplicaciones completas integrando herramientas de IA.'],
    ['about_name', 'Malena Salvia,'],
    ['about_subtitle', 'Estudiante de Informatica.'],
    ['about_text', 'Este portfolio reune mi recorrido academico y tecnico, junto con una seleccion de proyectos. Aunque mi especialidad y mayor interes es el Front-End, tambien desarrollo y tengo solidos conocimientos en Back-End, combinando diseno, funcionalidad, bases de datos y herramientas de IA en cada desarrollo.'],
    ['stat_1_value', '15+'],
    ['stat_1_label', 'Proyectos'],
    ['stat_2_value', 'IA'],
    ['stat_2_label', 'Integrada'],
    ['stat_3_value', '+2'],
    ['stat_3_label', 'Anos Exp.'],
  ];
  for (const [k, v] of contentItems) {
    await c.execute('INSERT IGNORE INTO site_content (key_name, value) VALUES (?, ?)', [k, v]);
  }
  console.log('site_content seeded');

  // Seed certificates
  const certs = [
    ['01', '2020 - Presente', 'Escuela Tecnica N. 5', '#049fd9', 'Tecnico en Informatica Personal y Profesional', 'Educacion secundaria tecnica. Formacion adicional: Diseno Web, Marketing Digital, Inteligencia Artificial. Idiomas: Ingles (C1 avanzado).', null, 1, 0],
    ['3', '2026', 'Olimpiada Informatica Argentina (OIA)', '#f0b323', 'Participante', 'Participacion en el certamen nacional. La competencia se baso en el diseno de algoritmos, estructuras de datos y programacion para la resolucion eficiente de multiples problematicas algoritmicas.', null, 0, 1],
    ['4', '2026', 'Practicas Profesionalizantes (+200hs)', '#7d7568', 'Desarrolladora Web', 'Participacion en dos proyectos principales: desarrollo del sitio institucional para la Tecnica N. 5; y la investigacion, documentacion arquitectonica y creacion de tutoriales para el sitio web de la Escuela de Artes Visuales Martin A. Malharro.', null, 0, 2],
  ];
  for (const cert of certs) {
    await c.execute(
      'INSERT IGNORE INTO certificates (id, year, platform, platform_color, title, description, url, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      cert
    );
  }
  console.log('certificates seeded');

  // Seed skills
  const skillsData = [
    ['html5', 'Frontend & Frameworks', 'HTML5', 'siHtml5', 0],
    ['css', 'Frontend & Frameworks', 'CSS', 'siCss', 1],
    ['js', 'Frontend & Frameworks', 'JavaScript', 'siJavascript', 2],
    ['ts', 'Frontend & Frameworks', 'TypeScript', 'siTypescript', 3],
    ['react', 'Frontend & Frameworks', 'React', 'siReact', 4],
    ['php', 'Backend & Datos', 'PHP', 'siPhp', 0],
    ['sql', 'Backend & Datos', 'SQL', 'siMysql', 1],
    ['cpp', 'Backend & Datos', 'C++', 'siCplusplus', 2],
    ['claude', 'IA & Desarrollo Asistido', 'Claude Code', 'siAnthropic', 0],
    ['codex', 'IA & Desarrollo Asistido', 'Codex', 'siChatbot', 1],
    ['opencode', 'IA & Desarrollo Asistido', 'OpenCode', 'siOpencode', 2],
    ['sdd', 'IA & Desarrollo Asistido', 'SDD', 'siChatbot', 3],
    ['git', 'Tools & Gestion', 'Git', 'siGit', 0],
    ['github', 'Tools & Gestion', 'GitHub', 'siGithub', 1],
    ['jira', 'Tools & Gestion', 'Jira', 'siJira', 2],
  ];
  for (const s of skillsData) {
    await c.execute(
      'INSERT IGNORE INTO skills (id, category, name, icon_key, sort_order) VALUES (?, ?, ?, ?, ?)',
      s
    );
  }
  console.log('skills seeded');

  console.log('\nAll tables created and seeded successfully!');
  await c.end();
}

run().catch(console.error);
