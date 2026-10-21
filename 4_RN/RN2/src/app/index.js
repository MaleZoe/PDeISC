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

  // Calcular ancho de cada tile: en pantallas anchas, 5 caben cómodas.
  // En móvil, se muestran ~2.5 para invitar a hacer scroll.
  const GAP = 12;
  const PADDING = 24;
  const available = width - PADDING * 2;
  const tileW = available >= 780
    ? (available - GAP * 4) / 5        // desktop: 5 tiles
    : Math.min(160, (available - GAP) / 2.4); // mobile: ~2.5 visibles

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

      {/* ── Tiles horizontales ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: GAP,
          paddingVertical: 20,
        }}
        style={{ marginHorizontal: -24 }}
        contentOffset={{ x: -24, y: 0 }}
        snapToInterval={tileW + GAP}
        decelerationRate="fast"
      >
        {/* Padding invisible para mantener la alineación */}
        <View style={{ width: 24 - GAP }} />

        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} asChild>
            <Pressable onPressIn={() => Haptics.selectionAsync()}>
              {({ pressed }) => (
                <View style={{
                  width: tileW,
                  backgroundColor: pressed ? c.card : c.surface,
                  borderWidth: 1,
                  borderColor: c.border,
                  borderTopWidth: 3,
                  borderTopColor: c.accent,
                  paddingVertical: 20,
                  paddingHorizontal: 16,
                  justifyContent: 'space-between',
                  minHeight: tileW * 1.2,
                }}>
                  {/* Número */}
                  <Text style={{
                    fontFamily: type.data,
                    fontSize: 11,
                    color: c.accent,
                    letterSpacing: 1,
                  }}>
                    {tool.index}
                  </Text>

                  {/* Icono */}
                  <Ionicons
                    name={tool.ionicon}
                    size={32}
                    color={c.ink}
                    style={{ alignSelf: 'center', marginVertical: 16 }}
                  />

                  {/* Texto */}
                  <View>
                    <Text style={{
                      fontFamily: type.ui,
                      fontSize: 14,
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
                      marginTop: 3,
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

        <View style={{ width: 24 - GAP }} />
      </ScrollView>

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
