export const Lector = (() => {

    // Opción 1: FormData (Lee todo el formulario automáticamente por 'name')
    function leerConFormData(formulario) {
        const formData = new FormData(formulario);
        
        return {
            nombre: (formData.get('nombre') || '').trim(),
            email: (formData.get('email') || '').trim(),
            fecha: (formData.get('fecha') || '').trim(),
            plan: (formData.get('plan') || '').trim(),
            documento: (formData.get('documento') || '').trim(),
            telefono: (formData.get('telefono') || '').trim(),
            notas: (formData.get('notas') || '').trim()
        };
    }

    // Opción 2: getElementById (Lee cada campo buscando su ID específico)
    function leerConGetElementById(formulario) {
        return {
            nombre: document.getElementById('inp-nombre').value.trim(),
            email: document.getElementById('inp-email').value.trim(),
            fecha: document.getElementById('inp-fecha').value.trim(),
            plan: document.getElementById('inp-plan').value.trim(),
            documento: document.getElementById('inp-documento').value.trim(),
            telefono: document.getElementById('inp-telefono').value.trim(),
            notas: document.getElementById('inp-notas').value.trim()
        };
    }

    // Opción 3: form.elements (indexado por atributo name, no por id)
    function leerConFormElements(formulario) {
        const elementos = formulario.elements;

        const valor = (nombre) => {
            const campo = elementos[nombre];
            return campo ? String(campo.value).trim() : '';
        };
        
        return {
            nombre: valor('nombre'),
            email: valor('email'),
            fecha: valor('fecha'),
            plan: valor('plan'),
            documento: valor('documento'),
            telefono: valor('telefono'),
            notas: valor('notas')
        };
    }

    // Función que decide qué método de lectura aplicar
    function leer(formulario, metodoActivo) {
        // Aseguramos que los elementos tengan atributo 'name' basado en su ID si no lo tienen
        Array.from(formulario.elements).forEach(el => {
            if (el.id && !el.name) {
                el.name = el.id.replace('inp-', '');
            }
        });

        let datos;
        if (metodoActivo === 'formdata') {
            datos = leerConFormData(formulario);
        } else if (metodoActivo === 'getelementbyid') {
            datos = leerConGetElementById(formulario);
        } else if (metodoActivo === 'formelements') {
            datos = leerConFormElements(formulario);
        }

        return datos;
    }

    return { leer, leerConFormData, leerConGetElementById, leerConFormElements };
})();
