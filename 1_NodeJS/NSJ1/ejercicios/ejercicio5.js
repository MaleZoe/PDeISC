import http from 'http';
import { sumar, restar, multiplicar, dividir } from './calculos.js';

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    
    const html = `
    <html>
        <head>
            <style>
                table { border-collapse: collapse; width: 50%; margin: 20px auto; font-family: Arial; }
                th, td { border: 1px solid #333; padding: 12px; text-align: center; }
                th { background-color: #f4f4f4; }
                h1 { text-align: center; color: #2c3e50; }
            </style>
        </head>
        <body>
            <h1>Resultados de Cálculos</h1>
            <table>
                <tr><th>Operación</th><th>Resultado</th></tr>
                <tr><td>Suma (5+3)</td><td>${sumar(5, 3)}</td></tr>
                <tr><td>Resta (8-6)</td><td>${restar(8, 6)}</td></tr>
                <tr><td>Multiplicación (3*11)</td><td>${multiplicar(3, 11)}</td></tr>
                <tr><td>División (30/5)</td><td>${dividir(30, 5)}</td></tr>
            </table>
        </body>
    </html>`;
    
    res.end(html);
});

server.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});