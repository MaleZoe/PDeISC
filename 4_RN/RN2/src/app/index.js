import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Screen } from '../components/Chrome';
import { useTheme } from '../context/ThemeContext';
import { makeColors, tools, type } from '../theme';

export default function Index() {
  const { dark, toggle } = useTheme();
  const c = makeColors(dark);
  const { width } = useWindowDimensions();

  // En PC/Escritorio (>= 768px): disposición horizontal con las 5 tarjetas repartidas.
  // En Celular (< 768px): lista vertical limpia y profesional.
  const isDesktop = width >= 768;
  const GAP = 12;
  const PADDING = 24;
  const available = width - PADDING * 2;
  const tileW = (available - GAP * 4) / 5;

  return (
    <Screen>
      {/* ── Header ── */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: 10,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            color: c.muted,
            fontFamily: type.ui,
            fontSize: 11,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}>
            Laboratorio PDeISC · RN2
          </Text>
          <Text style={{
            fontFamily: type.display,
            fontSize: 32,
            lineHeight: 40,
            marginTop: 10,
            color: c.ink,
            letterSpacing: -0.5,
          }}>
            Banco de pruebas
          </Text>
        </View>

        {/* Toggle dark/light */}
        <Pressable
          onPress={() => { Haptics.selectionAsync(); toggle(); }}
          hitSlop={12}
          style={({ pressed }) => ({
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: c.border,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 4,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Ionicons
            name={dark ? 'sunny-outline' : 'moon-outline'}
            size={18}
            color={c.ink}
          />
        </Pressable>
      </View>

      <View style={{ height: 1, backgroundColor: c.border, marginTop: 14 }} />

      <Text style={{
        color: c.muted,
        fontSize: 14,
        lineHeight: 21,
        marginTop: 16,
        fontFamily: type.ui,
      }}>
        Cinco instrumentos del dispositivo, listos para inspección.
      </Text>

      {/* ── Vista Horizontal en Computadora / Vertical en Celular ── */}
      {isDesktop ? (
        /* PC: 5 columnas horizontales que aprovechan todo el ancho */
        <View style={{
          flexDirection: 'row',
          gap: GAP,
          paddingVertical: 24,
          justifyContent: 'space-between',
        }}>
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} asChild>
              <Pressable style={{ flex: 1 }} onPressIn={() => Haptics.selectionAsync()}>
                {({ pressed }) => (
                  <View style={{
                    backgroundColor: pressed ? c.card : c.surface,
                    borderWidth: 1,
                    borderColor: c.border,
                    borderTopWidth: 3,
                    borderTopColor: c.accent,
                    borderRadius: 4,
                    paddingVertical: 24,
                    paddingHorizontal: 16,
                    justifyContent: 'space-between',
                    minHeight: 220,
                  }}>
                    <Text style={{
                      fontFamily: type.data,
                      fontSize: 11,
                      color: c.accent,
                      letterSpacing: 1,
                    }}>
                      {tool.index}
                    </Text>

                    <Ionicons
                      name={tool.ionicon}
                      size={34}
                      color={c.ink}
                      style={{ alignSelf: 'center', marginVertical: 18 }}
                    />

                    <View>
                      <Text style={{
                        fontFamily: type.ui,
                        fontSize: 15,
                        fontWeight: '600',
                        color: c.ink,
                        letterSpacing: 0.2,
                      }}>
                        {tool.title}
                      </Text>
                      <Text style={{
                        fontFamily: type.ui,
                        fontSize: 11,
                        color: c.muted,
                        marginTop: 4,
                        letterSpacing: 0.8,
                        textTransform: 'uppercase',
                      }}>
                        {tool.subtitle}
                      </Text>
                    </View>
                  </View>
                )}
              </Pressable>
            </Link>
          ))}
        </View>
      ) : (
        /* Celular: lista vertical ergonómica para el pulgar */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 16,
            gap: 10,
          }}
        >
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} asChild>
              <Pressable onPressIn={() => Haptics.selectionAsync()}>
                {({ pressed }) => (
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: pressed ? c.card : c.surface,
                    borderWidth: 1,
                    borderColor: c.border,
                    borderLeftWidth: 3,
                    borderLeftColor: c.accent,
                    borderRadius: 8,
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    gap: 14,
                  }}>
                    {/* Contenedor del Icono Vectorial */}
                    <View style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      backgroundColor: c.accentGlow,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Ionicons name={tool.ionicon} size={22} color={c.accent} />
                    </View>

                    {/* Textos descriptivos */}
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                        <Text style={{
                          fontFamily: type.data,
                          fontSize: 11,
                          color: c.accent,
                          fontWeight: '700',
                        }}>
                          {tool.index}
                        </Text>
                        <Text style={{
                          fontFamily: type.ui,
                          fontSize: 16,
                          fontWeight: '600',
                          color: c.ink,
                          letterSpacing: -0.2,
                        }}>
                          {tool.title}
                        </Text>
                        <Text style={{
                          fontFamily: type.ui,
                          fontSize: 10,
                          color: c.muted,
                          letterSpacing: 0.8,
                          textTransform: 'uppercase',
                        }}>
                          {tool.subtitle}
                        </Text>
                      </View>
                      <Text style={{
                        fontFamily: type.ui,
                        fontSize: 12,
                        color: c.muted,
                        lineHeight: 16,
                        marginTop: 3,
                      }}>
                        {tool.note}
                      </Text>
                    </View>

                    {/* Chevron minimalista */}
                    <Ionicons name="chevron-forward" size={16} color={c.muted} />
                  </View>
                )}
              </Pressable>
            </Link>
          ))}
        </ScrollView>
      )}

      {/* ── Footer ── */}
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 12 }}>
        <View style={{ height: 1, backgroundColor: c.border, marginBottom: 12 }} />
        <Text style={{
          color: c.muted,
          fontFamily: type.data,
          fontSize: 10,
          letterSpacing: 0.6,
          textAlign: 'center',
        }}>
          EXPO SDK 57 · EAS BUILD · APK PREVIEW
        </Text>
      </View>
    </Screen>
  );
}
