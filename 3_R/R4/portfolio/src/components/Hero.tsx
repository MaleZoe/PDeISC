import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sun, Moon } from 'lucide-react'
import { EASE as ease, navItems } from '../lib/constants'

// ── Dock nav ───────────────────────────────────────────────

function DockLink({
  item,
  mouseX,
}: {
  item: { label: string; href: string }
  mouseX: ReturnType<typeof useMotionValue<number>>
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [hovered, setHovered] = useState(false)

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const scaleRaw = useTransform(distance, [-130, 0, 130], [1, 1.5, 1])
  const scale = useSpring(scaleRaw, { mass: 0.08, stiffness: 200, damping: 14 })

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Tooltip label */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              marginBottom: '0.5rem',
              backgroundColor: 'rgba(12,11,9,0.9)',
              color: '#edeadb',
              fontSize: '0.6875rem',
              fontWeight: 500,
              letterSpacing: '0.04em',
              padding: '0.25rem 0.625rem',
              borderRadius: '0.375rem',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              border: '1px solid rgba(237,234,219,0.1)',
            }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.a
        ref={ref}
        href={item.href}
        style={{
          scale,
          transformOrigin: 'bottom center',
          display: 'inline-block',
          color: hovered ? '#edeadb' : 'rgba(237,234,219,0.65)',
          textDecoration: 'none',
          fontSize: 'clamp(0.6875rem, 1vw, 0.875rem)',
          letterSpacing: '0.01em',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          transition: 'color 0.15s',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {item.label}
      </motion.a>
    </div>
  )
}

import { Menu, X } from 'lucide-react'

function DockNav({ isLight, setIsLight }: { isLight: boolean; setIsLight: (val: boolean) => void }) {
  const mouseX = useMotionValue(Infinity)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light-mode')
    } else {
      document.body.classList.remove('light-mode')
    }
  }, [isLight])

  return (
    <>
      {/* Desktop Nav */}
      <div
        className="desktop-nav"
        onMouseMove={e => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        style={{
          backgroundColor: '#000',
          borderRadius: '0 0 1.5rem 1.5rem',
          padding: '0.65rem 2.25rem 0.75rem',
          alignItems: 'flex-end',
          gap: 'clamp(1.25rem, 3vw, 3.5rem)',
        }}
      >
        {navItems.map(item => (
          <DockLink key={item.href} item={item} mouseX={mouseX} />
        ))}
        <button
          onClick={() => setIsLight(!isLight)}
          aria-label="Toggle theme"
          title="Cambiar tema"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(237,234,219,0.65)',
            display: 'flex',
            paddingBottom: '0.1rem',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#edeadb'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(237,234,219,0.65)'}
        >
          {isLight ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {/* Mobile Nav Toggle */}
      <div 
        className="mobile-nav" 
        style={{ 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '0.75rem 1.25rem',
          backgroundColor: 'rgba(0,0,0,0.85)', 
          backdropFilter: 'blur(10px)', 
          borderRadius: '2rem', 
          marginTop: '0.5rem',
          minWidth: '200px',
          gap: '2rem'
        }}
      >
        <span style={{ color: '#edeadb', fontWeight: 600, fontSize: '0.9rem' }}>Menú</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => setIsLight(!isLight)}
            style={{ background: 'none', border: 'none', color: '#edeadb' }}
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{ background: 'none', border: 'none', color: '#edeadb' }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-nav-menu"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '0.5rem',
              marginLeft: '1rem',
              marginRight: '1rem',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              backgroundColor: 'rgba(12, 11, 9, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              border: '1px solid rgba(237,234,219,0.1)',
            }}
          >
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                style={{
                  color: '#edeadb',
                  textDecoration: 'none',
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  padding: '0.5rem',
                  borderBottom: '1px solid rgba(237,234,219,0.05)'
                }}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Word pull-up helper ────────────────────────────────────

