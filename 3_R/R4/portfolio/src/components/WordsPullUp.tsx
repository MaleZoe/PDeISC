import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { EASE } from '../lib/constants'

interface WordsPullUpProps {
  text: string
  className?: string
  style?: React.CSSProperties
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export default function WordsPullUp({ text, className = '', style, delay = 0, as: Tag = 'span' }: WordsPullUpProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(divRef, { once: true, margin: '-50px' })
  const words = text.split(' ')

  return (
    <div ref={divRef}>
      <Tag className={className} style={{ display: 'block', ...style }}>
        {words.map((word, i) => (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
            <motion.span
              style={{ display: 'inline-block' }}
              initial={{ y: '110%', opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{
                duration: 0.9,
                delay: delay + i * 0.08,
                ease: EASE,
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && <span style={{ display: 'inline-block', width: '0.3em' }} />}
          </span>
        ))}
      </Tag>
    </div>
  )
}
