const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PUERTO = 3000;

// Middleware para procesar JSON y servir archivos estáticos
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Registro de peticiones en consola
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// Ruta principal: Entrega la Single Page Application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Endpoint: Exportar lista de números a un archivo .txt
app.post('/exportar', (req, res) => {
    const { numeros } = req.body;

    // Validación básica del lado del servidor
    if (!numeros || !Array.isArray(numeros) || numeros.length === 0) {
        return res.status(400).json({ ok: false, error: "La lista de números está vacía o es inválida." });
    }

    try {
        // Cálculo de estadísticas para el reporte
        const total = numeros.length;
        const suma = numeros.reduce((a, b) => a + b, 0);
        const promedio = (suma / total).toFixed(2);
        const minimo = Math.min(...numeros);
        const maximo = Math.max(...numeros);
        const fecha = new Date().toLocaleString('es-ES');

        // Construcción del contenido del archivo según el formato requerido
        let contenido = `=== Lista de Números Exportados ===\n`;
        contenido += `Fecha: ${fecha}\n`;
        contenido += `Total: ${total} números\n`;
        contenido += `─────────────────────────────────\n`;
        
        numeros.forEach((num, i) => {
            contenido += `${(i + 1).toString().padEnd(3)}. ${num}\n`;
        });

        contenido += `─────────────────────────────────\n`;
        contenido += `Promedio:   ${promedio}\n`;
        contenido += `Mínimo:     ${minimo}\n`;
        contenido += `Máximo:     ${maximo}\n`;
        contenido += `Suma total: ${suma}\n`;

        // Escritura física en la raíz del proyecto
        const rutaArchivo = path.join(__dirname, 'numeros_exportados.txt');
        fs.writeFileSync(rutaArchivo, contenido, 'utf8');

        res.json({ 
            ok: true, 
            archivo: "numeros_exportados.txt", 
            total: total 
        });

    } catch (error) {
        console.error("Error al exportar:", error);
        res.status(500).json({ ok: false, error: "No se pudo guardar el archivo." });
    }
});

// Inicio del servidor con manejo de puerto en uso
const servidor = app.listen(PUERTO, () => {
    console.log(`>>> Servidor iniciado exitosamente en http://localhost:${PUERTO}`);
});

servidor.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`[ERROR] El puerto ${PUERTO} está ocupado. Cierra el proceso anterior antes de intentar de nuevo.`);
        process.exit(1);
    } else {
        console.error("Error crítico en el servidor:", error);
        process.exit(1);
    }
});
