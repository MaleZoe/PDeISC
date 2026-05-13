const express = require('express');
const path = require('path');
const fs = require('fs');

const aplicacion = express();
const PUERTO = 3000;

// Middleware para procesar JSON
aplicacion.use(express.json());

// Middleware de registro
aplicacion.use((peticion, respuesta, siguiente) => {
  console.log(`[${peticion.method}] ${peticion.url}`);
  siguiente();
});

// Rutas estaticas
aplicacion.use('/public', express.static(path.join(__dirname, 'public')));
aplicacion.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Ruta principal SPA
aplicacion.get('/', (peticion, respuesta) => {
  respuesta.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Endpoint de exportacion
aplicacion.post('/exportar', (peticion, respuesta) => {
  const datos = peticion.body;

  // Validacion de la solicitud
  if (!datos || typeof datos.totalLeidos !== 'number' || !Array.isArray(datos.numerosUtiles) || !Array.isArray(datos.numerosDescartados)) {
    return respuesta.status(400).json({ ok: false, error: "Datos invalidos en la solicitud." });
  }

  const {
    archivoOrigen,
    totalLeidos,
    totalUtiles,
    totalDescartados,
    porcentajeUtiles,
    numerosUtiles,
    numerosDescartados
  } = datos;

  // Formatear fecha
  const fechaActual = new Date();
  const rellenar = (n) => String(n).padStart(2, '0');
  const fechaFormateada = `${rellenar(fechaActual.getDate())}/${rellenar(fechaActual.getMonth() + 1)}/${fechaActual.getFullYear()} ${rellenar(fechaActual.getHours())}:${rellenar(fechaActual.getMinutes())}:${rellenar(fechaActual.getSeconds())}`;

  // Formatear listas
  const formatoListaUtiles = numerosUtiles.map((num, i) => `  ${i + 1}.   ${num}`).join('\n');
  const formatoListaDescartados = numerosDescartados.map((num, i) => `  ${i + 1}.   ${num}`).join('\n');
  const porcentajeDescartados = totalLeidos > 0 ? (100 - porcentajeUtiles).toFixed(2) : 0;

  // Generar contenido del archivo exactamente como se especifico
  const contenidoArchivo = `+================================================+
|       RESULTADO DEL FILTRADO DE NUMEROS        |
+================================================+

Archivo origen  : ${archivoOrigen || 'Desconocido'}
Fecha proceso   : ${fechaFormateada}
------------------------------------------------

RESUMEN ESTADISTICO
--------------------
Total leidos          : ${totalLeidos}
Numeros utiles        : ${totalUtiles}  (${porcentajeUtiles}%)
Numeros descartados   : ${totalDescartados}  (${porcentajeDescartados}%)

------------------------------------------------
NUMEROS UTILES (orden ascendente)
------------------------------------------------
${formatoListaUtiles || '  (Ningun numero util encontrado)'}

------------------------------------------------
NUMEROS DESCARTADOS
------------------------------------------------
${formatoListaDescartados || '  (Ningun numero descartado)'}

+================================================+
Procesado por NJS5 - Filtro de Numeros
+================================================+
`;

  const rutaArchivo = path.join(__dirname, 'filtrado_resultado.txt');

  // Guardar archivo
  fs.writeFile(rutaArchivo, contenidoArchivo, 'utf-8', (error) => {
    if (error) {
      console.error("Error al escribir el archivo:", error);
      return respuesta.status(500).json({ ok: false, error: "No se pudo escribir el archivo de resultados." });
    }
    respuesta.json({ ok: true, archivo: "filtrado_resultado.txt", totalUtiles: totalUtiles });
  });
});

// Manejo de errores de servidor (ej. puerto ocupado)
const servidor = aplicacion.listen(PUERTO, () => {
  console.log(`Servidor de NJS5 corriendo en http://localhost:${PUERTO}`);
});

servidor.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Error: El puerto ${PUERTO} ya esta en uso. Cierre la otra aplicacion o cambie el puerto.`);
    process.exit(1);
  } else {
    console.error("Error en el servidor:", error);
  }
});
