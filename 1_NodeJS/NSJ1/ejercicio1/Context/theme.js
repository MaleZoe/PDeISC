// aca manejamos el tema de la pagina
export const toggleTheme = (currentTheme) => {
    const newTheme = currentTheme === 'claro' ? 'oscuro' : 'claro';
    localStorage.setItem('theme', newTheme);
    return newTheme;
};

export const loadTheme = () => {
    return localStorage.getItem('theme') || 'claro';
};
