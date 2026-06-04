// uso del modulo URL nativo de node
import { URL } from 'url';

export const procesarUrl = (req) => {
  // armo la url completa para parsearla como pide el ej3
  const host = req.headers.host || 'localhost:3000';
  const myUrl = new URL(req.url, \`http://\${host}\`);
  
  // muestro por consola como pide estrictamente la consigna
  console.log('\\n--- URL DATA (Ej 3) ---');
  console.log('Host:', myUrl.host);
  console.log('Pathname:', myUrl.pathname);
  console.log('Protocol:', myUrl.protocol);
  console.log('Search:', myUrl.search);
  console.log('-----------------------\\n');

  // devuelvo los datos para poder pintarlos en el front
  return {
    host: myUrl.host,
    pathname: myUrl.pathname,
    protocol: myUrl.protocol,
    search: myUrl.search
  };
};
