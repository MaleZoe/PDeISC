/**
 * VolverInicioButton.jsx
 * Botón reutilizable para navegar rápidamente de regreso al inicio.
 */

import { Link } from 'react-router-dom';

export const VolverInicioButton = ({ className = "btn btn-outline-secondary" }) => {
  return (
    <Link to="/" className={className}>
      <i className="bi bi-arrow-left me-2"></i>
      Volver al inicio
    </Link>
  );
};
