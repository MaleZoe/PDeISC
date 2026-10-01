import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { CATALOG, type ComponentId } from './catalog';
import { ComponentCard } from './ComponentCard';
import { PhonePreview } from './PhonePreview';
import { PlaygroundProvider } from './playground';
import { darkTheme, lightTheme, type Theme } from './theme';

export default function App() {
  const system = useColorScheme();
  const [isDark, setIsDark] = useState(system === 'dark');
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <PlaygroundProvider>
      <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <AppShell
          theme={theme}
          isDark={isDark}
          onToggleTheme={() => setIsDark((v) => !v)}
        />
      </SafeAreaView>
    </PlaygroundProvider>
  );
}

function AppShell({
  theme,
  isDark,
  onToggleTheme,
}: {
  theme: Theme;
  isDark: boolean;
  onToggleTheme: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const canDockPhone = width >= 980;
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<ComponentId>('text');
  const [phoneOpen, setPhoneOpen] = useState(false);

  const selected = CATALOG.find((c) => c.id === selectedId) ?? CATALOG[0];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATALOG;
    return CATALOG.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.useFor.toLowerCase().includes(q),
    );
  }, [query]);

  const showPhone = canDockPhone;
  const mainWidth = width - (showPhone ? 380 : 0);
  const columns = mainWidth >= 920 ? 3 : mainWidth >= 540 ? 2 : 1;

  const tryComponent = (id: ComponentId) => {
    setSelectedId(id);
    if (!canDockPhone) setPhoneOpen(true);
  };

  return (
    <View style={styles.shell}>
      <View style={styles.main}>
        <View style={[styles.topBar, { borderBottomColor: theme.border }]}>
          <Text style={[styles.topTitle, { color: theme.text }]}>Catálogo Interactivo</Text>
          <TouchableOpacity onPress={onToggleTheme} style={styles.iconBtn}>
            <Text style={{ fontSize: 16 }}>{isDark ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.mainScroll} contentContainerStyle={styles.mainContent}>
          <ComponentsPage
            theme={theme}
            query={query}
            onQuery={setQuery}
            filtered={filtered}
            columns={columns}
            onTry={tryComponent}
            showHint={showPhone}
          />
        </ScrollView>
      </View>

      {showPhone ? (
        <PhonePreview item={selected} theme={theme} height={Math.min(740, height - 24)} />
      ) : null}

      <Modal visible={phoneOpen && !canDockPhone} animationType="slide" onRequestClose={() => setPhoneOpen(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
          <PhonePreview item={selected} theme={theme} framed={false} onClose={() => setPhoneOpen(false)} />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

function ComponentsPage({
  theme,
  query,
  onQuery,
  filtered,
  columns,
  onTry,
  showHint,
}: {
  theme: Theme;
  query: string;
  onQuery: (v: string) => void;
  filtered: typeof CATALOG;
  columns: number;
  onTry: (id: ComponentId) => void;
  showHint: boolean;
}) {
  const cardWidth = columns === 1 ? '100%' : columns === 2 ? '48.8%' : '32.2%';

  return (
    <View style={styles.catalog}>
      <View style={styles.heroRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.kicker, { color: theme.accent }]}>COMPONENTES NATIVOS</Text>
          <Text style={[styles.h1, { color: theme.text }]}>
            Componentes Nativos de <Text style={{ color: theme.accent }}>React Native</Text>
          </Text>
          <Text style={[styles.lead, { color: theme.muted }]}>
            Explorá, probá y personalizá los componentes principales de React Native en un entorno
            interactivo. Cada componente incluye un ejemplo funcional, código y la posibilidad de
            modificar sus propiedades en tiempo real.
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        {filtered.map((item) => (
          <View key={item.id} style={{ width: cardWidth }}>
            <ComponentCard item={item} theme={theme} onTry={() => onTry(item.id)} />
          </View>
        ))}
      </View>

      {filtered.length === 0 ? (
        <Text style={{ color: theme.muted, textAlign: 'center', marginTop: 24 }}>
          No hay componentes para “{query}”.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  shell: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  main: { flex: 1, minWidth: 0 },
  mainScroll: { flex: 1 },
  mainContent: { paddingHorizontal: 28, paddingTop: 20, paddingBottom: 48, width: '100%' },
  catalog: { width: '100%' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  topTitle: { fontWeight: '800', fontSize: 15 },
  iconBtn: { padding: 8 },
  rail: {
    width: 52,
    flexGrow: 0,
    flexShrink: 0,
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 16,
    gap: 12,
    borderRightWidth: 1,
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
  heroRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start', marginBottom: 20 },
  kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.6, marginBottom: 8 },
  h1: { fontSize: 32, fontWeight: '900', letterSpacing: -0.8, lineHeight: 38, marginBottom: 10 },
  lead: { fontSize: 15, lineHeight: 22, maxWidth: 820 },
  hint: { fontSize: 12, fontStyle: 'italic', fontWeight: '700', marginTop: 8 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchInput: { flex: 1, fontSize: 15 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    width: '100%',
  },
  tip: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tipTitle: { fontWeight: '800', fontSize: 15 },
  tipBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
  infoCard: { borderWidth: 1, borderRadius: 24, padding: 24, gap: 12 },
  homeIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  featureList: { gap: 14, marginTop: 8 },
  miniBadge: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cta: { alignSelf: 'flex-start', marginTop: 8, paddingVertical: 12, paddingHorizontal: 18, borderRadius: 14 },
  overlay: { flex: 1, flexDirection: 'row-reverse' },
  drawer: { width: 260 },
});
