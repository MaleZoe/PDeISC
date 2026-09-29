import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { CatalogItem } from './catalog';
import { ComponentDemo, liveCode } from './demos';
import { usePlayground } from './playground';
import type { Theme } from './theme';

const SIZES = [12, 14, 16, 20, 24];
const WEIGHTS: Array<{ label: string; value: '400' | '600' | '700' | '800' }> = [
  { label: 'Regular', value: '400' },
  { label: 'SemiBold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Extra', value: '800' },
];
const COLORS = ['#3B82F6', '#0F172A', '#E15554', '#16A34A', '#7C3AED', '#EA580C'];

export function PhonePreview({
  item,
  theme,
  onClose,
  framed = true,
  height = 680,
}: {
  item: CatalogItem;
  theme: Theme;
  onClose?: () => void;
  framed?: boolean;
  height?: number;
}) {
  const { state, set } = usePlayground();
  const [tab, setTab] = useState<'vista' | 'codigo'>('vista');

  const inner = (
    <View style={[styles.screen, { backgroundColor: theme.surface }]}>
      <View style={[styles.status, { justifyContent: 'flex-end' }]}>
        {onClose ? (
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <Text style={{ color: theme.muted, fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ height: 18 }} />
        )}
      </View>

      <Text style={[styles.title, { color: theme.text }]}>{item.name}</Text>
      <Text style={[styles.subtitle, { color: theme.muted }]}>{item.description}</Text>

      <View style={[styles.tabs, { backgroundColor: theme.accentSoft }]}>
        <TouchableOpacity
          style={[styles.tab, tab === 'vista' && { backgroundColor: theme.accent }]}
          onPress={() => setTab('vista')}
        >
          <Text style={{ color: tab === 'vista' ? '#fff' : theme.text, fontWeight: '700', fontSize: 13 }}>
            Vista
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'codigo' && { backgroundColor: theme.accent }]}
          onPress={() => setTab('codigo')}
        >
          <Text style={{ color: tab === 'codigo' ? '#fff' : theme.text, fontWeight: '700', fontSize: 13 }}>
            Código
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        {tab === 'vista' ? (
          <>
            <View style={styles.preview}>
              <ComponentDemo id={item.id} theme={theme} />
            </View>

            <Text style={[styles.section, { color: theme.text }]}>Editar propiedades</Text>
            <PropsEditor id={item.id} theme={theme} />
          </>
        ) : (
          <View style={[styles.code, { backgroundColor: theme.codeBg }]}>
            <Text style={styles.jsx}>JSX</Text>
            <Text style={[styles.codeText, { color: theme.codeText }]}>{liveCode(item.id, state)}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  if (!framed) return inner;

  return (
    <View style={styles.frameWrap}>
      <View style={[styles.frame, { borderColor: theme.phoneBezel, backgroundColor: theme.phoneBezel, height }]}>
        {inner}
      </View>
    </View>
  );
}

function PropsEditor({ id, theme }: { id: CatalogItem['id']; theme: Theme }) {
  const { state, set } = usePlayground();

  if (id === 'text') {
    return (
      <View style={{ gap: 12 }}>
        <Label theme={theme} text="Color">
          <View style={styles.swatches}>
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => set('textColor', c)}
                style={[
                  styles.swatch,
                  { backgroundColor: c, borderColor: state.textColor === c ? theme.text : 'transparent' },
                ]}
              />
            ))}
            <Text style={{ color: theme.muted, fontSize: 12 }}>{state.textColor}</Text>
          </View>
        </Label>
        <Label theme={theme} text="Tamaño">
          <View style={styles.chips}>
            {SIZES.map((n) => (
              <Chip key={n} active={state.textSize === n} theme={theme} label={String(n)} onPress={() => set('textSize', n)} />
            ))}
          </View>
        </Label>
        <Label theme={theme} text="Peso">
          <View style={styles.chips}>
            {WEIGHTS.map((w) => (
              <Chip
                key={w.value}
                active={state.textWeight === w.value}
                theme={theme}
                label={w.label}
                onPress={() => set('textWeight', w.value)}
              />
            ))}
          </View>
        </Label>
      </View>
    );
  }

  if (id === 'view') {
    return (
      <View style={{ gap: 12 }}>
        <Label theme={theme} text="Fondo">
          <View style={styles.swatches}>
            {['#DBEAFE', '#F3E8FF', '#DCFCE7', '#FEE2E2', '#FEF3C7'].map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => set('viewBg', c)}
                style={[styles.swatch, { backgroundColor: c, borderColor: state.viewBg === c ? theme.text : 'transparent' }]}
              />
            ))}
          </View>
        </Label>
        <Label theme={theme} text="Radio">
          <View style={styles.chips}>
            {[6, 12, 20, 28].map((n) => (
              <Chip key={n} active={state.viewRadius === n} theme={theme} label={`${n}`} onPress={() => set('viewRadius', n)} />
            ))}
          </View>
        </Label>
      </View>
    );
  }

  if (id === 'image') {
    return (
      <Label theme={theme} text="Bordes">
        <View style={styles.chips}>
          {[4, 12, 20, 32].map((n) => (
            <Chip key={n} active={state.imageRadius === n} theme={theme} label={`${n}`} onPress={() => set('imageRadius', n)} />
          ))}
        </View>
      </Label>
    );
  }

  if (id === 'button') {
    return (
      <Label theme={theme} text="Título">
        <TextInput
          value={state.buttonTitle}
          onChangeText={(v) => set('buttonTitle', v)}
          style={[styles.field, { color: theme.text, borderColor: theme.border }]}
        />
      </Label>
    );
  }

  if (id === 'activity') {
    return (
      <Label theme={theme} text="Tamaño">
        <View style={styles.chips}>
          <Chip active={state.spinnerSize === 'small'} theme={theme} label="small" onPress={() => set('spinnerSize', 'small')} />
          <Chip active={state.spinnerSize === 'large'} theme={theme} label="large" onPress={() => set('spinnerSize', 'large')} />
        </View>
      </Label>
    );
  }

  return (
    <Text style={{ color: theme.muted, fontSize: 12 }}>
      Interactúa con el ejemplo de arriba. Los cambios se ven al instante.
    </Text>
  );
}

