import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import WordsPullUp from './WordsPullUp'
import { EASE } from '../lib/constants'

const ABOUT_TEXT = "Este portfolio reúne mi recorrido académico y técnico, junto con una selección de proyectos. A través de estos trabajos, reflejo mi perfil integral: aunque mi especialidad y mayor interés es el Front-End, también desarrollo y tengo sólidos conocimientos en Back-End, combinando diseño, funcionalidad, bases de datos y herramientas de IA en cada desarrollo."

function AnimatedChar({ char, index, total, scrollYProgress }: {
  char: string
  index: number
  total: number
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const start = index / total
  const end = Math.min(start + 0.08, 1)
  const opacity = useTransform(scrollYProgress, [start, end], [0.12, 1])
  return <motion.span style={{ opacity }}>{char}</motion.span>
}

function AnimatedParagraph() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.55'],
  })
  const chars = ABOUT_TEXT.split('')

  return (
    <p
      ref={ref}
      style={{
        fontSize: 'clamp(0.9375rem, 1.8vw, 1.0625rem)',
        lineHeight: 1.8,
        color: '#edeadb',
        maxWidth: '62ch',
        margin: '0 auto',
        textAlign: 'center',
      }}
      aria-label={ABOUT_TEXT}
    >
      {chars.map((char, i) => (
        <AnimatedChar
          key={i}
          char={char}
          index={i}
          total={chars.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  )
}

const stats = [
  { value: '15+', label: 'Proyectos' },
  { value: 'IA', label: 'Integrada' },
  { value: '+2', label: 'Años Exp.' },
]

export default function About() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-80px' })

  return (
    <section
      id="about"
      ref={ref}
      style={{
        backgroundColor: '#000',
        padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem) clamp(2rem, 5vw, 4rem)',
      }}
    >
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            fontSize: '0.6875rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#c8903a',
            marginBottom: '2.5rem',
          }}
        >
          Sobre mí
        </motion.p>

        {/* Headline */}
        <div style={{ marginBottom: '4rem' }}>
          <WordsPullUp
            text="Soy Malena Salvia,"
            as="h2"
            delay={0.05}
            style={{
              fontFamily: '"Bricolage Grotesque", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 5vw, 3.75rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: '#edeadb',
              marginBottom: '0.1em',
            }}
          />
          <WordsPullUp
            text="Técnica en Informática Profesional."
            as="h2"
            delay={0.2}
            style={{
              fontFamily: '"Bricolage Grotesque", sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(2rem, 5vw, 3.75rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: 'rgba(237,234,219,0.4)',
            }}
          />
        </div>

        {/* Scroll-animated paragraph */}
        <div style={{ marginBottom: '4.5rem' }}>
          <AnimatedParagraph />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            gap: '1px',
            backgroundColor: '#2c2924',
            borderRadius: '1rem',
            overflow: 'hidden',
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: '#181612',
                padding: '2rem 1.5rem',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontFamily: '"Bricolage Grotesque", sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                color: '#edeadb',
                letterSpacing: '-0.04em',
                lineHeight: 1,
                marginBottom: '0.5rem',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.6875rem',
                color: '#7d7568',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
