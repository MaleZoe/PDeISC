interface TechIconProps {
  icon: { path: string; hex: string }
  size?: number
}

// Algunos colores de marca oficiales son negro puro (Three.js, OpenJDK) o casi
// (GitHub) — invisibles sobre el fondo oscuro de la tile. Si el color es
// demasiado oscuro, se usa un color neutro claro en su lugar.
function readableColor(hex: string) {
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance < 0.15 ? '#edeadb' : `#${hex}`
}

export default function TechIcon({ icon, size = 20 }: TechIconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={readableColor(icon.hex)} aria-hidden="true">
      <path d={icon.path} />
    </svg>
  )
}
