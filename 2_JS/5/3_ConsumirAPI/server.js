// 3_ConsumirAPI/server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// aca expongo las carpetas para que el navegador las pueda leer
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use("/context", express.static(path.join(__dirname, "context")));

// aca cuando entran al raiz mando el index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "index.html"));
});

const PUERTO = 3001;

app.listen(PUERTO, () => {
    console.log(`Servidor Cliente iniciado en http://localhost:${PUERTO}`);
});
