export const Lector = (() => {

    // Opción 1: FormData (Lee todo el formulario automáticamente por 'name')
    function leerConFormData(formulario) {
        const formData = new FormData(formulario);
        
        return {
            nombre: formData.get('nombre') || '',
            email: formData.get('email') || '',
            fecha: formData.get('fecha') || '',
            plan: formData.get('plan') || '',
            documento: formData.get('documento') || '',
            telefono: formData.get('telefono') || '',
            notas: formData.get('notas') || ''
        };
    }

    // Opción 2: getElementById (Lee cada campo buscando su ID específico)
    function leerConGetElementById(formulario) {
        return {
            nombre: document.getElementById('inp-nombre').value,
            email: document.getElementById('inp-email').value,
            fecha: document.getElementById('inp-fecha').value,
            plan: document.getElementById('inp-plan').value,
            documento: document.getElementById('inp-documento').value,
            telefono: document.getElementById('inp-telefono').value,
            notas: document.getElementById('inp-notas').value
        };
    }

    // Opción 3: form.elements (Busca campos dentro de la colección del formulario)
    function leerConFormElements(formulario) {
        const elementos = formulario.elements;
        
        return {
            nombre: elementos['inp-nombre'].value,
            email: elementos['inp-email'].value,
            fecha: elementos['inp-fecha'].value,
            plan: elementos['inp-plan'].value,
            documento: elementos['inp-documento'].value,
            telefono: elementos['inp-telefono'].value,
            notas: elementos['inp-notas'].value
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
