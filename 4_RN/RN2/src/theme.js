import { Platform } from 'react-native';

export const colors = {
  paper: '#EDE4D0',
  paperDeep: '#E2D6BC',
  ink: '#1A1714',
  muted: '#6B5F52',
  line: '#C9B89A',
  oxide: '#C4451A',
  forest: '#2C4A3E',
  cream: '#F7F1E3',
  white: '#FFFBF3',
};

export const type = {
  display: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  data: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  ui: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
};

export const tools = [
  {
    href: '/camara',
    index: '01',
    title: 'Obturador',
    subtitle: 'Cámara',
    note: 'Foto frontal o trasera, linterna y vista previa.',
  },
  {
    href: '/lector',
    index: '02',
    title: 'Lectura',
    subtitle: 'Códigos',
    note: 'QR, EAN y barras en tiempo real.',
  },
  {
    href: '/ubicacion',
    index: '03',
    title: 'Fijación',
    subtitle: 'GPS',
    note: 'Coordenadas, precisión y dirección.',
  },
  {
    href: '/movimiento',
    index: '04',
    title: 'Inercia',
    subtitle: 'Sensores',
    note: 'Acelerómetro y giroscopio en tres ejes.',
  },
  {
    href: '/biometria',
    index: '05',
    title: 'Biometría',
    subtitle: 'Seguridad',
    note: 'Sensor de huella dactilar, Face ID / Reconocimiento facial o PIN.',
  },
];
