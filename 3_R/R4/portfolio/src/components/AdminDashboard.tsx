import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, saveProject, createProject, deleteProject, type Project } from '../lib/data';

type Tab = 'projects' | 'content' | 'certificates' | 'skills';

interface Certificate {
  id: string; year: string; platform: string; platform_color: string;
  title: string; description: string; url: string; featured: number; sort_order: number;
  isNew?: boolean;
}
interface Skill {
  id: string; category: string; name: string; icon_key: string; sort_order: number;
  isNew?: boolean;
}
type SiteContent = Record<string, string>;

const inputStyle = { width: '100%', padding: '0.5rem', background: '#181612', border: '1px solid #2c2924', color: '#fff', borderRadius: '0.25rem', boxSizing: 'border-box' as const };
const btnPrimary = { padding: '0.5rem 1rem', background: '#c8903a', color: '#000', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 600 };
const btnSecondary = { padding: '0.5rem 1rem', background: '#2c2924', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' };
const btnDanger = { padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('projects');
  const [notification, setNotification] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const token = localStorage.getItem('admin_token');
  useEffect(() => { if (!token) navigate('/admin'); }, [token, navigate]);

  const showNotification = (text: string, type: 'success' | 'error') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'projects', label: 'Proyectos' },
    { key: 'content', label: 'Contenido' },
    { key: 'certificates', label: 'Certificados' },
    { key: 'skills', label: 'Habilidades' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {notification && (
        <div style={{
          position: 'fixed', top: '2rem', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: notification.type === 'success' ? '#10b981' : '#ef4444',
          color: '#fff', padding: '1rem 2rem', borderRadius: '0.5rem', fontWeight: 600,
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)', zIndex: 9999,
        }}>
          {notification.text}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Panel de Administración</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => navigate('/')} style={btnSecondary}>Ver Sitio</button>
          <button onClick={() => { localStorage.removeItem('admin_token'); navigate('/'); }} style={btnDanger}>Cerrar Sesión</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', background: '#0c0b09', borderRadius: '0.75rem', padding: '0.25rem' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: '0.625rem 1rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
              background: tab === t.key ? '#c8903a' : 'transparent',
              color: tab === t.key ? '#000' : '#a19a8c',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ background: '#181612', borderRadius: '1rem', padding: '2rem', border: '1px solid #2c2924' }}>
        {tab === 'projects' && <ProjectsTab showNotification={showNotification} />}
        {tab === 'content' && <ContentTab showNotification={showNotification} />}
        {tab === 'certificates' && <CertificatesTab showNotification={showNotification} />}
        {tab === 'skills' && <SkillsTab showNotification={showNotification} />}
      </div>
    </div>
  );
}

