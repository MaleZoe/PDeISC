// 2_APIREST/modules/conexion.js
import mysql from "mysql2";

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "alumnosDB"
});

// aca verifico que la conexion funcione
conexion.connect((error) => {
    if (error) {
        console.log("Error al conectar con MySQL");
        console.log(error);
        return;
    }

    console.log("Conectado a MySQL");
});

// aca evito que el servidor de Node se caiga si la conexion de MySQL se pierde o se cierra
conexion.on("error", (error) => {
    console.log("Ocurrio un error en la conexion de MySQL:");
    console.log(error);
});

export default conexion;
