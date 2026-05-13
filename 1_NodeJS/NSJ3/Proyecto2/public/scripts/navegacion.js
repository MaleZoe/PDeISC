// lógica de navegación y eventos para el proyecto 2

document.addEventListener('DOMContentLoaded', () => {
    
    // navegación spa
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.comp-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            
            // cambio botones
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // cambio secciones
            sections.forEach(sec => {
                if (sec.id === `sec-${target}`) {
                    sec.classList.remove('d-none');
                } else {
                    sec.classList.add('d-none');
                }
            });
        });
    });

    // --- eventos específicos ---

    // 1. Mouse Tracker (mousemove)
    const mouseBox = document.getElementById('mouse-box');
    const coords = document.getElementById('coords');
    mouseBox.addEventListener('mousemove', (e) => {
        const x = e.offsetX;
        const y = e.offsetY;
        coords.textContent = `X: ${x}, Y: ${y}`;
    });

    // 2. Keyboard Logger (keydown)
    window.addEventListener('keydown', (e) => {
        // solo si estamos en la sección de teclado
        if (!document.getElementById('sec-keyboard').classList.contains('d-none')) {
            document.getElementById('key-display').textContent = e.key === ' ' ? 'Space' : e.key;
            document.getElementById('key-details').textContent = `Código: ${e.code} | KeyCode: ${e.keyCode}`;
        }
    });

    // 3. Double Click (dblclick)
    const clickTarget = document.getElementById('click-target');
    clickTarget.addEventListener('dblclick', () => {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        clickTarget.style.backgroundColor = randomColor;
    });

    // 4. Focus & Blur (focus, blur)
    const magicInput = document.getElementById('magic-input');
    const focusMsg = document.getElementById('focus-msg');
    magicInput.addEventListener('focus', () => {
        magicInput.classList.replace('border-secondary', 'border-info');
        focusMsg.textContent = '¡Estás dentro del campo!';
    });
    magicInput.addEventListener('blur', () => {
        magicInput.classList.replace('border-info', 'border-secondary');
        focusMsg.textContent = 'Saliste del campo.';
    });

    // 5. Context Menu (contextmenu)
    const contextZone = document.getElementById('context-zone');
    const customMenu = document.getElementById('custom-menu');
    contextZone.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        customMenu.classList.remove('d-none');
        customMenu.style.left = `${e.pageX}px`;
        customMenu.style.top = `${e.pageY}px`;
    });

    // cerrar menú al hacer click afuera
    document.addEventListener('click', () => {
        customMenu.classList.add('d-none');
    });

});
