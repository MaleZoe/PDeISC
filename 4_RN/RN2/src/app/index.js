import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Link } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Masthead, Screen } from '../components/Chrome';
import { makeColors, tools, type } from '../theme';

export default function Index() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const c = makeColors(dark);

  return (
    <Screen>
      <Masthead kicker="Laboratorio PDeISC · RN2" title="Banco de pruebas" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        <Text style={[styles.lede, { color: c.muted }]}>
          Cinco instrumentos del teléfono, medidos como en un cuaderno de campo: cámara, códigos,
          GPS, inercia y biometría.
        </Text>

        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} asChild>
            <Pressable
              onPressIn={() => Haptics.selectionAsync()}
              style={({ pressed }) => [
                styles.item,
                {
                  backgroundColor: pressed ? c.card : c.surface,
                  borderColor: c.border,
                },
              ]}
            >
              {/* Left: icon + index */}
              <View style={[styles.iconWrap, { backgroundColor: c.accentGlow }]}>
                <Text style={styles.icon}>{tool.icon}</Text>
                <Text style={[styles.index, { color: c.accent }]}>{tool.index}</Text>
              </View>

              {/* Center: title + subtitle + note */}
              <View style={styles.body}>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, { color: c.ink }]}>{tool.title}</Text>
                  <Text style={[styles.subtitle, { color: c.muted }]}>{tool.subtitle}</Text>
                </View>
                <Text style={[styles.note, { color: c.muted }]}>{tool.note}</Text>
              </View>

              {/* Right: arrow */}
              <Text style={[styles.arrow, { color: c.accent }]}>→</Text>
            </Pressable>
          </Link>
        ))}

        <Text style={[styles.colophon, { color: c.muted }]}>
          Expo SDK 57 · APK disponible vía EAS Build (perfil preview)
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 40, gap: 10 },
  lede: {
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    flexShrink: 0,
  },
  icon: { fontSize: 22 },
  index: {
    fontFamily: type.data,
    fontSize: 10,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  body: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    flexWrap: 'wrap',
  },
  title: {
    fontFamily: type.display,
    fontSize: 22,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  note: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
  arrow: {
    fontSize: 18,
    flexShrink: 0,
  },
  colophon: {
    marginTop: 20,
    fontFamily: type.data,
    fontSize: 11,
    lineHeight: 16,
  },
});
