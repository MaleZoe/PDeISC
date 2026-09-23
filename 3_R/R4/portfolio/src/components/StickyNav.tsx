import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE, navItems as links } from '../lib/constants'

export default function StickyNav() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{
            position: 'fixed',
            top: '1rem',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            backgroundColor: 'rgba(12,11,9,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(237,234,219,0.1)',
            borderRadius: '999px',
            padding: '0.4rem 0.5rem',
          }}>
            <a
              href="#"
              style={{
                fontFamily: '"Bricolage Grotesque", sans-serif',
                fontWeight: 700,
                fontSize: '0.875rem',
                color: '#edeadb',
                textDecoration: 'none',
                letterSpacing: '-0.03em',
                padding: '0.3rem 0.75rem',
                marginRight: '0.5rem',
              }}
            >
              DR
            </a>
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  color: 'rgba(237,234,219,0.55)',
                  textDecoration: 'none',
                  fontSize: '0.8125rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '999px',
                  transition: 'color 0.2s, background 0.2s',
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#edeadb'
                  e.currentTarget.style.background = 'rgba(237,234,219,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(237,234,219,0.55)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/MaleZoe"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#000',
                background: '#edeadb',
                textDecoration: 'none',
                fontSize: '0.8125rem',
                fontWeight: 600,
                padding: '0.3rem 0.875rem',
                borderRadius: '999px',
                marginLeft: '0.25rem',
                transition: 'opacity 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              GitHub
            </a>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
