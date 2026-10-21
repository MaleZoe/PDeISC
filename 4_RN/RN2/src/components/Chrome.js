import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { makeColors, type } from '../theme';

// ─── Screen ────────────────────────────────────────────────────────────────────
// dark prop: force dark bg (for camera/scanner full-screen views)
export function Screen({ children, padded = true, dark: forceDark }) {
  const scheme = useColorScheme();
  const dark = forceDark !== undefined ? forceDark : scheme === 'dark';
  const c = makeColors(dark);
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: c.bg,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      {padded ? <View style={styles.pad}>{children}</View> : children}
    </View>
  );
}

// ─── Masthead ──────────────────────────────────────────────────────────────────
export function Masthead({ kicker, title, back = false, light = false }) {
  const scheme = useColorScheme();
  const dark = light ? true : scheme === 'dark';
  const c = makeColors(dark);

  const ink = c.ink;
  const muted = c.muted;
  const rule = c.border;

  return (
    <View style={styles.masthead}>
      <View style={styles.mastheadRow}>
        {back ? (
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              router.back();
            }}
            hitSlop={12}
            style={styles.back}
          >
            <Text style={[styles.backMark, { color: ink }]}>←</Text>
            <Text style={[styles.backLabel, { color: ink }]}>Índice</Text>
          </Pressable>
        ) : (
          <Text style={[styles.kicker, { color: muted }]}>{kicker}</Text>
        )}
        <Text style={[styles.mark, { color: c.accent }]}>SONDA</Text>
      </View>
      <Text style={[styles.title, { color: ink }]}>{title}</Text>
      <View style={[styles.rule, { backgroundColor: rule }]} />
    </View>
  );
}

// ─── PrimaryButton ─────────────────────────────────────────────────────────────
export function PrimaryButton({ label, onPress, tone = 'accent', disabled, flex }) {
  const scheme = useColorScheme();
  const c = makeColors(scheme === 'dark');
  const bg = tone === 'forest' ? c.forest : c.accent;
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.primary,
        {
          backgroundColor: bg,
          opacity: disabled ? 0.4 : pressed ? 0.82 : 1,
          flex: flex ? 1 : undefined,
        },
      ]}
    >
      <Text style={styles.primaryLabel}>{label}</Text>
    </Pressable>
  );
}

// ─── GhostButton ──────────────────────────────────────────────────────────────
export function GhostButton({ label, onPress, inverted = false, flex }) {
  const scheme = useColorScheme();
  const dark = inverted ? true : scheme === 'dark';
  const c = makeColors(dark);
  const border = c.border;
  const text = c.ink;
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.ghost,
        {
          borderColor: border,
          opacity: pressed ? 0.7 : 1,
          flex: flex ? 1 : undefined,
        },
      ]}
    >
      <Text style={[styles.ghostLabel, { color: text }]}>{label}</Text>
    </Pressable>
  );
}

// ─── DataRow ──────────────────────────────────────────────────────────────────
export function DataRow({ label, value, accent = false }) {
  const scheme = useColorScheme();
  const c = makeColors(scheme === 'dark');
  return (
    <View style={[styles.row, { borderBottomColor: c.border }]}>
      <Text style={[styles.rowLabel, { color: c.muted }]}>{label}</Text>
      <Text
        style={[styles.rowValue, { color: accent ? c.accent : c.ink }]}
        selectable
      >
        {value}
      </Text>
    </View>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────
export function Panel({ children }) {
  const scheme = useColorScheme();
  const c = makeColors(scheme === 'dark');
  return (
    <View style={[styles.panel, { backgroundColor: c.surface, borderColor: c.border }]}>
      {children}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1 },
  // 80% of available width, not centered via maxWidth
  pad: { flex: 1, paddingHorizontal: '10%' },

  masthead: { paddingTop: 10, paddingBottom: 8 },
  mastheadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kicker: {
    fontFamily: type.ui,
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  mark: {
    fontFamily: type.ui,
    fontSize: 11,
    letterSpacing: 2.4,
    fontWeight: '700',
  },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backMark: { fontSize: 18, lineHeight: 20 },
  backLabel: {
    fontFamily: type.ui,
    fontSize: 13,
    letterSpacing: 0.4,
  },
  title: {
    fontFamily: type.display,
    fontSize: 34,
    lineHeight: 38,
    marginTop: 14,
    letterSpacing: -0.6,
  },
  rule: { height: 1, marginTop: 16 },

  primary: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 4,
  },
  primaryLabel: {
    color: '#FFFFFF',
    fontFamily: type.ui,
    fontSize: 15,
    letterSpacing: 0.8,
    fontWeight: '600',
  },

  ghost: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  ghostLabel: {
    fontFamily: type.ui,
    fontSize: 14,
    letterSpacing: 0.6,
  },

  panel: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    fontSize: 13,
    letterSpacing: 0.4,
    fontFamily: type.ui,
    flexShrink: 0,
  },
  rowValue: {
    fontFamily: type.data,
    fontSize: 13,
    flex: 1,
    textAlign: 'right',
  },
});
