import { Link, NavLink } from 'react-router-dom';
import { useTareas } from '../hooks/useTareas';
import { useState, useEffect } from 'react';

export const Navbar = () => {
  const { tema, toggleTema } = useTareas();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg sticky-top navbar-glass ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-body-emphasis" to="/" onClick={closeMenu}>
          <div className="bg-primary text-white rounded p-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            <i className="bi bi-check2-all fs-5"></i>
          </div>
          <span style={{ letterSpacing: '-0.5px' }}>Taskify</span>
        </Link>
        
        <div className="d-flex align-items-center gap-3">
          {/* El botón de tema está fuera del colapso para acceso rápido siempre */}
          <button
            onClick={toggleTema}
            className="theme-toggle-btn d-lg-none"
            title={tema === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {tema === 'dark' ? (
              <i className="bi bi-sun-fill text-warning fs-5"></i>
            ) : (
              <i className="bi bi-moon-stars-fill text-primary fs-5"></i>
            )}
          </button>
          
          <button
            className="navbar-toggler border-0 shadow-none px-0"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-controls="navbarNav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <i className={`bi ${isMenuOpen ? 'bi-x-lg' : 'bi-list'} fs-2 text-body-emphasis`}></i>
          </button>
        </div>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 fw-medium">
            <li className="nav-item">
              <NavLink className="nav-link text-body-secondary px-3" to="/" onClick={closeMenu}>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-body-secondary px-3" to="/crear" onClick={closeMenu}>
                Nueva Tarea
              </NavLink>
            </li>
          </ul>
          
          <button
            onClick={toggleTema}
            className="theme-toggle-btn d-none d-lg-flex"
            title={tema === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {tema === 'dark' ? (
              <i className="bi bi-sun-fill text-warning fs-5"></i>
            ) : (
              <i className="bi bi-moon-stars-fill text-primary fs-5"></i>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