function PullUpWord({ word, delay }: { word: string; delay: number }) {
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
      <motion.span
        style={{ display: 'inline-block' }}
        initial={{ y: '105%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay, ease }}
      >
        {word}
      </motion.span>
    </span>
  )
}

// ── Main ──────────────────────────────────────────────────

export default function Hero() {
  const [isLight, setIsLight] = useState(false)

  return (
    <section
      id="hero"
      style={{
        minHeight: '100svh',
        padding: '1rem',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* ─── Inner rounded container ─────────────────── */}
      <div
        style={{
          flex: 1,
          borderRadius: '2rem',
          overflow: 'hidden',
          position: 'relative',
          minHeight: 'calc(100svh - 2rem)',
        }}
      >
        {/* ── Background fallback color ─── */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#0a0906' }} />

        {/* ── Background image with transition ── */}
        <AnimatePresence mode="wait">
          {!isLight ? (
            <motion.img
              key="dark"
              src="/sunset_dark.jpg"
              alt="Sunset Background"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          ) : (
            <motion.img
              key="light"
              src="/sunrise_light.jpg"
              alt="Sunrise Background"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          )}
        </AnimatePresence>

        {/* Subtle dot grid — fades toward edges */}
        <div
          className="dot-grid"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.35,
            pointerEvents: 'none',
            maskImage: 'radial-gradient(ellipse 75% 65% at 50% 35%, black 20%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 35%, black 20%, transparent 100%)',
          }}
        />

        {/* Noise overlay */}
        <div
          className="noise-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.55,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />

        {/* Vignette — dark top + dark bottom */}
        <div
          className="hero-vignette"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 32%, rgba(0,0,0,0.72) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* ─── Nav pill ── centered, hangs from top ── */}
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 20,
          }}
        >
          <DockNav isLight={isLight} setIsLight={setIsLight} />
        </motion.nav>

        {/* ─── Bottom content ─────────────────────── */}
        <div
          className="keep-light"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingBottom: 'clamp(0.5rem, 2vw, 1.5rem)',
          }}
        >
          {/* 8-col / 4-col grid */}
          <div
            className="hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '8fr 4fr',
              alignItems: 'flex-end',
            }}
          >
            {/* Left — Giant name */}
            <div style={{ paddingLeft: 'clamp(0.5rem, 1.5vw, 1.25rem)' }}>
              <h1
                style={{
                  fontFamily: '"Bricolage Grotesque", sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(40px, 12vw, 130px)',
                  lineHeight: 0.88,
                  letterSpacing: '-0.06em',
                  color: '#edeadb',
                  margin: 0,
                  padding: 0,
                  wordBreak: 'break-word',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '0.3em' }}>
                  <PullUpWord word="Malena" delay={0.1} />
                  <PullUpWord word="Salvia" delay={0.2} />
                </div>
              </h1>
            </div>

            {/* Right — tagline + CTA */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                gap: '0.875rem',
                padding: 'clamp(0.75rem, 2vw, 1.5rem) clamp(0.75rem, 2vw, 1.5rem) clamp(1rem, 2.5vw, 2rem)',
              }}
            >
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease }}
                style={{
                  fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
                  color: 'rgba(237,234,219,0.62)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Full-Stack Developer Jr. | AI-Assisted Development.
                <br/>
                Estudiante de Informática. Especializada en Front-End, pero con capacidad y experiencia desarrollando en Back-End. Creo aplicaciones completas integrando herramientas de IA.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.68, ease }}
                style={{ display: 'flex' }}
              >
                <a
                  href="#projects"
                  className="cta-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    backgroundColor: '#edeadb',
                    color: '#000',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontFamily: '"Bricolage Grotesque", sans-serif',
                    fontSize: 'clamp(0.75rem, 1.1vw, 0.9375rem)',
                    padding: '0.5rem 0.625rem 0.5rem 1.125rem',
                    borderRadius: '999px',
                    letterSpacing: '-0.02em',
                    transition: 'gap 0.25s ease',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.gap = '0.9rem'
                    const circle = e.currentTarget.querySelector('.cta-circle') as HTMLElement
                    if (circle) circle.style.transform = 'scale(1.12)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.gap = '0.625rem'
                    const circle = e.currentTarget.querySelector('.cta-circle') as HTMLElement
                    if (circle) circle.style.transform = 'scale(1)'
                  }}
                >
                  Ver proyectos
                  <span
                    className="cta-circle"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 'clamp(1.875rem, 2.5vw, 2.25rem)',
                      height: 'clamp(1.875rem, 2.5vw, 2.25rem)',
                      backgroundColor: '#000',
                      borderRadius: '50%',
                      flexShrink: 0,
                      transition: 'transform 0.25s ease',
                    }}
                  >
                    <ArrowRight size={13} color="#edeadb" />
                  </span>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
