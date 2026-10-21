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
        contentContainerStyle={{ paddingBottom: 40, gap: 10, paddingTop: 4 }}
      >
        <Text style={{
          color: c.muted,
          fontSize: 15,
          lineHeight: 22,
          marginBottom: 12,
          fontFamily: type.ui,
        }}>
          Cinco instrumentos del teléfono, medidos como en un cuaderno de campo: cámara, códigos,
          GPS, inercia y biometría.
        </Text>

        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} asChild>
            <Pressable
              onPressIn={() => Haptics.selectionAsync()}
            >
              {({ pressed }) => (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: pressed ? c.card : c.surface,
                  borderWidth: 1,
                  borderColor: c.border,
                  borderRadius: 12,
                  padding: 16,
                  gap: 14,
                }}>
                  {/* Icono */}
                  <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: c.accentGlow,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 22 }}>{tool.icon}</Text>
                  </View>

                  {/* Texto */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                      <Text style={{
                        fontFamily: type.display,
                        fontSize: 20,
                        color: c.ink,
                        letterSpacing: -0.3,
                      }}>
                        {tool.title}
                      </Text>
                      <Text style={{
                        fontSize: 10,
                        letterSpacing: 1.4,
                        textTransform: 'uppercase',
                        color: c.muted,
                        fontFamily: type.ui,
                      }}>
                        {tool.subtitle}
                      </Text>
                    </View>
                    <Text style={{
                      fontSize: 13,
                      lineHeight: 18,
                      color: c.muted,
                      marginTop: 2,
                      fontFamily: type.ui,
                    }}>
                      {tool.note}
                    </Text>
                  </View>

                  {/* Flecha */}
                  <Text style={{ fontSize: 18, color: c.accent }}>›</Text>
                </View>
              )}
            </Pressable>
          </Link>
        ))}

        <Text style={{
          marginTop: 16,
          color: c.muted,
          fontFamily: type.data,
          fontSize: 11,
          lineHeight: 16,
          textAlign: 'center',
        }}>
          Expo SDK 57 · APK disponible vía EAS Build
        </Text>
      </ScrollView>
    </Screen>
  );
}
