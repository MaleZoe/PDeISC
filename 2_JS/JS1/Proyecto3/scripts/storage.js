
window.Storage = (() => {

    const CLAVE_STORAGE = 'njs4_personas';

    /**
     * Helper privado: Lee y parsea desde localStorage.
     */
    function leerDesdeStorage() {
        try {
            const data = localStorage.getItem(CLAVE_STORAGE);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('[Storage] Error al parsear JSON del localStorage', e);
            return [];
        }
    }

    /**
     * Helper privado: Serializa y escribe en localStorage.
     */
    function escribirEnStorage(arr) {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(arr));
    }

    /**
     * Lee el array completo de personas.
     */
    function obtenerPersonas() {
        return leerDesdeStorage();
    }

    /**
     * Guarda una nueva persona al final del array en localStorage.
     * @returns {boolean} true si éxito, false si localStorage está lleno.
     */
    function guardarPersona(persona) {
        // Enriquecer el objeto
        persona.id = Date.now().toString(36) + Math.random().toString(36).slice(2);
        persona.fechaRegistro = new Date().toISOString();
        persona.metodo = 'localStorage.setItem()';

        const personas = leerDesdeStorage();
        personas.push(persona);

        try {
            escribirEnStorage(personas);
            console.log(`[Storage] Persona guardada. Total: ${personas.length}`);
            return true;
        } catch (e) {
            // Manejar error de cuota excedida (generalmente 5MB)
            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                console.error('[Storage] Error: almacenamiento local lleno.');
                return false;
            }
            throw e;
        }
    }

    /**
     * Elimina una persona por su ID.
     */
    function eliminarPersona(id) {
        let personas = leerDesdeStorage();
        const lenOriginal = personas.length;
        
        personas = personas.filter(p => p.id !== id);
        
        if (personas.length < lenOriginal) {
            try {
                escribirEnStorage(personas);
                console.log(`[Storage] Persona eliminada. Id: ${id}. Total restante: ${personas.length}`);
                return true;
            } catch (e) {
                console.error('[Storage] Error al escribir tras eliminación', e);
                return false;
            }
        }
        return false; // No se encontró el ID
    }

    /**
     * Vacía el registro completamente.
     */
    function vaciarTodo() {
        try {
            localStorage.removeItem(CLAVE_STORAGE);
            console.log(`[Storage] localStorage vaciado.`);
            return true;
        } catch (e) {
            console.error('[Storage] Error al vaciar', e);
            return false;
        }
    }

    /**
     * Verifica si ya existe una persona registrada con ese número de documento.
     * Omite la verificación sobre `idExcluir` en caso de usarlo para edición futura.
     */
    function existeDocumento(documento, idExcluir = null) {
        if (!documento) return false;
        
        const personas = leerDesdeStorage();
        const existe = personas.some(p => p.documento === documento && p.id !== idExcluir);
        
        console.log(`[Storage] Verificación de documento (${documento}): ${existe ? 'encontrado' : 'no encontrado'}.`);
        return existe;
    }

    /**
     * Retorna el número total de personas almacenadas.
     */
    function obtenerTotal() {
        return leerDesdeStorage().length;
    }

    /**
     * Calcula y retorna un objeto con estadísticas detalladas sobre el catálogo.
     */
    function obtenerEstadisticas() {
        const personas = leerDesdeStorage();
        const total = personas.length;

        if (total === 0) {
            return {
                total: 0,
                totalMasculino: 0,
                totalFemenino: 0,
                edadPromedio: null,
                totalConHijos: 0,
                totalSinHijos: 0,
                porEstadoCivil: { soltero: 0, casado: 0, divorciado: 0, viudo: 0, union: 0 },
                porNacionalidad: []
            };
        }

        let masculino = 0;
        let femenino = 0;
        let sumaEdades = 0;
        let cantidadConEdad = 0;
        let conHijos = 0;
        let sinHijos = 0;

        const estadoCivilMap = {
            'Soltero/a': 0, 'Casado/a': 0, 'Divorciado/a': 0, 
            'Viudo/a': 0, 'Unión convivencial': 0
        };
        const nacionalidadMap = {};

        personas.forEach(p => {
            if (p.sexo === 'Masculino') masculino++;
            else if (p.sexo === 'Femenino') femenino++;

            if (p.edad !== null && !isNaN(p.edad)) {
                sumaEdades += p.edad;
                cantidadConEdad++;
            }

            if (p.tieneHijos === 'Si') conHijos++;
            else if (p.tieneHijos === 'No') sinHijos++;

            if (p.estadoCivil) {
                if (estadoCivilMap[p.estadoCivil] !== undefined) {
                    estadoCivilMap[p.estadoCivil]++;
                }
            }

            if (p.nacionalidad) {
                const nac = p.nacionalidad.toUpperCase();
                nacionalidadMap[nac] = (nacionalidadMap[nac] || 0) + 1;
            }
        });

        // Ordenar nacionalidades para devolver top
        const arrayNacionalidades = Object.keys(nacionalidadMap).map(k => {
            return { nombre: k, cantidad: nacionalidadMap[k] };
        }).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5);

        return {
            total,
            totalMasculino: masculino,
            totalFemenino: femenino,
            edadPromedio: cantidadConEdad > 0 ? Math.round(sumaEdades / cantidadConEdad) : null,
            totalConHijos: conHijos,
            totalSinHijos: sinHijos,
            porEstadoCivil: {
                soltero: estadoCivilMap['Soltero/a'],
                casado: estadoCivilMap['Casado/a'],
                divorciado: estadoCivilMap['Divorciado/a'],
                viudo: estadoCivilMap['Viudo/a'],
                union: estadoCivilMap['Unión convivencial']
            },
            porNacionalidad: arrayNacionalidades
        };
    }

    return {
        obtenerPersonas,
        guardarPersona,
        eliminarPersona,
        vaciarTodo,
        existeDocumento,
        obtenerTotal,
        obtenerEstadisticas
    };
})();
