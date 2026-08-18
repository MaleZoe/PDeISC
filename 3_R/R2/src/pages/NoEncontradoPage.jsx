import { Link } from 'react-router-dom';

export const NoEncontradoPage = () => {
  return (
    <div className="container py-5 text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="mb-4">
        <h1 className="display-1 fw-bold text-primary opacity-50">404</h1>
      </div>
      <h2 className="mb-3">Página no encontrada</h2>
      <p className="text-secondary mb-4 fs-5" style={{ maxWidth: '500px' }}>
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <Link to="/" className="btn btn-primary rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2">
        <i className="bi bi-house-door-fill"></i>
        Regresar al inicio
      </Link>
    </div>
  );
};
