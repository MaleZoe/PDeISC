import { Platform } from 'react-native';

// ─── Paleta base ───────────────────────────────────────────────────────────────
export const palette = {
  // Claros
  snow:       '#FAFAFA',
  white:      '#FFFFFF',
  grayLight:  '#F3F4F6',
  grayBorder: '#E5E7EB',
  grayMuted:  '#9CA3AF',
  grayText:   '#6B7280',
  inkLight:   '#111827',

  // Oscuros
  obsidian:   '#0D1117',
  darkSurface:'#161B22',
  darkCard:   '#21262D',
  darkBorder: '#30363D',
  darkMuted:  '#8B949E',
  darkText:   '#C9D1D9',
  inkDark:    '#F0F6FC',

  // Marca
  accent:     '#E84545',   // rojo sonda
  accentDark: '#FF6B6B',
  accentGlow: 'rgba(232,69,69,0.15)',
  accentGlowDark: 'rgba(255,107,107,0.18)',
  success:    '#238636',
  successDark:'#3FB950',
  forest:     '#0D6E4E',
  forestDark: '#29A66B',
};

// ─── Tokens por modo ───────────────────────────────────────────────────────────
export const makeColors = (dark) => ({
  bg:         dark ? palette.obsidian    : palette.snow,
  surface:    dark ? palette.darkSurface : palette.white,
  card:       dark ? palette.darkCard    : palette.grayLight,
  border:     dark ? palette.darkBorder  : palette.grayBorder,
  ink:        dark ? palette.inkDark     : palette.inkLight,
  muted:      dark ? palette.darkMuted   : palette.grayText,
  accent:     dark ? palette.accentDark  : palette.accent,
  accentGlow: dark ? palette.accentGlowDark : palette.accentGlow,
  success:    dark ? palette.successDark : palette.success,
  forest:     dark ? palette.forestDark  : palette.forest,
  // Legacy compat
  paper:      dark ? palette.obsidian    : palette.snow,
  oxide:      dark ? palette.accentDark  : palette.accent,
  line:       dark ? palette.darkBorder  : palette.grayBorder,
  cream:      dark ? palette.inkDark     : palette.white,
});

// Fallback estático (para estilos que no pueden usar hook)
export const colors = makeColors(false);

// ─── Tipografía ────────────────────────────────────────────────────────────────
export const type = {
  display: Platform.select({ ios: 'Georgia', android: 'serif',      default: 'Georgia, serif' }),
  data:    Platform.select({ ios: 'Menlo',   android: 'monospace',  default: 'Menlo, Consolas, monospace' }),
  ui:      Platform.select({ ios: 'System',  android: 'sans-serif', default: 'Inter, system-ui, sans-serif' }),
};

// ─── Definición de herramientas ─────────────────────────────────────────────
export const tools = [
  {
    href: '/camara',
    index: '01',
    title: 'Obturador',
    subtitle: 'Cámara',
    note: 'Foto frontal o trasera, linterna y vista previa.',
    icon: '📷',
  },
  {
    href: '/lector',
    index: '02',
    title: 'Lectura',
    subtitle: 'Códigos',
    note: 'QR, EAN y barras en tiempo real.',
    icon: '🔲',
  },
  {
    href: '/ubicacion',
    index: '03',
    title: 'Fijación',
    subtitle: 'GPS',
    note: 'Coordenadas, precisión y dirección.',
    icon: '📍',
  },
  {
    href: '/movimiento',
    index: '04',
    title: 'Inercia',
    subtitle: 'Sensores',
    note: 'Acelerómetro y giroscopio en tres ejes.',
    icon: '📐',
  },
  {
    href: '/biometria',
    index: '05',
    title: 'Biometría',
    subtitle: 'Seguridad',
    note: 'Sensor de huella dactilar, Face ID o PIN.',
    icon: '🔐',
  },
];
