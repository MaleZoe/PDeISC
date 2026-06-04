/* sección validaciones */

export function validarNombre(v) {
    if (!v) return "Obligatorio";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ' ]+$/.test(v)) return "Solo letras y apóstrofes";
    const palabras = v.trim().split(/\s+/);
    if (palabras.length < 2) return "Ingresá nombre y apellido";
    return "";
}

export function validarEmail(v) {
    if (!v) return "Obligatorio";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Email inválido";
    return "";
}

export function validarEdad(v) {
    if (v === "") return "Obligatorio";
    const e = parseInt(v);
    if (isNaN(e) || e < 0 || e > 120) return "Edad entre 0 y 120";
    return "";
}

export function calcularEdad(f) {
    const hoy = new Date();
    const nac = new Date(f);
    let e = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) e--;
    return e;
}

export function formatearFecha(f) {
    const d = new Date(f);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getFullYear()).slice(-2)}`;
}
