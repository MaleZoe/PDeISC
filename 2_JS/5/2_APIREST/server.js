// 2_APIREST/server.js
import express from "express";
import cors from "cors";
import conexion from "./modules/conexion.js";
import alumnosRouter from "./routes/alumnos.js";

const app = express();

// aca habilito cors para que el servidor cliente pueda consumir la api
app.use(cors());

// aca proceso los bodies en json
app.use(express.json());

// aca cargo las rutas de alumnos
app.use("/", alumnosRouter);

const PUERTO = 3000;

app.listen(PUERTO, () => {
    console.log(`Servidor API iniciado en el puerto ${PUERTO}`);
});
