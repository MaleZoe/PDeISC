// aca manejo el modo oscuro y claro
const btnTheme = document.getElementById('btn-theme');
const themeStyle = document.getElementById('theme-style');

// cargo el tema guardado o por defecto claro
let currentTheme = localStorage.getItem('theme') || 'light';

// funcion que aplica el tema y cambia el href del css
const applyTheme = (theme) => {
  if (theme === 'dark') {
    themeStyle.href = '/styles/dark.css';
    if(btnTheme) btnTheme.textContent = '☀️ Modo Claro';
  } else {
    themeStyle.href = '/styles/light.css';
    if(btnTheme) btnTheme.textContent = '🌙 Modo Oscuro';
  }
  localStorage.setItem('theme', theme);
};

// inicializo al cargar
applyTheme(currentTheme);

// evento del boton si existe en la pagina
if (btnTheme) {
  btnTheme.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
  });
}
