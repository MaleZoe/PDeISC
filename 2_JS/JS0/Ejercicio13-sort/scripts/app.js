document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // ESTADO DE LA APLICACIÓN
    // ==========================================
    const BASES = {
        demo1: [34, 7, 92, 18, 55, 3, 71, 29],
        demo2: ['manzana', 'cereza', 'uva', 'banana', 'limón', 'pera', 'kiwi', 'durazno'],
        demo3: [
            {nombre: 'Carla', edad: 28},
            {nombre: 'Andrés', edad: 45},
            {nombre: 'Beatriz', edad: 19},
            {nombre: 'Diego', edad: 33},
            {nombre: 'Elena', edad: 52},
            {nombre: 'Fabio', edad: 24}
        ]
    };
    
    let trabajo = {
        demo1: [...BASES.demo1],
        demo2: [...BASES.demo2],
        demo3: JSON.parse(JSON.stringify(BASES.demo3))
    };

    // ==========================================
    // FUNCIONES ATÓMICAS (LOGIC & UI)
    // ==========================================

    function renderArray(demoNum, array) {
        const container = document.getElementById(`trackerBase${demoNum}`);
        if (!container) return;
        container.innerHTML = '';
        array.forEach((item, idx) => {
            const span = document.createElement('span');
            span.className = 'badge bg-secondary opacity-75 elemento-array mb-2 anim-fade-in';
            span.textContent = typeof item === 'object' ? `${item.nombre} (${item.edad})` : item;
            span.id = `d${demoNum}-${idx}`;
            container.appendChild(span);
        });
        vincularEfectosVisuales();
    }

    function sortNumeros() {
        trabajo.demo1.sort((a, b) => a - b);
        renderArray(1, trabajo.demo1);
        disableButtons('btnSort');
    }

    function sortPalabras() {
        trabajo.demo2.sort((a, b) => a.localeCompare(b, 'es'));
        renderArray(2, trabajo.demo2);
        disableButtons('btnSortAZ');
    }

    function sortObjetos() {
        const key = document.getElementById('selectSortKey').value;
        if (key === 'edad') trabajo.demo3.sort((a, b) => a.edad - b.edad);
        else trabajo.demo3.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
        renderArray(3, trabajo.demo3);
        disableButtons('btnSortObj');
    }

    function disableButtons(prefix) {
        ['Click', 'Key'].forEach(s => {
            const btn = document.getElementById(`${prefix}${s}`);
            if (btn) btn.disabled = true;
        });
    }

    function enableButtons(prefix) {
        ['Click', 'Key'].forEach(s => {
            const btn = document.getElementById(`${prefix}${s}`);
            if (btn) btn.disabled = false;
        });
    }

    // ==========================================
    // ASIGNACIÓN DE EVENTOS (HANDLERS)
    // ==========================================

    function setupEvents() {
        const bind = (id, action, type) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener(type, action);
        };

        // Demo 1
        const btn1C = document.getElementById('btnSortClick');
        const btn1K = document.getElementById('btnSortKey');
        if (btn1C) btn1C.addEventListener('click', sortNumeros);
        if (btn1K) btn1K.addEventListener('keydown', (e) => { if (e.key === 'Enter') sortNumeros(); });

        // Demo 2
        const btn2C = document.getElementById('btnSortAZClick');
        const btn2K = document.getElementById('btnSortAZKey');
        if (btn2C) btn2C.addEventListener('click', sortPalabras);
        if (btn2K) btn2K.addEventListener('keydown', (e) => { if (e.key === 'Enter') sortPalabras(); });

        // Demo 3
        const btn3C = document.getElementById('btnSortObjClick');
        const btn3K = document.getElementById('btnSortObjKey');
        if (btn3C) btn3C.addEventListener('click', sortObjetos);
        if (btn3K) btn3K.addEventListener('keydown', (e) => { if (e.key === 'Enter') sortObjetos(); });

        // Re-habilitar botones al cambiar el filtro de ordenamiento
        const selectKey = document.getElementById('selectSortKey');
        if (selectKey) selectKey.addEventListener('change', () => enableButtons('btnSortObj'));

        // Reinicio
        document.querySelectorAll('.btn-reiniciar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demoNum = e.target.getAttribute('data-demo');
                const key = `demo${demoNum}`;
                const prefix = demoNum === '1' ? 'btnSort' : (demoNum === '2' ? 'btnSortAZ' : 'btnSortObj');
                enableButtons(prefix);
                if (demoNum === '3') trabajo[key] = JSON.parse(JSON.stringify(BASES[key]));
                else trabajo[key] = [...BASES[key]];
                renderArray(demoNum, trabajo[key]);
            });
        });

        // Navbar
        document.querySelectorAll('.nav-link-auto-close').forEach(link => {
            link.addEventListener('click', () => {
                const menu = document.getElementById('navbarNav');
                if (menu && menu.classList.contains('show')) bootstrap.Collapse.getInstance(menu).hide();
            });
        });
    }

    function vincularEfectosVisuales() {
        document.querySelectorAll('.btn, .elemento-array').forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transform = 'scale(1.05)';
                el.style.transition = 'transform 0.2s';
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'scale(1)';
            });
        });
    }

    setupEvents();
    renderArray(1, trabajo.demo1);
    renderArray(2, trabajo.demo2);
    renderArray(3, trabajo.demo3);
    vincularEfectosVisuales();
});
