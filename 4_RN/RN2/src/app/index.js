import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Masthead, Screen } from '../components/Chrome';
import { colors, tools, type } from '../theme';

export default function Index() {
  return (
    <Screen>
      <Masthead kicker="Laboratorio PDeISC · RN2" title="Banco de pruebas" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        <Text style={styles.lede}>
          Cinco instrumentos del teléfono, medidos como en un cuaderno de campo: cámara, códigos,
          GPS, inercia y biometría.
        </Text>

        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} asChild>
            <Pressable
              onPressIn={() => Haptics.selectionAsync()}
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
            >
              <Text style={styles.index}>{tool.index}</Text>
              <View style={styles.body}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{tool.title}</Text>
                  <Text style={styles.subtitle}>{tool.subtitle}</Text>
                </View>
                <Text style={styles.note}>{tool.note}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          </Link>
        ))}

        <Text style={styles.colophon}>
          Expo SDK 58 · listo para APK con EAS Build (perfil preview)
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 36, gap: 0 },
  lede: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    maxWidth: 340,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  itemPressed: { backgroundColor: colors.paperDeep, marginHorizontal: -8, paddingHorizontal: 8 },
  index: {
    fontFamily: type.data,
    color: colors.oxide,
    fontSize: 13,
    width: 28,
    marginTop: 6,
  },
  body: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    flexWrap: 'wrap',
  },
  title: {
    fontFamily: type.display,
    fontSize: 26,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  note: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  arrow: {
    color: colors.ink,
    fontSize: 18,
    marginTop: 8,
  },
  colophon: {
    marginTop: 28,
    color: colors.muted,
    fontFamily: type.data,
    fontSize: 11,
    lineHeight: 16,
  },
});
