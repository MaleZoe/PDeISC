import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink, Award } from 'lucide-react'
import WordsPullUp from './WordsPullUp'
import { EASE } from '../lib/constants'

// ── Actualiza estos datos con tus certificados reales ──────

interface Certificate {
  id: string
  year: string
  platform: string
  platformColor: string
  title: string
  description: string
  url?: string
  featured?: boolean
}
const certificates: Certificate[] = [
  {
    id: '01',
    year: '2020 — Presente',
    platform: 'Escuela Técnica N.º 5',
    platformColor: '#049fd9',
    title: 'Técnico en Informática Personal y Profesional',
    description: 'Educación secundaria técnica. Formación adicional: Diseño Web, Marketing Digital, Inteligencia Artificial. Idiomas: Inglés (C1 avanzado).',
    featured: true,
  },
  {
    id: '3',
    platform: 'Olimpiada Informática Argentina (OIA)',
    platformColor: '#f0b323',
    title: 'Participante',
    year: '2026',
    description: 'Participación en el certamen nacional. La competencia se basó en el diseño de algoritmos, estructuras de datos y programación para la resolución eficiente de múltiples problemáticas algorítmicas.',
    featured: false,
  },
  {
    id: '4',
    platform: 'Prácticas Profesionalizantes (+200hs)',
    platformColor: '#7d7568',
    title: 'Desarrolladora Web',
    year: '2026',
    description: 'Participación en dos proyectos principales: desarrollo del sitio institucional para la Técnica N.º 5; y la investigación, documentación arquitectónica y creación de tutoriales para el sitio web de la Escuela de Artes Visuales Martín A. Malharro.',
    featured: false,
  },
]

// ── Certificate card ───────────────────────────────────────

function CertCard({ cert, index }: { cert: Certificate; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      style={{
        gridColumn: cert.featured ? 'span 2' : 'span 1',
        backgroundColor: '#181612',
        border: '1px solid #2c2924',
        borderRadius: '1rem',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
        transition: 'border-color 0.3s',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{ borderColor: 'rgba(200,144,58,0.35)' }}
    >
      {/* Accent line top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '1.75rem',
          right: '1.75rem',
          height: '2px',
          background: `linear-gradient(90deg, ${cert.platformColor}55, transparent)`,
          borderRadius: '0 0 2px 2px',
        }}
      />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {cert.featured ? (
            <Award size={14} color={cert.platformColor} />
          ) : null}
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: cert.platformColor,
              fontFamily: '"Bricolage Grotesque", sans-serif',
            }}
          >
            {cert.platform}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#7d7568', letterSpacing: '0.06em' }}>
            {cert.year}
          </span>
          {cert.url && cert.url !== '#' && (
            <a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver certificado: ${cert.title}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: '50%',
                border: '1px solid #2c2924',
                color: 'rgba(237,234,219,0.35)',
                transition: 'color 0.2s, border-color 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#edeadb'
                e.currentTarget.style.borderColor = 'rgba(237,234,219,0.3)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(237,234,219,0.35)'
                e.currentTarget.style.borderColor = '#2c2924'
              }}
            >
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>

      {/* Id */}
      <span style={{ fontSize: '0.8125rem', color: '#3d3830', fontFamily: '"Bricolage Grotesque", sans-serif', letterSpacing: '0.08em' }}>
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Title */}
      <h3
        style={{
          fontFamily: '"Bricolage Grotesque", sans-serif',
          fontWeight: cert.featured ? 700 : 600,
          fontSize: cert.featured ? 'clamp(1.5rem, 3vw, 2rem)' : 'clamp(1.25rem, 2vw, 1.5rem)',
          color: '#edeadb',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          margin: 0,
        }}
      >
        {cert.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '1rem',
          color: '#7d7568',
          lineHeight: 1.65,
          margin: 0,
          maxWidth: cert.featured ? '56ch' : '40ch',
        }}
      >
        {cert.description}
      </p>
    </motion.div>
  )
}

// ── Main section ───────────────────────────────────────────

export default function Certificates() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-60px' })

  return (
    <section
      id="certificates"
      ref={ref}
      aria-label="Certificados y logros"
      style={{
        backgroundColor: '#000',
        padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem)',
      }}
    >
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        {/* Header */}
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
          Educación
        </motion.p>

        <WordsPullUp
          text="Formación académica"
          as="h2"
          delay={0.05}
          style={{
            fontFamily: '"Bricolage Grotesque", sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            letterSpacing: '-0.04em',
            color: '#edeadb',
            lineHeight: 1.05,
            marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
          }}
        />

        {/* Grid */}
        <div
          className="cert-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem',
          }}
        >
          {certificates.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
