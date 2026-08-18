import { Link } from 'react-router-dom';
import { TareaEstadoBadge } from './TareaEstadoBadge';

export const TareaCard = ({ tarea }) => {
  const descripcionCorta = tarea.descripcion.length > 90 
    ? `${tarea.descripcion.substring(0, 90)}...` 
    : tarea.descripcion;

  // Fecha corta para la tarjeta
  const fecha = new Date(tarea.fechaCreacion).toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <Link to={`/tarea/${tarea.id}`} className="text-decoration-none">
      <div className={`card h-100 card-premium task-card border-0 ${tarea.completada ? 'opacity-75' : ''}`}>
        <div className="card-body d-flex flex-column p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h5 className="card-title text-body-emphasis mb-0 fw-bold lh-sm pe-3" style={{ fontSize: '1.15rem' }}>
              {tarea.titulo}
            </h5>
            <TareaEstadoBadge completada={tarea.completada} />
          </div>
          
          <p className="card-text text-body-secondary mt-1 mb-4 flex-grow-1" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
            {descripcionCorta}
          </p>
          
          <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-10 mt-auto">
            <span className="text-body-secondary small d-flex align-items-center gap-1 fw-medium">
              <i className="bi bi-calendar3"></i> {fecha}
            </span>
            <div className="text-primary rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
              <i className="bi bi-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
