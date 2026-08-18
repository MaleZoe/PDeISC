/**
 * TareaEstadoBadge.jsx
 * Componente visual (badge) que indica el estado (completa/pendiente) de la tarea.
 */

export const TareaEstadoBadge = ({ completada }) => {
  return completada ? (
    <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 fw-semibold d-flex align-items-center gap-1 shadow-sm">
      <i className="bi bi-check-circle-fill"></i> Completa
    </span>
  ) : (
    <span className="badge rounded-pill bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-3 py-2 fw-semibold d-flex align-items-center gap-1 shadow-sm">
      <i className="bi bi-clock-fill"></i> Pendiente
    </span>
  );
};
