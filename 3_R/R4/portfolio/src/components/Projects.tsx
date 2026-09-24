import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, BrainCircuit, LayoutTemplate, Dumbbell, Gamepad2, GraduationCap, type LucideIcon } from 'lucide-react'
import WordsPullUp from './WordsPullUp'
import { EASE } from '../lib/constants'

import { useState, useEffect } from 'react';
import { getProjects, type Project as ProjectData } from '../lib/data';

interface Project {
  number: string
  name: string
  description: string
  category: string
  stack: string[]
  url: string
  live?: string
  image?: string
  icon?: LucideIcon
}

// ── Destacados — los que tienen demo/captura real ──────────

const getIconForProject = (title: string): LucideIcon => {
  const t = title.toLowerCase();
  if (t.includes('acren')) return LayoutTemplate;
  if (t.includes('criminal') || t.includes('gym')) return Dumbbell;
  if (t.includes('juego')) return Gamepad2;
  if (t.includes('escuela') || t.includes('técnica')) return GraduationCap;
  return BrainCircuit;
};

const mapDataToProject = (data: ProjectData, index: number): Project => ({
  number: String(index + 1).padStart(2, '0'),
  name: data.title,
  description: data.description,
  category: 'Web · ' + (data.tech[0] || 'App'),
  stack: data.tech,
  url: data.link || data.github || '#',
  live: data.link,
  image: undefined,
  icon: getIconForProject(data.title),
});



function CategoryBadge({ project }: { project: Project }) {
  return (
    <span
      style={{
        position: 'absolute',
        top: '0.875rem',
        right: '0.875rem',
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: '#edeadb',
        backgroundColor: 'rgba(12,11,9,0.75)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(237,234,219,0.15)',
        padding: '0.35rem 0.75rem',
        borderRadius: '999px',
      }}
    >
      {project.category.split(' · ')[0]}
    </span>
  )
}

function ProjectLinks({ project, size = 2.25 }: { project: Project; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ver demo de ${project.name}`}
          title="Ver demo en vivo"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: `${size}rem`,
            padding: `0 ${size * 0.55}rem`,
            borderRadius: '999px',
            border: '1px solid rgba(200,144,58,0.4)',
            color: '#c8903a',
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            transition: 'color 0.2s, border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(200,144,58,0.15)'
            e.currentTarget.style.borderColor = '#c8903a'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(200,144,58,0.4)'
          }}
        >
          LIVE
        </a>
      )}
      <a
        href={project.live || project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ver ${project.name}`}
        title="Ir al proyecto"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${size}rem`,
          height: `${size}rem`,
          borderRadius: '50%',
          border: '1px solid #2c2924',
          color: 'rgba(237,234,219,0.5)',
          transition: 'color 0.2s, border-color 0.2s, background 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#edeadb'
          e.currentTarget.style.borderColor = '#c8903a'
          e.currentTarget.style.background = 'rgba(200,144,58,0.1)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'rgba(237,234,219,0.5)'
          e.currentTarget.style.borderColor = '#2c2924'
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <ArrowUpRight size={size * 6.5} />
      </a>
    </div>
  )
}

// ── Card grande — usada para los 2 primeros destacados ──────

function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundColor: '#181612',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #2c2924',
        position: 'relative',
      }}
    >
      <CategoryBadge project={project} />

      <div style={{ padding: 'clamp(1.5rem, 2.5vw, 2.25rem)', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        <span style={{ fontSize: '0.75rem', color: '#c8903a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {project.category}
        </span>

        <h3 style={{
          fontFamily: '"Bricolage Grotesque", sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(1.5rem, 2.8vw, 2rem)',
          letterSpacing: '-0.03em',
          color: '#edeadb',
          lineHeight: 1.1,
          margin: 0,
        }}>
          {project.name}
        </h3>

        <p style={{ fontSize: '0.9375rem', color: '#a19a8c', lineHeight: 1.65, flex: 1, margin: 0 }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {project.stack.map(tech => (
              <span key={tech} style={{
                fontSize: '0.75rem',
                color: 'rgba(237,234,219,0.55)',
                backgroundColor: '#201e19',
                padding: '0.3rem 0.75rem',
                borderRadius: '999px',
                letterSpacing: '0.03em',
              }}>
                {tech}
              </span>
            ))}
          </div>
          <ProjectLinks project={project} />
        </div>
      </div>
    </motion.div>
  )
}


export default function Projects() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-60px' })
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then(rawProjects => {
      setFeaturedProjects(rawProjects.map(mapDataToProject));
    });
  }, []);

  if (featuredProjects.length === 0) {
    return (
      <section id="projects" ref={ref} style={{ backgroundColor: '#000', padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem)', textAlign: 'center' }}>
        <p style={{ color: '#a19a8c', marginTop: '2rem' }}>Cargando proyectos o no se encontraron proyectos. Asegúrate de que la API esté corriendo (usa <code>vercel dev</code>).</p>
      </section>
    );
  }

  return (
    <section
      id="projects"
      ref={ref}
      style={{
        backgroundColor: '#000',
        padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem)',
      }}
    >
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE }}
              style={{
                fontSize: '0.6875rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#c8903a',
                marginBottom: '1rem',
              }}
            >
              Proyectos
            </motion.p>
            <WordsPullUp
              text="Trabajo seleccionado"
              as="h2"
              delay={0.05}
              style={{
                fontFamily: '"Bricolage Grotesque", sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                letterSpacing: '-0.04em',
                color: '#edeadb',
                lineHeight: 1.05,
              }}
            />
          </div>
          <motion.a
            href="https://github.com/MaleZoe"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#edeadb',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              borderRadius: '999px',
              border: '1px solid #2c2924',
              transition: 'border-color 0.2s, background-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#c8903a'
              e.currentTarget.style.backgroundColor = 'rgba(200,144,58,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#2c2924'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Ver todos en GitHub <ArrowUpRight size={16} />
          </motion.a>
        </div>

        <div className="projects-featured-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          {featuredProjects.map((project, i) => (
            <FeaturedCard key={project.number} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
