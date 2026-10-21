import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, type } from '../theme';

export function Screen({ children, padded = true, dark = false }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: dark ? colors.ink : colors.paper,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <View style={styles.webCentering}>
        {padded ? <View style={styles.pad}>{children}</View> : children}
      </View>
    </View>
  );
}

export function Masthead({ kicker, title, back = false, light = false }) {
  const ink = light ? colors.cream : colors.ink;
  const muted = light ? 'rgba(247,241,227,0.62)' : colors.muted;

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
        <Text style={[styles.mark, { color: colors.oxide }]}>SONDA</Text>
      </View>
      <Text style={[styles.title, { color: ink }]}>{title}</Text>
      <View style={[styles.rule, { backgroundColor: light ? 'rgba(247,241,227,0.22)' : colors.line }]} />
    </View>
  );
}

export function PrimaryButton({ label, onPress, tone = 'oxide', disabled, flex }) {
  const bg = tone === 'forest' ? colors.forest : colors.oxide;
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
          opacity: disabled ? 0.45 : pressed ? 0.86 : 1,
          flex: flex ? 1 : undefined,
        },
      ]}
    >
      <Text style={styles.primaryLabel}>{label}</Text>
    </Pressable>
  );
}

export function GhostButton({ label, onPress, inverted = false, flex }) {
  const border = inverted ? 'rgba(247,241,227,0.55)' : colors.ink;
  const text = inverted ? colors.cream : colors.ink;
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.ghost,
        { borderColor: border, opacity: pressed ? 0.7 : 1, flex: flex ? 1 : undefined },
      ]}
    >
      <Text style={[styles.ghostLabel, { color: text }]}>{label}</Text>
    </Pressable>
  );
}

export function DataRow({ label, value, accent = false }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, accent && { color: colors.oxide }]} selectable>
        {value}
      </Text>
    </View>
  );
}

export function Panel({ children }) {
  return <View style={styles.panel}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center' },
  webCentering: {
    flex: 1,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  pad: { flex: 1, paddingHorizontal: 22 },
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
  },
  primaryLabel: {
    color: colors.cream,
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
    borderColor: colors.ink,
    paddingHorizontal: 16,
  },
  ghostLabel: {
    color: colors.ink,
    fontFamily: type.ui,
    fontSize: 14,
    letterSpacing: 0.6,
  },
  panel: {
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  rowLabel: {
    color: colors.muted,
    fontSize: 13,
    letterSpacing: 0.4,
    flexShrink: 0,
  },
  rowValue: {
    color: colors.ink,
    fontFamily: type.data,
    fontSize: 13,
    flex: 1,
    textAlign: 'right',
  },
});
