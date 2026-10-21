import { Platform } from 'react-native';

// ─── Paleta base ───────────────────────────────────────────────────────────────
export const palette = {
  snow:       '#FAFAFA',
  white:      '#FFFFFF',
  grayLight:  '#F3F4F6',
  grayBorder: '#E5E7EB',
  grayMuted:  '#9CA3AF',
  grayText:   '#6B7280',
  inkLight:   '#111827',

  obsidian:   '#0D1117',
  darkSurface:'#161B22',
  darkCard:   '#21262D',
  darkBorder: '#30363D',
  darkMuted:  '#8B949E',
  darkText:   '#C9D1D9',
  inkDark:    '#F0F6FC',

  accent:     '#E84545',
  accentDark: '#FF6B6B',
  accentGlow: 'rgba(232,69,69,0.10)',
  accentGlowDark: 'rgba(255,107,107,0.14)',
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
});

// ─── Tipografía ────────────────────────────────────────────────────────────────
export const type = {
  display: Platform.select({ ios: 'Georgia', android: 'serif',      default: 'Georgia, serif' }),
  data:    Platform.select({ ios: 'Menlo',   android: 'monospace',  default: 'Menlo, Consolas, monospace' }),
  ui:      Platform.select({ ios: 'System',  android: 'sans-serif', default: 'Inter, system-ui, sans-serif' }),
};

// ─── Herramientas ──────────────────────────────────────────────────────────────
export const tools = [
  {
    href: '/camara',
    index: '01',
    title: 'Cámara',
    subtitle: 'Obturador',
    note: 'Foto frontal / trasera y linterna.',
    ionicon: 'camera-outline',
  },
  {
    href: '/lector',
    index: '02',
    title: 'Códigos',
    subtitle: 'Lectura',
    note: 'QR, EAN y barras en vivo.',
    ionicon: 'scan-outline',
  },
  {
    href: '/ubicacion',
    index: '03',
    title: 'GPS',
    subtitle: 'Fijación',
    note: 'Coordenadas y dirección.',
    ionicon: 'locate-outline',
  },
  {
    href: '/movimiento',
    index: '04',
    title: 'Sensores',
    subtitle: 'Inercia',
    note: 'Acelerómetro y giroscopio.',
    ionicon: 'pulse-outline',
  },
  {
    href: '/biometria',
    index: '05',
    title: 'Biometría',
    subtitle: 'Seguridad',
    note: 'Huella, Face ID o PIN.',
    ionicon: 'finger-print-outline',
  },
];
