import React from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Theme } from './theme';

type Page = 'home' | 'components' | 'about';

export function Sidebar({
  theme,
  page,
  onNavigate,
  isDark,
  onToggleTheme,
  fullWidth,
  onToggleMenu,
}: {
  theme: Theme;
  page: Page;
  onNavigate: (next: Page) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  fullWidth?: boolean;
  onToggleMenu?: () => void;
}) {
  return (
    <View style={[styles.sidebar, fullWidth && { width: '100%' }, { backgroundColor: theme.sidebar, borderColor: theme.border }]}>
      <View style={styles.brand}>
        <TouchableOpacity onPress={onToggleMenu} style={[styles.hamburger, { borderColor: theme.border }]} accessibilityLabel="Cerrar menú">
          <View style={[styles.bar, { backgroundColor: theme.text }]} />
          <View style={[styles.bar, { backgroundColor: theme.text }]} />
          <View style={[styles.bar, { backgroundColor: theme.text }]} />
        </TouchableOpacity>
        <View style={styles.logoMark}>
          <Text style={styles.logoAtom}>⚛</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.brandTitle, { color: theme.text }]}>React Native +</Text>
          <Text style={[styles.brandTitle, { color: theme.text }]}>TypeScript</Text>
        </View>
      </View>

      <View style={styles.nav}>
        <NavItem label="Inicio" icon="⌂" active={page === 'home'} theme={theme} onPress={() => onNavigate('home')} />
        <NavItem
          label="Componentes"
          icon="☰"
          active={page === 'components'}
          theme={theme}
          onPress={() => onNavigate('components')}
        />
        <NavItem
          label="Sobre el proyecto"
          icon="ℹ"
          active={page === 'about'}
          theme={theme}
          onPress={() => onNavigate('about')}
        />
      </View>

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        onPress={onToggleTheme}
        style={[styles.themeBtn, { backgroundColor: theme.accentSoft, borderColor: theme.border }]}
      >
        <Text style={{ fontSize: 16 }}>{isDark ? '🌙' : '☀️'}</Text>
        <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13 }}>
          {isDark ? 'Modo oscuro' : 'Modo claro'}
        </Text>
      </TouchableOpacity>

      <View style={[styles.footer, { borderColor: theme.border }]}>
        <Text style={{ fontSize: 16 }}>‹›</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.footerTitle, { color: theme.text }]}>Desarrollá apps más sólidas</Text>
          <Text style={{ color: theme.muted, fontSize: 11 }}>React Native + TypeScript</Text>
        </View>
      </View>
    </View>
  );
}

function NavItem({
  label,
  icon,
  active,
  theme,
  onPress,
}: {
  label: string;
  icon: string;
  active: boolean;
  theme: Theme;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.navItem,
        active && { backgroundColor: theme.navActiveBg },
      ]}
    >
      <Text style={{ color: active ? theme.accent : theme.muted, fontSize: 16 }}>{icon}</Text>
      <Text style={{ color: active ? theme.accent : theme.text, fontWeight: active ? '700' : '500', fontSize: 14 }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    flexGrow: 0,
    flexShrink: 0,
    alignSelf: 'stretch',
    borderRightWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 18,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  hamburger: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  bar: {
    width: 14,
    height: 2,
    borderRadius: 1,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoAtom: {
    color: '#fff',
    fontSize: 20,
  },
  brandTitle: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16,
  },
  nav: {
    gap: 6,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  themeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
  },
  footerTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
});
