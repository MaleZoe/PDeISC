// modulo para el clima
export const getClima = (ciudad) => {
  return {
    ciudad: ciudad,
    temperatura: Math.floor(Math.random() * 10) + 15, // numero magico
    condicion: 'Soleado con probabilidad de código'
  };
};
