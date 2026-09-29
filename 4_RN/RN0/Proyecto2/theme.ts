export type Scheme = 'light' | 'dark';

export type Theme = {
  background: string;
  surface: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  accentSoft: string;
  accentText: string;
  codeBg: string;
  codeText: string;
  sidebar: string;
  phoneBezel: string;
  navActiveBg: string;
  overlay: string;
};

export const lightTheme: Theme = {
  background: '#EAF0FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#0F172A',
  muted: '#64748B',
  border: '#E2E8F0',
  accent: '#2563EB',
  accentSoft: '#EFF6FF',
  accentText: '#FFFFFF',
  codeBg: '#0F172A',
  codeText: '#E2E8F0',
  sidebar: '#FFFFFF',
  phoneBezel: '#0F172A',
  navActiveBg: '#EFF6FF',
  overlay: 'rgba(15, 23, 42, 0.45)',
};

export const darkTheme: Theme = {
  background: '#0B1220',
  surface: '#111827',
  card: '#151C2C',
  text: '#F8FAFC',
  muted: '#94A3B8',
  border: '#243044',
  accent: '#3B82F6',
  accentSoft: '#1E3A5F',
  accentText: '#FFFFFF',
  codeBg: '#020617',
  codeText: '#CBD5E1',
  sidebar: '#0F172A',
  phoneBezel: '#020617',
  navActiveBg: '#1E3A5F',
  overlay: 'rgba(0, 0, 0, 0.6)',
};
