import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTareas } from '../hooks/useTareas';
import { VolverInicioButton } from '../components/VolverInicioButton';

export const EditarTareaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tareas, editarTarea } = useTareas();

  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    completada: false
  });

  const [errores, setErrores] = useState({});
  const [tareaNoEncontrada, setTareaNoEncontrada] = useState(false);

  useEffect(() => {
    const tareaAEditar = tareas.find(t => t.id === id);
    if (tareaAEditar) {
      setFormulario({
        titulo: tareaAEditar.titulo,
        descripcion: tareaAEditar.descripcion,
        completada: tareaAEditar.completada
      });
    } else {
      setTareaNoEncontrada(true);
    }
  }, [id, tareas]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value
    });

    if (errores[name]) {
      setErrores({
        ...errores,
        [name]: null
      });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    const tituloTrim = formulario.titulo.trim();
    const descTrim = formulario.descripcion.trim();

    if (!tituloTrim) {
      nuevosErrores.titulo = "El título es obligatorio.";
    } else if (tituloTrim.length < 3) {
      nuevosErrores.titulo = "El título debe tener al menos 3 caracteres.";
    }

    if (!descTrim) {
      nuevosErrores.descripcion = "La descripción es obligatoria.";
    } else if (descTrim.length < 10) {
      nuevosErrores.descripcion = "La descripción debe ser más detallada (mínimo 10 caracteres).";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      editarTarea(id, formulario);
      navigate(`/tarea/${id}`);
    }
  };

  if (tareaNoEncontrada) {
    return (
      <div className="container py-5 text-center">
        <div className="mb-4">
          <i className="bi bi-search text-secondary" style={{ fontSize: '4rem' }}></i>
        </div>
        <h2 className="mb-3">Tarea no encontrada</h2>
        <p className="text-secondary mb-4">No puedes editar una tarea que no existe.</p>
        <VolverInicioButton className="btn btn-primary rounded-pill px-4" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          
          <div className="mb-4">
            <button className="btn btn-outline-secondary" onClick={() => navigate(`/tarea/${id}`)}>
              <i className="bi bi-arrow-left me-2"></i> Volver al detalle
            </button>
          </div>

          <div className="card card-premium">
            <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
              <h2 className="mb-0 fw-bold">Editar Tarea</h2>
              <p className="text-body-secondary mt-2 mb-0">Actualiza los detalles de esta tarea.</p>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handleSubmit} noValidate>
                
                <div className="mb-4">
                  <label htmlFor="titulo" className="form-label fw-medium">Título de la tarea <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errores.titulo ? 'is-invalid' : ''}`}
                    id="titulo"
                    name="titulo"
                    placeholder="Ej. Comprar leche"
                    value={formulario.titulo}
                    onChange={handleChange}
                  />
                  {errores.titulo && <div className="invalid-feedback">{errores.titulo}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="descripcion" className="form-label fw-medium">Descripción <span className="text-danger">*</span></label>
                  <textarea
                    className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
                    id="descripcion"
                    name="descripcion"
                    rows="4"
                    placeholder="Añade más detalles sobre esta tarea..."
                    value={formulario.descripcion}
                    onChange={handleChange}
                  ></textarea>
                  {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
                </div>

                <div className="mb-4">
                  <div className="form-check form-switch form-check-reverse d-flex justify-content-between align-items-center gap-3 p-0">
                    <label className="form-check-label fw-medium text-start" htmlFor="completada">Marcar como completada al guardar</label>
                    <input
                      className="form-check-input fs-5 m-0 flex-shrink-0"
                      type="checkbox"
                      role="switch"
                      id="completada"
                      name="completada"
                      checked={formulario.completada}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <hr className="my-4 text-secondary opacity-25" />

                <div className="d-flex flex-column-reverse flex-sm-row justify-content-end gap-3">
                  <button type="button" className="btn btn-light px-4 rounded-pill" onClick={() => navigate(`/tarea/${id}`)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary px-4 shadow-sm rounded-pill d-flex align-items-center justify-content-center gap-2">
                    <i className="bi bi-save"></i> Guardar cambios
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
