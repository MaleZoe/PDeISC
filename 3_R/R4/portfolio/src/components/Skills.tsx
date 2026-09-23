import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  siHtml5,
  siCss,
  siJavascript,
  siReact,
  siTypescript,
  siCplusplus,
  siPhp,
  siMysql,
  siAnthropic,
  siChatbot,
  siOpencode,
  siGit,
  siGithub,
  siJira
} from 'simple-icons'
import WordsPullUp from './WordsPullUp'
import TechIcon from './TechIcon'
import { EASE } from '../lib/constants'

const skillGroups = [
  {
    category: 'Frontend & Frameworks',
    items: [
      { name: 'HTML5', icon: siHtml5 },
      { name: 'CSS', icon: siCss },
      { name: 'JavaScript', icon: siJavascript },
      { name: 'TypeScript', icon: siTypescript },
      { name: 'React', icon: siReact },
    ],
  },
  {
    category: 'Backend & Datos',
    items: [
      { name: 'PHP', icon: siPhp },
      { name: 'SQL', icon: siMysql },
      { name: 'C++', icon: siCplusplus },
    ],
  },
  {
    category: 'IA & Desarrollo Asistido',
    items: [
      { name: 'Claude Code', icon: siAnthropic },
      { name: 'Codex', icon: siChatbot },
      { name: 'OpenCode', icon: siOpencode },
      { name: 'SDD', icon: siChatbot },
    ],
  },
  {
    category: 'Tools & Gestión',
    items: [
      { name: 'Git', icon: siGit },
      { name: 'GitHub', icon: siGithub },
      { name: 'Jira', icon: siJira },
    ],
  },
]

export default function Skills() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-60px' })

  return (
    <section
      id="skills"
      ref={ref}
      style={{
        backgroundColor: '#000',
        padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      <div style={{ maxWidth: '72rem', margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: '0.6875rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#c8903a',
            marginBottom: '1rem',
          }}
        >
          Stack
        </motion.p>
        <WordsPullUp
          text="Tecnologías y herramientas"
          as="h2"
          delay={0.05}
          style={{
            fontFamily: '"Bricolage Grotesque", sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            letterSpacing: '-0.04em',
            color: '#edeadb',
            lineHeight: 1.05,
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
          }}
        />

        {/* Skills grid — icon tiles by category */}
        <div style={{
          border: '1px solid #2c2924',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          backgroundColor: '#181612',
        }}>
        <div className="skills-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0',
        }}>
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.category}
              className="skill-group"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: gi * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                padding: '2rem',
                borderRight: gi % 2 === 0 ? '1px solid #2c2924' : 'none',
                borderBottom: gi < skillGroups.length - 2 ? '1px solid #2c2924' : 'none',
                backgroundColor: '#181612',
              }}
            >
              {/* Category label */}
              <div style={{
                fontSize: '0.6875rem',
                color: '#c8903a',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                paddingBottom: '1rem',
                marginBottom: '1.5rem',
                borderBottom: '1px solid #2c2924',
              }}>
                {group.category}
              </div>

              {/* Icon tiles */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.25rem 2rem' }}>
                {group.items.map((item, ii) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: gi * 0.1 + ii * 0.04,
                      ease: EASE,
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '6.5rem',
                    }}
                  >
                    <TechIcon icon={item.icon} size={64} />
                    <span style={{
                      fontSize: '0.875rem',
                      color: 'rgba(237,234,219,0.7)',
                      textAlign: 'center',
                      lineHeight: 1.25,
                    }}>
                      {item.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}
