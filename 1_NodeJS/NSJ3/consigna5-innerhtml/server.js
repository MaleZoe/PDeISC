import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const port = 3005;

server.use(express.static(__dirname));

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

server.listen(port, () => {
    console.log(`servidor consigna 5 corriendo en http://localhost:${port}`);
});
