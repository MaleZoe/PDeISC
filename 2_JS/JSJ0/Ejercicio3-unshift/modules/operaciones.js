
// mete un color al inicio usando unshift
export function agregarColorAlInicio(color, colores) {
    const copia = [...colores];
    copia.unshift(color);
    return copia;
}

// mete una tarea al inicio usando unshift
export function agregarTareaUrgente(tarea, tareas) {
    const copia = [...tareas];
    copia.unshift(tarea);
    return copia;
}

// mete un usuario al inicio usando unshift
export function agregarUsuarioConectado(usuario, usuarios) {
    const copia = [...usuarios];
    copia.unshift(usuario);
    return copia;
}
