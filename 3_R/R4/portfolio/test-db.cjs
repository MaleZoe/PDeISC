const mysql = require('mysql2/promise');
async function test() {
  try {
    const conn = await mysql.createConnection('mysql://iTQXkN8SpP8X3G5.root:sOJmw8A5qK4Zbp45@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}');
    const [rows] = await conn.execute('SELECT * FROM projects');
    console.log('Rows:', rows);
    await conn.end();
  } catch(e) {
    console.error('Error:', e.message);
  }
}
test();
