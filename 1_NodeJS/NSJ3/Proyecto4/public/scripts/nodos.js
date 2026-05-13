// lógica de creación y auditoría de nodos para el proyecto 4

document.addEventListener('DOMContentLoaded', () => {
    
    const btnCreate = document.getElementById('btnCreateLinks');
    const btnModify = document.getElementById('btnModifyLinks');
    const linkContainer = document.getElementById('linkContainer');
    const logContent = document.getElementById('logContent');

    let linksCreated = false;

    // función para agregar al log
    const addLog = (msg, type = 'info') => {
        const entry = document.createElement('div');
        entry.classList.add('log-entry');
        const color = type === 'info' ? '#3b82f6' : '#eab308';
        entry.style.borderLeftColor = color;
        entry.innerHTML = `<span style="color: ${color}">[${new Date().toLocaleTimeString()}]</span> ${msg}`;
        logContent.prepend(entry);
    };

    // 1. Crear 5 enlaces
    btnCreate.addEventListener('click', () => {
        if (linksCreated) return;

        linkContainer.innerHTML = '';
        const sites = [
            { name: 'Google', url: 'https://www.google.com' },
            { name: 'GitHub', url: 'https://www.github.com' },
            { name: 'YouTube', url: 'https://www.youtube.com' },
            { name: 'Twitter', url: 'https://www.twitter.com' },
            { name: 'MDN Web Docs', url: 'https://developer.mozilla.org' }
        ];

        sites.forEach((site, index) => {
            const a = document.createElement('a');
            a.href = site.url;
            a.textContent = site.name;
            a.target = '_blank';
            a.id = `link-${index + 1}`;
            linkContainer.appendChild(a);
            
            addLog(`Nodo <${a.tagName}> creado: ID="${a.id}", HREF="${a.href}"`);
        });

        linksCreated = true;
        btnCreate.disabled = true;
        btnCreate.classList.replace('btn-info', 'btn-secondary');
        btnModify.disabled = false;
    });

    // 2. Modificar atributos
    btnModify.addEventListener('click', () => {
        const links = linkContainer.querySelectorAll('a');
        const newTargets = [
            'https://www.openai.com',
            'https://www.microsoft.com',
            'https://www.apple.com',
            'https://www.linux.org',
            'https://www.wikipedia.org'
        ];

        links.forEach((link, index) => {
            const oldHref = link.href;
            const newHref = newTargets[index];
            
            // modifico el atributo
            link.setAttribute('href', newHref);
            link.textContent = `Link Modificado ${index + 1}`;
            
            // muestro dinámicamente el cambio
            addLog(`Atributo MODIFICADO en ${link.id}: de "${oldHref}" a "${newHref}"`, 'warn');
        });

        // regla estanga: ocultar si ya se usó (o deshabilitar)
        btnModify.disabled = true;
        btnModify.classList.replace('btn-warning', 'btn-secondary');
    });

});
