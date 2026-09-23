import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, saveProject, createProject, deleteProject, type Project } from '../lib/data';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const showNotification = (text: string, type: 'success' | 'error') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }
    
    getProjects().then(data => {
      setProjects(data);
      setLoading(false);
    }).catch(() => {
      localStorage.removeItem('admin_token');
      navigate('/admin');
    });
  }, [navigate]);

  const handleSave = async (project: Project) => {
    // Validaciones
    if (!project.title.trim()) {
      showNotification('El título es obligatorio', 'error');
      return;
    }
    if (!project.description.trim()) {
      showNotification('La descripción es obligatoria', 'error');
      return;
    }
    if (project.tech.length === 0 || !project.tech[0].trim()) {
      showNotification('Debes añadir al menos una tecnología', 'error');
      return;
    }

    const token = localStorage.getItem('admin_token');
    if (!token) return navigate('/admin');

    try {
      if (projects.find(p => p.id === project.id && !(p as any).isNew)) {
        await saveProject(project, token);
      } else {
        await createProject(project, token);
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, isNew: false } : p));
      }
      setEditingId(null);
      showNotification('¡Cambios guardados con éxito!', 'success');
    } catch (e) {
      showNotification('Error guardando cambios', 'error');
    }
  };

  const executeDelete = async (id: string) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return navigate('/admin');

    const project = projects.find(p => p.id === id);
    if (project && (project as any).isNew) {
      setProjects(prev => prev.filter(p => p.id !== id));
      setConfirmDeleteId(null);
      showNotification('Proyecto cancelado', 'success');
      return;
    }

    try {
      await deleteProject(id, token);
      setProjects(prev => prev.filter(p => p.id !== id));
      setConfirmDeleteId(null);
      showNotification('Proyecto eliminado con éxito', 'success');
    } catch (e) {
      showNotification('Error borrando proyecto', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/');
  };

  const handleChange = (id: string, field: keyof Project, value: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        if (field === 'tech') {
          return { ...p, tech: value.split(',').map(s => s.trim()) };
        }
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const addNewProject = () => {
    if (editingId) {
      showNotification('Termina de editar el proyecto actual primero', 'error');
      return;
    }
    const newId = Date.now().toString();
    const newProj: Project & { isNew?: boolean } = {
      id: newId,
      title: '',
      description: '',
      tech: [],
      link: '',
      github: '',
      imageUrl: '',
      isNew: true
    };
    setProjects([newProj, ...projects]);
    setEditingId(newId);
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Cargando...</div>;
  }

  return (
    <div style={{ padding: '3rem', maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      {/* Notificación Toast Flotante */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: notification.type === 'success' ? '#10b981' : '#ef4444',
          color: '#fff',
          padding: '1rem 2rem',
          borderRadius: '0.5rem',
          fontWeight: 600,
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {notification.text}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Panel de Administración</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/')}
            style={{ padding: '0.5rem 1rem', background: '#2c2924', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
          >
            Ver Sitio
          </button>
          <button 
            onClick={handleLogout}
            style={{ padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div style={{ background: '#181612', borderRadius: '1rem', padding: '2rem', border: '1px solid #2c2924' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#c8903a' }}>Proyectos</h2>
          <button
            onClick={addNewProject}
            style={{ background: '#c8903a', color: '#000', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', fontWeight: 600, cursor: 'pointer' }}
          >
            + Añadir Proyecto
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {projects.map(project => (
            <div key={project.id} style={{ border: '1px solid #2c2924', padding: '1.5rem', borderRadius: '0.5rem', background: '#0c0b09' }}>
              {editingId === project.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input 
                    value={project.title} 
                    onChange={e => handleChange(project.id, 'title', e.target.value)}
                    placeholder="Título del proyecto *"
                    style={{ width: '100%', padding: '0.5rem', background: '#181612', border: '1px solid #2c2924', color: '#fff', borderRadius: '0.25rem' }}
                  />
                  <textarea 
                    value={project.description} 
                    onChange={e => handleChange(project.id, 'description', e.target.value)}
                    placeholder="Descripción *"
                    style={{ width: '100%', padding: '0.5rem', background: '#181612', border: '1px solid #2c2924', color: '#fff', borderRadius: '0.25rem', minHeight: '80px' }}
                  />
                  <input 
                    value={project.tech.join(', ')} 
                    onChange={e => handleChange(project.id, 'tech', e.target.value)}
                    placeholder="Tecnologías (separadas por coma) *"
                    style={{ width: '100%', padding: '0.5rem', background: '#181612', border: '1px solid #2c2924', color: '#fff', borderRadius: '0.25rem' }}
                  />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input 
                      value={project.link || ''} 
                      onChange={e => handleChange(project.id, 'link', e.target.value)}
                      placeholder="URL del sitio en vivo (opcional)"
                      style={{ flex: 1, padding: '0.5rem', background: '#181612', border: '1px solid #2c2924', color: '#fff', borderRadius: '0.25rem' }}
                    />
                    <input 
                      value={project.github || ''} 
                      onChange={e => handleChange(project.id, 'github', e.target.value)}
                      placeholder="URL del código en GitHub (opcional)"
                      style={{ flex: 1, padding: '0.5rem', background: '#181612', border: '1px solid #2c2924', color: '#fff', borderRadius: '0.25rem' }}
                    />
                    <input 
                      value={project.imageUrl || ''} 
                      onChange={e => handleChange(project.id, 'imageUrl', e.target.value)}
                      placeholder="URL de la imagen (opcional)"
                      style={{ flex: 1, padding: '0.5rem', background: '#181612', border: '1px solid #2c2924', color: '#fff', borderRadius: '0.25rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-start' }}>
                    <button onClick={() => handleSave(project)} style={{ padding: '0.5rem 1rem', background: '#c8903a', color: '#000', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 600 }}>
                      Guardar Cambios
                    </button>
                    <button onClick={() => {
                      if ((project as any).isNew) {
                        setProjects(prev => prev.filter(p => p.id !== project.id));
                      }
                      setEditingId(null);
                    }} style={{ padding: '0.5rem 1rem', background: '#2c2924', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>{project.title || '(Sin título)'}</h3>
                    <p style={{ color: '#a19a8c', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>{project.description || '(Sin descripción)'}</p>
                    <p style={{ color: '#c8903a', fontSize: '0.75rem', margin: 0 }}>Stack: {project.tech.length > 0 ? project.tech.join(', ') : 'Ninguno'}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {confirmDeleteId === project.id ? (
                      <>
                        <button 
                          onClick={() => executeDelete(project.id)}
                          style={{ padding: '0.5rem 1rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          Sí, borrar
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(null)}
                          style={{ padding: '0.5rem 1rem', background: '#2c2924', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => setEditingId(project.id)}
                          style={{ padding: '0.5rem 1rem', background: '#2c2924', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(project.id)}
                          style={{ padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
                        >
                          Borrar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
