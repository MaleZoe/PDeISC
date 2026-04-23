// Manejo de la barra de navegación (menú hamburguesa)
document.addEventListener('DOMContentLoaded', () => {
  const toggler = document.querySelector('.navbar-toggler');
  const collapse = document.getElementById('navbarNav');

  if (toggler && collapse) {
    toggler.addEventListener('click', () => {
      collapse.classList.toggle('show');
    });
  }
});
