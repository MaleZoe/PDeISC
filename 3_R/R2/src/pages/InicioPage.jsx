import { Link } from 'react-router-dom';
import { useTareas } from '../hooks/useTareas';
import { TareaCard } from '../components/TareaCard';

export const InicioPage = () => {
  const { tareas } = useTareas();

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-5 gap-3">
        <div>
          <h1 className="fw-bold mb-1">Mis Tareas</h1>
          <p className="text-body-secondary mb-0">Gestiona tus tareas de forma rápida y sencilla</p>
        </div>
        <Link to="/crear" className="btn btn-primary d-flex align-items-center justify-content-center gap-2 rounded-pill px-4 py-2 shadow fw-semibold">
          <i className="bi bi-plus-lg"></i>
          <span>Nueva tarea</span>
        </Link>
      </div>

      {tareas.length === 0 ? (
        <div className="text-center py-5 px-3 card-premium border-dashed bg-transparent mt-4">
          <div className="mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle text-primary" style={{ width: '80px', height: '80px' }}>
              <i className="bi bi-card-checklist fs-1"></i>
            </div>
          </div>
          <h3 className="fw-bold text-body-emphasis mb-2">Todo al día</h3>
          <p className="text-body-secondary mb-4 mx-auto" style={{ maxWidth: '400px' }}>
            No tienes tareas pendientes en este momento. Disfruta tu tiempo libre o comienza un nuevo objetivo.
          </p>
          <Link to="/crear" className="btn btn-primary rounded-pill px-4 shadow-sm fw-medium">
            <i className="bi bi-plus-lg me-2"></i> Crear mi primera tarea
          </Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {tareas.map((tarea) => (
            <div className="col" key={tarea.id}>
              <TareaCard tarea={tarea} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
