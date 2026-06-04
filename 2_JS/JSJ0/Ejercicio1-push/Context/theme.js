// aca manejo el estado del tema claro y oscuro
export function inicializarTema() {
    // me fijo si ya habia un tema guardado en el navegador
    const temaGuardado = localStorage.getItem('tema') || 'light';
    aplicarTema(temaGuardado);

    // busco el boton del DOM para cambiar el tema
    const botonTema = document.getElementById('btn-tema');
    if (botonTema) {
        botonTema.addEventListener('click', () => {
            const temaActual = document.documentElement.getAttribute('data-theme');
            const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';
            aplicarTema(nuevoTema);
        });
    }
}

// esta funcion cambia el atributo del html y el css correspondiente
function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    document.documentElement.setAttribute('data-bs-theme', tema);
    localStorage.setItem('tema', tema);

    // cambio la hoja de estilos en base al tema
    const linkEstilo = document.getElementById('hoja-estilo-tema');
    if (linkEstilo) {
        linkEstilo.setAttribute('href', `/styles/${tema}.css`);
    }

    // actualizo el texto o icono del boton de cambio de tema
    const botonTema = document.getElementById('btn-tema');
    if (botonTema) {
        botonTema.innerHTML = tema === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
        // cambio las clases del boton de bootstrap para que combine
        if (tema === 'dark') {
            botonTema.className = 'btn btn-outline-light btn-sm';
        } else {
            botonTema.className = 'btn btn-outline-dark btn-sm';
        }
    }
}
