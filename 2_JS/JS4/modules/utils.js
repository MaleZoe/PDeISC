// módulo con utilidades compartidas entre páginas

// muestro un mensaje flotante de éxito o error
export function mostrarToast(mensaje, tipo = 'success') {
    let toast = document.getElementById('toast-global');

    // creo el toast si todavía no existe en el dom
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-global';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.className = `toast ${tipo}`;
    toast.textContent = mensaje;
    toast.classList.add('show');

    // lo escondo después de 3 segundos
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// inicializo el botón de ir arriba
export function iniciarScrollTop() {
    const btn = document.getElementById('btn-scroll-top');
    if (!btn) return;

    // muestro el botón cuando el usuario scrollea más de 300px
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 300);
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// inicializo el menú hamburguesa para mobile
export function iniciarHamburguesa() {
    const btnHam = document.getElementById('btn-hamburger');
    const menuMobile = document.getElementById('mobile-menu');
    if (!btnHam || !menuMobile) return;

    btnHam.addEventListener('click', () => {
        menuMobile.classList.toggle('open');
    });

    // cierro el menú si el usuario hace clic fuera
    document.addEventListener('click', (e) => {
        if (!btnHam.contains(e.target) && !menuMobile.contains(e.target)) {
            menuMobile.classList.remove('open');
        }
    });
}

// genero las iniciales de un nombre para el avatar
export function getIniciales(nombre) {
    return nombre
        .split(' ')
        .slice(0, 2)
        .map(p => p[0])
        .join('')
        .toUpperCase();
}

// agrega un log a la consola simulada de la UI
export function logConsole(consoleId, mensaje, tipo = 'info') {
    const cons = document.getElementById(consoleId);
    if (!cons) return;
    
    const time = new Date().toLocaleTimeString('es-AR', { hour12: false });
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    let typeClass = 'log-info';
    if (tipo === 'success') typeClass = 'log-success';
    if (tipo === 'error') typeClass = 'log-error';
    if (tipo === 'warning') typeClass = 'log-warning';
    
    entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="${typeClass}">${mensaje}</span>`;
    cons.appendChild(entry);
    
    // auto-scroll al fondo
    cons.scrollTop = cons.scrollHeight;
}

export function limpiarConsole(consoleId) {
    const cons = document.getElementById(consoleId);
    if (cons) cons.innerHTML = '';
}
