import { Pressable, StyleSheet, Text, View, useColorScheme, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { makeColors, type } from '../theme';

/* ───────────────────────── Screen ───────────────────────── */
export function Screen({ children, padded = true, dark: forceDark }) {
  const scheme = useColorScheme();
  const dark = forceDark !== undefined ? forceDark : scheme === 'dark';
  const c = makeColors(dark);
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: c.bg,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {padded ? <View style={styles.pad}>{children}</View> : children}
    </View>
  );
}

/* ───────────────────────── Masthead ───────────────────────── */
export function Masthead({ kicker, title, back = false, light = false }) {
  const scheme = useColorScheme();
  const dark = light || scheme === 'dark';
  const c = makeColors(dark);

  return (
    <View style={styles.masthead}>
      <View style={styles.mastheadRow}>
        {back ? (
          <Pressable
            onPress={() => { Haptics.selectionAsync(); router.back(); }}
            hitSlop={16}
            style={styles.back}
          >
            <Text style={{ color: c.ink, fontSize: 20, lineHeight: 22 }}>‹</Text>
            <Text style={{ color: c.ink, fontFamily: type.ui, fontSize: 14 }}>Volver</Text>
          </Pressable>
        ) : (
          <Text style={{
            color: c.muted,
            fontFamily: type.ui,
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}>
            {kicker}
          </Text>
        )}
        <Text style={{
          color: c.accent,
          fontFamily: type.ui,
          fontSize: 11,
          letterSpacing: 2.4,
          fontWeight: '700',
        }}>
          SONDA
        </Text>
      </View>
      <Text style={{
        fontFamily: type.display,
        fontSize: 32,
        lineHeight: 40,
        marginTop: 12,
        color: c.ink,
        letterSpacing: -0.5,
      }}>
        {title}
      </Text>
      <View style={{ height: 1, backgroundColor: c.border, marginTop: 14 }} />
    </View>
  );
}

/* ───────────────────────── PrimaryButton ───────────────────────── */
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
      style={({ pressed }) => ({
        minHeight: 52,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: bg,
        opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
        flex: flex ? 1 : undefined,
      })}
    >
      <Text style={{
        color: '#FFF',
        fontFamily: type.ui,
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.3,
      }}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ───────────────────────── GhostButton ───────────────────────── */
export function GhostButton({ label, onPress, inverted = false, flex }) {
  const scheme = useColorScheme();
  const dark = inverted || scheme === 'dark';
  const c = makeColors(dark);

  return (
    <Pressable
      onPress={() => { Haptics.selectionAsync(); onPress?.(); }}
      style={({ pressed }) => ({
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: inverted ? 'rgba(255,255,255,0.3)' : c.border,
        paddingHorizontal: 16,
        opacity: pressed ? 0.65 : 1,
        flex: flex ? 1 : undefined,
      })}
    >
      <Text style={{
        fontFamily: type.ui,
        fontSize: 14,
        color: inverted ? '#FFF' : c.ink,
        letterSpacing: 0.3,
      }}>
        {label}
      </Text>
    </Pressable>
  );
}

/* ───────────────────────── DataRow ───────────────────────── */
export function DataRow({ label, value, accent = false }) {
  const scheme = useColorScheme();
  const c = makeColors(scheme === 'dark');

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16,
      paddingVertical: 11,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    }}>
      <Text style={{
        color: c.muted,
        fontSize: 13,
        fontFamily: type.ui,
        flexShrink: 0,
      }}>
        {label}
      </Text>
      <Text
        style={{
          color: accent ? c.accent : c.ink,
          fontFamily: type.data,
          fontSize: 13,
          flex: 1,
          textAlign: 'right',
        }}
        selectable
      >
        {value}
      </Text>
    </View>
  );
}

/* ───────────────────────── Panel ───────────────────────── */
export function Panel({ children }) {
  const scheme = useColorScheme();
  const c = makeColors(scheme === 'dark');

  return (
    <View style={{
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      padding: 16,
      gap: 0,
    }}>
      {children}
    </View>
  );
}

/* ───────────────────────── Styles ───────────────────────── */
const styles = StyleSheet.create({
  pad: {
    flex: 1,
    paddingHorizontal: 24,
  },
  masthead: {
    paddingTop: 10,
    paddingBottom: 8,
  },
  mastheadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
