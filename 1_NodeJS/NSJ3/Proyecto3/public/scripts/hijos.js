// lógica de navegación e inspector de hijos para el proyecto 3

document.addEventListener('DOMContentLoaded', () => {
    
    // navegación spa
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.comp-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            sections.forEach(sec => {
                if (sec.id === `sec-${target}`) {
                    sec.classList.remove('d-none');
                } else {
                    sec.classList.add('d-none');
                }
            });
        });
    });

    // --- eventos específicos (heredados de P2) ---

    const mouseBox = document.getElementById('mouse-box');
    const coords = document.getElementById('coords');
    if (mouseBox) {
        mouseBox.addEventListener('mousemove', (e) => {
            coords.textContent = `X: ${e.offsetX}, Y: ${e.offsetY}`;
        });
    }

    window.addEventListener('keydown', (e) => {
        const keySec = document.getElementById('sec-keyboard');
        if (keySec && !keySec.classList.contains('d-none')) {
            document.getElementById('key-display').textContent = e.key === ' ' ? 'Space' : e.key;
            document.getElementById('key-details').textContent = `Código: ${e.code} | KeyCode: ${e.keyCode}`;
        }
    });

    const clickTarget = document.getElementById('click-target');
    if (clickTarget) {
        clickTarget.addEventListener('dblclick', () => {
            clickTarget.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        });
    }

    // --- LÓGICA DE CONTEO DE HIJOS (Punto 3) ---
    const btnCount = document.getElementById('btn-count-children');
    const resultBox = document.getElementById('hijos-result');
    const childrenMsg = document.getElementById('children-msg');
    const sidebar = document.querySelector('.sidebar');

    if (btnCount && sidebar) {
        btnCount.addEventListener('click', () => {
            // cuento los hijos directos del nodo sidebar
            const numChildren = sidebar.children.length;
            
            resultBox.classList.remove('d-none');
            childrenMsg.textContent = `La Sidebar tiene actualmente ${numChildren} hijos directos.`;
            
            // oculto el botón después de usarlo (Regla Estanga: funcionalidad de un solo uso)
            btnCount.classList.add('d-none');
        });
    }

});
