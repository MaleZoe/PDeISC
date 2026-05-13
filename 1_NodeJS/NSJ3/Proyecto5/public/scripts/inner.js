// lógica de inyección innerHTML para el proyecto 5

document.addEventListener('DOMContentLoaded', () => {
    
    const container = document.getElementById('injectionContainer');
    const injectButtons = document.querySelectorAll('.inject-btn');
    const btnClear = document.getElementById('btnClear');

    // plantillas html
    const templates = {
        card: `
            <div class="card bg-dark border-secondary text-light injected-item">
                <div class="card-body">
                    <h5 class="card-title text-primary">Tarjeta Dinámica</h5>
                    <p class="card-text">Este objeto fue inyectado usando la propiedad <code>innerHTML</code>. Es una forma rápida de meter estructuras complejas.</p>
                    <a href="#" class="btn btn-primary btn-sm">Acción Vacía</a>
                </div>
            </div>
        `,
        table: `
            <div class="table-responsive injected-item">
                <table class="table table-dark table-hover border-secondary">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Proyecto</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>1</td><td>DOM Básico</td><td>Completado</td></tr>
                        <tr><td>2</td><td>Eventos</td><td>Completado</td></tr>
                    </tbody>
                </table>
            </div>
        `,
        list: `
            <ul class="list-group list-group-flush injected-item">
                <li class="list-group-item bg-transparent text-info border-secondary">Item de Lista 1</li>
                <li class="list-group-item bg-transparent text-info border-secondary">Item de Lista 2</li>
                <li class="list-group-item bg-transparent text-info border-secondary">Item de Lista 3</li>
            </ul>
        `,
        alert: `
            <div class="alert alert-warning border-0 shadow-sm injected-item" role="alert">
                <h4 class="alert-heading">¡Atención!</h4>
                <p>Esta es una alerta inyectada dinámicamente para probar la versatilidad del innerHTML.</p>
            </div>
        `
    };

    // función para inyectar
    injectButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            
            // si es el primer elemento, borro el texto de espera
            if (container.querySelector('.italic')) {
                container.innerHTML = '';
            }

            // inyecto el html (uso += para acumular, o = para reemplazar según convenga)
            // en este caso acumulamos para que se vea el poder de la inyección
            container.innerHTML += templates[type];
        });
    });

    // función para limpiar
    btnClear.addEventListener('click', () => {
        container.innerHTML = '<p class="text-muted italic text-center">Esperando inyección de contenido...</p>';
    });

});
