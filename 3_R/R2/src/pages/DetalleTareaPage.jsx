import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTareas } from '../hooks/useTareas';
import { TareaEstadoBadge } from '../components/TareaEstadoBadge';
import { VolverInicioButton } from '../components/VolverInicioButton';

export const DetalleTareaPage = () => {
  const { id } = useParams();
  const { tareas, cambiarEstadoTarea } = useTareas();

  const tarea = tareas.find(t => t.id === id);

  if (!tarea) {
    return (
      <div className="container py-5 text-center">
        <div className="mb-4">
          <i className="bi bi-search text-secondary" style={{ fontSize: '4rem' }}></i>
        </div>
        <h2 className="mb-3">Tarea no encontrada</h2>
        <p className="text-secondary mb-4">La tarea que estás buscando no existe o ha sido eliminada.</p>
        <VolverInicioButton className="btn btn-primary rounded-pill px-4" />
      </div>
    );
  }

  const fechaFormateada = new Date(tarea.fechaCreacion).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const handleToggleEstado = () => {
    setMostrarConfirmacion(true);
  };

  const confirmarCambio = () => {
    cambiarEstadoTarea(tarea.id, !tarea.completada);
    setMostrarConfirmacion(false);
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <VolverInicioButton />
      </div>

      <div className="card card-premium overflow-hidden">
        <div className="card-header bg-primary bg-opacity-10 py-4 px-4 px-md-5 border-0 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <h2 className="mb-0 fw-bold text-body-emphasis">{tarea.titulo}</h2>
          <TareaEstadoBadge completada={tarea.completada} />
        </div>
        <div className="card-body p-4 p-md-5">
          <div className="mb-4">
            <h6 className="text-uppercase text-body-secondary fw-semibold mb-2" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>Descripción</h6>
            <p className="fs-5" style={{ whiteSpace: 'pre-wrap' }}>{tarea.descripcion}</p>
          </div>
          <hr className="text-secondary opacity-25" />
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mt-4">
            <div className="d-flex align-items-center text-body-secondary">
              <i className="bi bi-calendar-event me-2"></i>
              <span>Creada el {fechaFormateada}</span>
            </div>
            <div className="d-flex flex-wrap justify-content-end gap-2">
              <Link 
                to={`/editar/${tarea.id}`}
                className="btn btn-outline-primary shadow-sm rounded-pill px-4 d-flex align-items-center justify-content-center gap-2"
              >
                <i className="bi bi-pencil"></i> Editar
              </Link>
              <button 
                onClick={handleToggleEstado}
                className={`btn btn-${tarea.completada ? 'outline-warning' : 'success'} shadow-sm rounded-pill px-4 d-flex align-items-center justify-content-center gap-2`}
              >
                {tarea.completada ? (
                  <><i className="bi bi-arrow-counterclockwise"></i> Marcar como pendiente</>
                ) : (
                  <><i className="bi bi-check-lg"></i> Marcar como completada</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {mostrarConfirmacion && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content card-premium border-0 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Confirmar acción</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarConfirmacion(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body py-4 text-center">
                <div className={`mb-3 text-${tarea.completada ? 'warning' : 'success'}`}>
                  <i className={`bi ${tarea.completada ? 'bi-arrow-counterclockwise' : 'bi-check-circle-fill'}`} style={{ fontSize: '3rem' }}></i>
                </div>
                <p className="fs-5 mb-0">
                  ¿Estás seguro de que deseas {tarea.completada ? "marcar como pendiente" : "marcar como completada"} esta tarea?
                </p>
              </div>
              <div className="modal-footer border-0 pt-0 d-flex justify-content-center gap-2">
                <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setMostrarConfirmacion(false)}>
                  Cancelar
                </button>
                <button type="button" className={`btn btn-${tarea.completada ? 'warning' : 'success'} rounded-pill px-4 shadow-sm text-white`} onClick={confirmarCambio}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
