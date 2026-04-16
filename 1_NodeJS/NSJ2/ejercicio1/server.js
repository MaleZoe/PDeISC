import Suma from './modules/calculos.js';
import Resta from './modules/calculos.js';
import "http";

const createServer = require("http").createServer;

const server = createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hola Mundo");
});
server.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
}
);
console.log(Suma());
console.log(Resta());