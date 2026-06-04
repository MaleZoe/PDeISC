// modulo para calcular la edad
export const calcularEdad = (anioNacimiento) => {
  const anioActual = new Date().getFullYear();
  return anioActual - parseInt(anioNacimiento);
};
