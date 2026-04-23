/**
 * IMPORTANTE: Usamos setAttribute exclusivamente en lugar de asignación directa
 * porque setAttribute modifica el atributo HTML real visible en el DOM, 
 * mientras que la asignación de propiedad altera el objeto JS interno.
 */

window.BLUEPRINTS_NODOS = [
    {
        id: 'enlace-google',
        texto: 'Google',
        atributos: {
            href: 'https://www.google.com',
            target: '_blank',
            title: 'Ir a Google',
            class: 'enlace-vivo nodo-buscador',
            rel: 'noopener noreferrer'
        },
        icono: '🔍',
        descripcion: 'Buscador Global'
    },
    {
        id: 'enlace-wiki',
        texto: 'Wikipedia',
        atributos: {
            href: 'https://www.wikipedia.org',
            target: '_blank',
            title: 'Enciclopedia Libre',
            class: 'enlace-vivo nodo-enciclopedia',
            rel: 'noopener noreferrer'
        },
        icono: '📚',
        descripcion: 'Enciclopedia'
    },
    {
        id: 'enlace-github',
        texto: 'GitHub',
        atributos: {
            href: 'https://www.github.com',
            target: '_blank',
            title: 'Repositorios de código',
            class: 'enlace-vivo nodo-codigo',
            rel: 'noopener noreferrer'
        },
        icono: '💻',
        descripcion: 'Código Fuente'
    },
    {
        id: 'enlace-youtube',
        texto: 'YouTube',
        atributos: {
            href: 'https://www.youtube.com',
            target: '_blank',
            title: 'Plataforma de video',
            class: 'enlace-vivo nodo-video',
            rel: 'noopener noreferrer'
        },
        icono: '🎬',
        descripcion: 'Streaming'
    },
    {
        id: 'enlace-noticias',
        texto: 'BBC Mundo',
        atributos: {
            href: 'https://www.bbc.com/mundo',
            target: '_self',
            title: 'Noticias globales',
            class: 'enlace-vivo nodo-noticia',
            rel: 'noopener noreferrer'
        },
        icono: '📰',
        descripcion: 'Información'
    }
];
