// acá analizo la url, no te pierdas que es fácil
// te muestro las partes por consola para que veas que funciona

export const URL_EJEMPLO = 'https://www.nike.com.ar/mas-vendidos?gad_campaignid=19954478100&initialMap=productClusterIds&initialQuery=139&map=productClusterIds,tipo-de-producto,productclusternames&query=/139/botines/mas-vendidos&searchState';

export function analizarURL(urlString = URL_EJEMPLO) {
  // el objeto URL ya hace todo el laburo sucio por nosotros
  const u = new URL(urlString);

  const datos = {
    href: u.href,
    protocol: u.protocol,
    host: u.host,
    hostname: u.hostname,
    port: u.port || '(por defecto)',
    pathname: u.pathname,
    search: u.search || '(vacío)',
    hash: u.hash || '(no hay)',
    origin: u.origin,
    params: Object.fromEntries(u.searchParams.entries()),
  };

  console.log('\n[estanga] mirá como te desarmé la url, pedazo de animal:');
  Object.entries(datos).forEach(([clave, valor]) => {
    console.log(`  ${clave.padEnd(10)}: ${typeof valor === 'object' ? JSON.stringify(valor) : valor}`);
  });

  return datos;
}