// ── PROJECTS TAB ──────────────────────────────────────────────
function ProjectsTab({ showNotification }: { showNotification: (t: string, ty: 'success' | 'error') => void }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<(Project & { isNew?: boolean })[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then(data => { setProjects(data); setLoading(false); });
  }, []);

  const handleChange = (id: string, field: keyof Project, value: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      if (field === 'tech') return { ...p, tech: value.split(',').map(s => s.trim()) };
      return { ...p, [field]: value };
    }));
  };

  const handleSave = async (project: Project & { isNew?: boolean }) => {
    if (!project.title.trim() || !project.description.trim()) {
      showNotification('Título y descripción son obligatorios', 'error'); return;
    }
    const token = localStorage.getItem('admin_token');
    if (!token) return navigate('/admin');
    try {
      if (project.isNew) {
        await createProject(project, token);
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, isNew: false } : p));
      } else {
        await saveProject(project, token);
      }
      setEditingId(null);
      showNotification('¡Proyecto guardado!', 'success');
    } catch { showNotification('Error guardando proyecto', 'error'); }
  };

  const handleDelete = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project?.isNew) { setProjects(prev => prev.filter(p => p.id !== id)); setConfirmDeleteId(null); return; }
    const token = localStorage.getItem('admin_token');
    if (!token) return navigate('/admin');
    try {
      await deleteProject(id, token);
      setProjects(prev => prev.filter(p => p.id !== id));
      setConfirmDeleteId(null);
      showNotification('Proyecto eliminado', 'success');
    } catch { showNotification('Error eliminando', 'error'); }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#c8903a', margin: 0 }}>Proyectos</h2>
        <button onClick={() => {
          if (editingId) { showNotification('Termina de editar primero', 'error'); return; }
          const id = Date.now().toString();
          setProjects([{ id, title: '', description: '', tech: [], link: '', github: '', imageUrl: '', isNew: true }, ...projects]);
          setEditingId(id);
        }} style={btnPrimary}>+ Añadir</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {projects.map(p => (
          <div key={p.id} style={{ border: '1px solid #2c2924', padding: '1.25rem', borderRadius: '0.5rem', background: '#0c0b09' }}>
            {editingId === p.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input value={p.title} onChange={e => handleChange(p.id, 'title', e.target.value)} placeholder="Título *" style={inputStyle} />
                <textarea value={p.description} onChange={e => handleChange(p.id, 'description', e.target.value)} placeholder="Descripción *" style={{ ...inputStyle, minHeight: '70px' }} />
                <input value={p.tech.join(', ')} onChange={e => handleChange(p.id, 'tech', e.target.value)} placeholder="Tecnologías (separadas por coma)" style={inputStyle} />
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input value={p.link || ''} onChange={e => handleChange(p.id, 'link', e.target.value)} placeholder="URL en vivo" style={{ ...inputStyle, flex: 1 }} />
                  <input value={p.github || ''} onChange={e => handleChange(p.id, 'github', e.target.value)} placeholder="URL GitHub" style={{ ...inputStyle, flex: 1 }} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => handleSave(p)} style={btnPrimary}>Guardar</button>
                  <button onClick={() => { if (p.isNew) setProjects(prev => prev.filter(x => x.id !== p.id)); setEditingId(null); }} style={btnSecondary}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>{p.title || '(Sin título)'}</h3>
                  <p style={{ color: '#a19a8c', fontSize: '0.8125rem', margin: '0 0 0.25rem' }}>{p.description}</p>
                  <p style={{ color: '#c8903a', fontSize: '0.75rem', margin: 0 }}>{p.tech.join(', ')}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  {confirmDeleteId === p.id ? (
                    <><button onClick={() => handleDelete(p.id)} style={{ ...btnDanger, fontWeight: 'bold' }}>Sí, borrar</button><button onClick={() => setConfirmDeleteId(null)} style={btnSecondary}>No</button></>
                  ) : (
                    <><button onClick={() => setEditingId(p.id)} style={btnSecondary}>Editar</button><button onClick={() => setConfirmDeleteId(p.id)} style={btnDanger}>Borrar</button></>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// ── CONTENT TAB (Hero + About + Stats) ────────────────────────
function ContentTab({ showNotification }: { showNotification: (t: string, ty: 'success' | 'error') => void }) {
  const [content, setContent] = useState<SiteContent>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(data => { setContent(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error();
      showNotification('¡Contenido guardado!', 'success');
    } catch { showNotification('Error guardando contenido', 'error'); }
    setSaving(false);
  };

  const update = (key: string, value: string) => setContent(prev => ({ ...prev, [key]: value }));

  if (loading) return <p>Cargando...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero */}
      <div>
        <h3 style={{ color: '#c8903a', fontSize: '1rem', marginBottom: '1rem' }}>🏠 Hero (Inicio)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.75rem', color: '#a19a8c' }}>Tagline (título corto debajo del nombre)</label>
          <input value={content.hero_tagline || ''} onChange={e => update('hero_tagline', e.target.value)} style={inputStyle} />
          <label style={{ fontSize: '0.75rem', color: '#a19a8c' }}>Descripción del Hero</label>
          <textarea value={content.hero_description || ''} onChange={e => update('hero_description', e.target.value)} style={{ ...inputStyle, minHeight: '80px' }} />
        </div>
      </div>

      {/* About */}
      <div>
        <h3 style={{ color: '#c8903a', fontSize: '1rem', marginBottom: '1rem' }}>👤 Sobre Mí</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.75rem', color: '#a19a8c' }}>Tu nombre (título principal)</label>
          <input value={content.about_name || ''} onChange={e => update('about_name', e.target.value)} style={inputStyle} />
          <label style={{ fontSize: '0.75rem', color: '#a19a8c' }}>Subtítulo</label>
          <input value={content.about_subtitle || ''} onChange={e => update('about_subtitle', e.target.value)} style={inputStyle} />
          <label style={{ fontSize: '0.75rem', color: '#a19a8c' }}>Texto descriptivo largo</label>
          <textarea value={content.about_text || ''} onChange={e => update('about_text', e.target.value)} style={{ ...inputStyle, minHeight: '100px' }} />
        </div>
      </div>

      {/* Stats */}
      <div>
        <h3 style={{ color: '#c8903a', fontSize: '1rem', marginBottom: '1rem' }}>📊 Estadísticas</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#a19a8c' }}>Valor #{i}</label>
              <input value={content[`stat_${i}_value`] || ''} onChange={e => update(`stat_${i}_value`, e.target.value)} style={inputStyle} />
              <label style={{ fontSize: '0.75rem', color: '#a19a8c' }}>Etiqueta #{i}</label>
              <input value={content[`stat_${i}_label`] || ''} onChange={e => update(`stat_${i}_label`, e.target.value)} style={inputStyle} />
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div>
        <h3 style={{ color: '#c8903a', fontSize: '1rem', marginBottom: '1rem' }}>📬 Contacto & Redes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.75rem', color: '#a19a8c' }}>Correo electrónico de contacto</label>
          <input value={content.contact_email || ''} onChange={e => update('contact_email', e.target.value)} placeholder="salviamale08@gmail.com" style={inputStyle} />
          <label style={{ fontSize: '0.75rem', color: '#a19a8c' }}>URL perfil de GitHub</label>
          <input value={content.contact_github || ''} onChange={e => update('contact_github', e.target.value)} placeholder="https://github.com/MaleZoe" style={inputStyle} />
          <label style={{ fontSize: '0.75rem', color: '#a19a8c' }}>URL perfil de LinkedIn</label>
          <input value={content.contact_linkedin || ''} onChange={e => update('contact_linkedin', e.target.value)} placeholder="https://www.linkedin.com/in/..." style={inputStyle} />
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, alignSelf: 'flex-start', opacity: saving ? 0.6 : 1 }}>
        {saving ? 'Guardando...' : 'Guardar Todo'}
      </button>
    </div>
  );
}

// ── CERTIFICATES TAB ──────────────────────────────────────────
function CertificatesTab({ showNotification }: { showNotification: (t: string, ty: 'success' | 'error') => void }) {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/certificates').then(r => r.json()).then(data => { setCerts(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleChange = (id: string, field: string, value: string | number) => {
    setCerts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSave = async (cert: Certificate) => {
    if (!cert.title.trim() || !cert.platform.trim()) {
      showNotification('Título y plataforma son obligatorios', 'error'); return;
    }
    const token = localStorage.getItem('admin_token');
    try {
      const method = cert.isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/certificates', {
        method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(cert),
      });
      if (!res.ok) throw new Error();
      if (cert.isNew) setCerts(prev => prev.map(c => c.id === cert.id ? { ...c, isNew: false } : c));
      setEditingId(null);
      showNotification('¡Certificado guardado!', 'success');
    } catch { showNotification('Error guardando', 'error'); }
  };

  const handleDelete = async (id: string) => {
    const cert = certs.find(c => c.id === id);
    if (cert?.isNew) { setCerts(prev => prev.filter(c => c.id !== id)); setConfirmDeleteId(null); return; }
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/certificates?id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      setCerts(prev => prev.filter(c => c.id !== id));
      setConfirmDeleteId(null);
      showNotification('Certificado eliminado', 'success');
    } catch { showNotification('Error eliminando', 'error'); }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#c8903a', margin: 0 }}>Certificados</h2>
        <button onClick={() => {
          if (editingId) { showNotification('Termina de editar primero', 'error'); return; }
          const id = Date.now().toString();
          setCerts([{ id, year: '', platform: '', platform_color: '#c8903a', title: '', description: '', url: '', featured: 0, sort_order: certs.length, isNew: true }, ...certs]);
          setEditingId(id);
        }} style={btnPrimary}>+ Añadir</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {certs.map(c => (
          <div key={c.id} style={{ border: '1px solid #2c2924', padding: '1.25rem', borderRadius: '0.5rem', background: '#0c0b09' }}>
            {editingId === c.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input value={c.title} onChange={e => handleChange(c.id, 'title', e.target.value)} placeholder="Título *" style={inputStyle} />
                <input value={c.platform} onChange={e => handleChange(c.id, 'platform', e.target.value)} placeholder="Plataforma / Institución *" style={inputStyle} />
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input value={c.year} onChange={e => handleChange(c.id, 'year', e.target.value)} placeholder="Año" style={{ ...inputStyle, flex: 1 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: '#a19a8c', whiteSpace: 'nowrap' }}>Color:</label>
                    <input type="color" value={c.platform_color} onChange={e => handleChange(c.id, 'platform_color', e.target.value)} style={{ width: '40px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer' }} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#a19a8c', whiteSpace: 'nowrap' }}>
                    <input type="checkbox" checked={!!c.featured} onChange={e => handleChange(c.id, 'featured', e.target.checked ? 1 : 0)} /> Destacado
                  </label>
                </div>
                <textarea value={c.description} onChange={e => handleChange(c.id, 'description', e.target.value)} placeholder="Descripción" style={{ ...inputStyle, minHeight: '70px' }} />
                <input value={c.url || ''} onChange={e => handleChange(c.id, 'url', e.target.value)} placeholder="URL del certificado (opcional)" style={inputStyle} />
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => handleSave(c)} style={btnPrimary}>Guardar</button>
                  <button onClick={() => { if (c.isNew) setCerts(prev => prev.filter(x => x.id !== c.id)); setEditingId(null); }} style={btnSecondary}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.platform_color, display: 'inline-block' }} />
                    <span style={{ fontSize: '0.75rem', color: c.platform_color, fontWeight: 600 }}>{c.platform}</span>
                    <span style={{ fontSize: '0.75rem', color: '#7d7568' }}>· {c.year}</span>
                  </div>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>{c.title}</h3>
                  <p style={{ color: '#a19a8c', fontSize: '0.8125rem', margin: 0 }}>{c.description}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  {confirmDeleteId === c.id ? (
                    <><button onClick={() => handleDelete(c.id)} style={{ ...btnDanger, fontWeight: 'bold' }}>Sí, borrar</button><button onClick={() => setConfirmDeleteId(null)} style={btnSecondary}>No</button></>
                  ) : (
                    <><button onClick={() => setEditingId(c.id)} style={btnSecondary}>Editar</button><button onClick={() => setConfirmDeleteId(c.id)} style={btnDanger}>Borrar</button></>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// ── SKILLS TAB ────────────────────────────────────────────────
function SkillsTab({ showNotification }: { showNotification: (t: string, ty: 'success' | 'error') => void }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skills').then(r => r.json()).then(data => { setSkills(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleChange = (id: string, field: string, value: string | number) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = async (skill: Skill) => {
    if (!skill.name.trim() || !skill.category.trim()) {
      showNotification('Nombre y categoría son obligatorios', 'error'); return;
    }
    const token = localStorage.getItem('admin_token');
    try {
      const method = skill.isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/skills', {
        method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(skill),
      });
      if (!res.ok) throw new Error();
      if (skill.isNew) setSkills(prev => prev.map(s => s.id === skill.id ? { ...s, isNew: false } : s));
      setEditingId(null);
      showNotification('¡Habilidad guardada!', 'success');
    } catch { showNotification('Error guardando', 'error'); }
  };

  const handleDelete = async (id: string) => {
    const skill = skills.find(s => s.id === id);
    if (skill?.isNew) { setSkills(prev => prev.filter(s => s.id !== id)); setConfirmDeleteId(null); return; }
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/skills?id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      setSkills(prev => prev.filter(s => s.id !== id));
      setConfirmDeleteId(null);
      showNotification('Habilidad eliminada', 'success');
    } catch { showNotification('Error eliminando', 'error'); }
  };

  // Group skills by category
  const categories = [...new Set(skills.map(s => s.category))];

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#c8903a', margin: 0 }}>Habilidades</h2>
        <button onClick={() => {
          if (editingId) { showNotification('Termina de editar primero', 'error'); return; }
          const id = Date.now().toString();
          setSkills([{ id, category: categories[0] || 'Nueva Categoría', name: '', icon_key: '', sort_order: skills.length, isNew: true }, ...skills]);
          setEditingId(id);
        }} style={btnPrimary}>+ Añadir</button>
      </div>
      {categories.map(cat => (
        <div key={cat} style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#c8903a', fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #2c2924' }}>{cat}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {skills.filter(s => s.category === cat).map(s => (
              <div key={s.id} style={{ border: '1px solid #2c2924', padding: '1rem', borderRadius: '0.5rem', background: '#0c0b09' }}>
                {editingId === s.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input value={s.name} onChange={e => handleChange(s.id, 'name', e.target.value)} placeholder="Nombre *" style={inputStyle} />
                    <input value={s.category} onChange={e => handleChange(s.id, 'category', e.target.value)} placeholder="Categoría *" style={inputStyle} />
                    <input value={s.icon_key || ''} onChange={e => handleChange(s.id, 'icon_key', e.target.value)} placeholder="Clave del ícono (ej: siReact)" style={inputStyle} />
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button onClick={() => handleSave(s)} style={btnPrimary}>Guardar</button>
                      <button onClick={() => { if (s.isNew) setSkills(prev => prev.filter(x => x.id !== s.id)); setEditingId(null); }} style={btnSecondary}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{s.name}</span>
                      {s.icon_key && <span style={{ color: '#7d7568', fontSize: '0.75rem', marginLeft: '0.5rem' }}>({s.icon_key})</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {confirmDeleteId === s.id ? (
                        <><button onClick={() => handleDelete(s.id)} style={{ ...btnDanger, fontWeight: 'bold', padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>Sí</button><button onClick={() => setConfirmDeleteId(null)} style={{ ...btnSecondary, padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>No</button></>
                      ) : (
                        <><button onClick={() => setEditingId(s.id)} style={{ ...btnSecondary, padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>Editar</button><button onClick={() => setConfirmDeleteId(s.id)} style={{ ...btnDanger, padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>Borrar</button></>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
