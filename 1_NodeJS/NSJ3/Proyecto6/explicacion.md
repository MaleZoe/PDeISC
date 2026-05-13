# Explicación del Proyecto 6 - Registro Académico Pro

Este proyecto es la culminación de la suite, aplicando validaciones complejas y renderizado dinámico de datos de usuario.

## Características de Validación
1. **Real-Time Feedback**: Se utilizan eventos `input` para validar cada campo mientras el usuario escribe, aplicando clases `is-valid` o `is-invalid` al instante.
2. **Restricción de Caracteres**: El campo de nombre utiliza expresiones regulares (Regex) para impedir el ingreso de números o símbolos extraños.
3. **Lógica de Edad**: Se calcula la edad exacta restando la fecha de nacimiento de la fecha actual, validando que no supere los 120 años (criterio académico).
4. **Formato Estanga**: La fecha de alta se muestra estrictamente en formato `DD/MM/AA`.

## Interfaz de Usuario (UI)
- **Previsualización Dinámica**: Al enviar el formulario, los datos se inyectan en una "Tarjeta de Perfil" lateral, extrayendo la inicial para un avatar dinámico.
- **Responsividad**: El diseño utiliza el sistema de grillas de Bootstrap para adaptarse a dispositivos móviles, apilando el formulario y la previsualización.
- **Limpieza**: Una vez procesados los datos, el formulario se resetea automáticamente.
