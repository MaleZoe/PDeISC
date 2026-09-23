import mysql from 'mysql2/promise';
import fs from 'fs';

async function generate() {
  try {
    const conn = await mysql.createConnection('mysql://iTQXkN8SpP8X3G5.root:sOJmw8A5qK4Zbp45@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');
    const [rows] = await conn.execute('SELECT * FROM projects');
    const projects = rows.map(r => ({
      ...r,
      tech: typeof r.tech === 'string' ? JSON.parse(r.tech) : r.tech
    }));
    fs.writeFileSync('src/lib/fallbackProjects.json', JSON.stringify(projects, null, 2));
    await conn.end();
    console.log('Done!');
  } catch(e) {
    console.error('Error:', e.message);
  }
}
generate();
