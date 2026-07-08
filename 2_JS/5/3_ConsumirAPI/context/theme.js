// 3_ConsumirAPI/context/theme.js

// aca cargo el tema guardado cuando abre la pagina
document.addEventListener("DOMContentLoaded", () => {
    const btnTema = document.getElementById("btn-cambiar-tema");

    // aca leo del localStorage que tema tenia guardado
    const temaGuardado = localStorage.getItem("tema") || "claro";

    // aca aplico el tema al cargar la pagina
    if (temaGuardado === "oscuro") {
        document.body.classList.add("dark-mode");
        btnTema.textContent = "☀️";
        btnTema.title = "Cambiar a modo claro";
    } else {
        document.body.classList.remove("dark-mode");
        btnTema.textContent = "🌙";
        btnTema.title = "Cambiar a modo oscuro";
    }

    // aca escucho el click para alternar el tema
    btnTema.addEventListener("click", () => {
        const esOscuro = document.body.classList.toggle("dark-mode");
        localStorage.setItem("tema", esOscuro ? "oscuro" : "claro");

        // aca cambio el icono: sol para oscuro, luna para claro
        btnTema.textContent = esOscuro ? "☀️" : "🌙";
        btnTema.title = esOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
    });
});
