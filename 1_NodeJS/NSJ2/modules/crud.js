// crud manejado en memoria usando el npm upper-case
import { upperCase } from 'upper-case';

let idCounter = 1;
let db = []; // simulamos la bbdd en array

// funcion para la fecha en DD/MM/AA (Requisito Estanga)
const getFechaString = () => {
  const d = new Date();
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const anio = String(d.getFullYear()).slice(-2);
  return \`\${dia}/\${mes}/\${anio}\`;
};

// funciones del modulo exportadas
export const getDatos = () => db;

export const agregarDato = (nombre) => {
  // le clavo mayusculas con el paquete de npm
  const nombreMayus = upperCase(nombre);
  db.push({
    id: String(idCounter++),
    nombre: nombreMayus,
    fecha: getFechaString()
  });
};

export const borrarDato = (id) => {
  db = db.filter(d => d.id !== String(id));
};

export const modificarDato = (id, nuevoNombre) => {
  const idx = db.findIndex(d => d.id === String(id));
  if (idx !== -1) {
    db[idx].nombre = upperCase(nuevoNombre);
    // dejo la fecha de creacion tal cual estaba
  }
};