function Label({ theme, text, children }: { theme: Theme; text: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: theme.text, fontWeight: '700', fontSize: 13 }}>{text}</Text>
      {children}
    </View>
  );
}

function Chip({
  active,
  theme,
  label,
  onPress,
}: {
  active: boolean;
  theme: Theme;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        { borderColor: theme.border, backgroundColor: active ? theme.accent : 'transparent' },
      ]}
    >
      <Text style={{ color: active ? '#fff' : theme.text, fontSize: 12, fontWeight: '600' }}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  frameWrap: {
    width: 380,
    flexGrow: 0,
    flexShrink: 0,
    paddingHorizontal: 12,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  frame: {
    borderRadius: 40,
    borderWidth: 10,
    overflow: 'hidden',
    maxHeight: '100%',
  },
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  clock: {
    fontWeight: '700',
    fontSize: 13,
    width: 48,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  rnBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rnBadgeText: { color: '#fff', fontSize: 12 },
  tsBadge: {
    backgroundColor: '#2563EB',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tsBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 13, lineHeight: 18, marginTop: 4, marginBottom: 12 },
  tabs: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  preview: {
    minHeight: 80,
    marginBottom: 16,
  },
  section: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  swatches: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  swatch: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  field: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  code: { borderRadius: 12, padding: 12, minHeight: 160 },
  jsx: { position: 'absolute', right: 10, top: 8, color: '#64748B', fontSize: 10, fontWeight: '700' },
  codeText: { fontFamily: 'monospace', fontSize: 12, lineHeight: 18 },
});
