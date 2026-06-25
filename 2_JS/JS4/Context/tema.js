// módulo de manejo del tema (oscuro/claro)

// aplico el tema guardado o el del sistema al iniciar
export function iniciarTema() {
    const temaGuardado = localStorage.getItem('tema');
    const prefierOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const tema = temaGuardado || (prefierOscuro ? 'dark' : 'light');
    aplicarTema(tema);
}

// cambio entre oscuro y claro
export function toggleTema() {
    const actual = document.documentElement.getAttribute('data-theme') || 'light';
    const nuevo = actual === 'dark' ? 'light' : 'dark';
    aplicarTema(nuevo);
    localStorage.setItem('tema', nuevo);
}

// aplico el tema al html y actualizo el texto del botón
function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    const btn = document.getElementById('btn-tema');
    if (btn) {
        const iconoSolo = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 4V2C12 1.45 11.55 1 11 1C10.45 1 10 1.45 10 2V4C10 4.55 10.45 5 11 5C11.55 5 12 4.55 12 4ZM19 11H21C21.55 11 22 10.55 22 10C22 9.45 21.55 9 21 9H19C18.45 9 18 9.45 18 10C18 10.55 18.45 11 19 11ZM20.71 4.71C20.32 4.32 19.69 4.32 19.3 4.71L17.89 6.12C17.5 6.51 17.5 7.14 17.89 7.53C18.28 7.92 18.91 7.92 19.3 7.53L20.71 6.12C21.1 5.73 21.1 5.1 20.71 4.71ZM7.53 17.89C7.14 17.5 6.51 17.5 6.12 17.89L4.71 19.3C4.32 19.69 4.32 20.32 4.71 20.71C5.1 21.1 5.73 21.1 6.12 20.71L7.53 19.3C7.92 18.91 7.92 18.28 7.53 17.89ZM6.12 6.12L4.71 4.71C4.32 4.32 3.69 4.32 3.3 4.71C2.91 5.1 2.91 5.73 3.3 6.12L4.71 7.53C5.1 7.92 5.73 7.92 6.12 7.53C6.51 7.14 6.51 6.51 6.12 6.12ZM17.89 16.47L19.3 17.88C19.69 18.27 20.32 18.27 20.71 17.88C21.1 17.49 21.1 16.86 20.71 16.47L19.3 15.06C18.91 14.67 18.28 14.67 17.89 15.06C17.5 15.45 17.5 16.08 17.89 16.47ZM12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7ZM12 19V21C12 21.55 12.45 22 13 22C13.55 22 14 21.55 14 21V19C14 18.45 13.55 18 13 18C12.45 18 12 18.45 12 19ZM4 11H2C1.45 11 1 11.45 1 12C1 12.55 1.45 13 2 13H4C4.55 13 5 12.55 5 12C5 11.45 4.55 11 4 11Z"/></svg>`;
        const iconoLuna = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C12.8 21 13.58 20.9 14.32 20.71C10.74 19.56 8 16.11 8 12C8 7.89 10.74 4.44 14.32 3.29C13.58 3.1 12.8 3 12 3Z"/></svg>`;
        
        btn.innerHTML = tema === 'dark' ? iconoSolo : iconoLuna;
        btn.title = tema === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    }
}
