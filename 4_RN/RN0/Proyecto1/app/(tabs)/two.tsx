import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

const FONTS = [
  { label: 'Sans', value: 'System' },
  { label: 'Serif', value: 'Georgia' },
  { label: 'Mono', value: 'Courier New' },
  { label: 'Clásica', value: 'Palatino' },
];

const SIZES = [
  { label: 'S', value: 28 },
  { label: 'M', value: 40 },
  { label: 'L', value: 52 },
  { label: 'XL', value: 68 },
];

const ACCENT_COLORS = [
  { value: '#E15554' },
  { value: '#818CF8' },
  { value: '#2DD4BF' },
  { value: '#FBBF24' },
  { value: '#FB7185' },
  { value: '#A3E635' },
];

const SHAPES = [
  { label: 'Recto', value: 0 },
  { label: 'Curvo', value: 16 },
  { label: 'Redondo', value: 36 },
  { label: 'Cápsula', value: 120 },
];

export default function TabTwoScreen() {
  const { scheme } = useAppTheme();
  const theme = Colors[scheme];
  const isDark = scheme === 'dark';

  const [fontIdx, setFontIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [colorIdx, setColorIdx] = useState(0);
  const [shapeIdx, setShapeIdx] = useState(1);

  const { width } = useWindowDimensions();
  const isNarrow = width < 720;
  const accent = ACCENT_COLORS[colorIdx].value;
  const cardBg = isDark ? theme.surface : '#FBF8F2';
  const radioBorder = isDark ? '#64748B' : '#C9C2B6';

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.content, { paddingHorizontal: isNarrow ? 12 : 20 }]}
    >
      <View
        style={[
          styles.hero,
          {
            backgroundColor: cardBg,
            borderColor: theme.border,
            borderRadius: SHAPES[shapeIdx].value,
          },
        ]}
      >
        <Text style={[styles.heroKicker, { color: theme.textSecondary }]}>
          TAB 2  -  ESTILOS
        </Text>
        <View style={styles.heroTitleRow}>
          <Text
            style={[
              styles.heroTitle,
              {
                fontFamily: FONTS[fontIdx].value,
                fontSize: isNarrow ? Math.min(SIZES[sizeIdx].value, 34) : SIZES[sizeIdx].value,
                color: theme.text,
              },
            ]}
          >
            Hola{' '}
          </Text>
          <Text
            style={[
              styles.heroTitle,
              {
                fontFamily: FONTS[fontIdx].value,
                fontSize: isNarrow ? Math.min(SIZES[sizeIdx].value, 34) : SIZES[sizeIdx].value,
                color: accent,
              },
            ]}
          >
            Mundo
          </Text>
        </View>
        <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
          Personaliza el estilo de tu texto y dale tu toque único.
        </Text>
      </View>

      <View style={styles.controlRow}>
        <View style={[styles.panel, isNarrow && styles.panelFull, { backgroundColor: cardBg, borderColor: theme.border }]}>
          <View style={styles.panelHeader}>
            <Text style={[styles.headerIcon, { color: theme.text }]}>Aa</Text>
            <Text style={[styles.panelTitle, { color: theme.text }]}>TIPOGRAFÍA</Text>
          </View>
          <RadioList
            items={FONTS}
            selected={fontIdx}
            onSelect={setFontIdx}
            accent={accent}
            theme={theme}
            radioBorder={radioBorder}
            fontFromItem
          />
        </View>

        <View style={[styles.panel, isNarrow && styles.panelFull, { backgroundColor: cardBg, borderColor: theme.border }]}>
          <View style={styles.panelHeader}>
            <Text style={[styles.headerIcon, { color: theme.text }]}>Tt</Text>
            <Text style={[styles.panelTitle, { color: theme.text }]}>TAMAÑO</Text>
          </View>
          <RadioList
            items={SIZES}
            selected={sizeIdx}
            onSelect={setSizeIdx}
            accent={accent}
            theme={theme}
            radioBorder={radioBorder}
          />
        </View>

        <View style={[styles.panel, isNarrow && styles.panelFull, { backgroundColor: cardBg, borderColor: theme.border }]}>
          <View style={styles.panelHeader}>
            <Text style={[styles.headerIcon, { color: theme.text }]}>🎨</Text>
            <Text style={[styles.panelTitle, { color: theme.text }]}>COLOR</Text>
          </View>
          <View style={styles.swatchGrid}>
            {ACCENT_COLORS.map((c, i) => {
              const selected = i === colorIdx;
              return (
                <TouchableOpacity
                  key={c.value}
                  onPress={() => setColorIdx(i)}
                  style={[
                    styles.swatch,
                    { backgroundColor: c.value },
                    selected && {
                      borderWidth: 3,
                      borderColor: isDark ? '#FFFFFF' : '#1E1B18',
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>

        <View style={[styles.panel, isNarrow && styles.panelFull, { backgroundColor: cardBg, borderColor: theme.border }]}>
          <View style={styles.panelHeader}>
            <View style={[styles.shapeHeaderIcon, { backgroundColor: theme.text }]} />
            <Text style={[styles.panelTitle, { color: theme.text }]}>FORMA</Text>
          </View>
          <RadioList
            items={SHAPES}
            selected={shapeIdx}
            onSelect={setShapeIdx}
            accent={accent}
            theme={theme}
            radioBorder={radioBorder}
          />
        </View>
      </View>
    </ScrollView>
  );
}

type Theme = typeof Colors.light;

function RadioList({
  items,
  selected,
  onSelect,
  accent,
  theme,
  radioBorder,
  fontFromItem,
}: {
  items: { label: string; value: string | number }[];
  selected: number;
  onSelect: (index: number) => void;
  accent: string;
  theme: Theme;
  radioBorder: string;
  fontFromItem?: boolean;
}) {
  return (
    <View style={styles.optionsList}>
      {items.map((item, i) => {
        const isSelected = i === selected;
        return (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.radioPill,
              { backgroundColor: isSelected ? accent : 'transparent' },
            ]}
            onPress={() => onSelect(i)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.radioCircle,
                {
                  borderColor: isSelected ? '#FFFFFF' : radioBorder,
                  backgroundColor: 'transparent',
                },
              ]}
            >
              {isSelected && <View style={styles.radioDot} />}
            </View>
            <Text
              style={[
                styles.radioText,
                {
                  color: isSelected ? '#FFFFFF' : theme.text,
                  fontFamily: fontFromItem && typeof item.value === 'string' ? item.value : undefined,
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 16,
  },
  hero: {
    width: '60%',
    alignSelf: 'center',
    borderWidth: 1,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  heroKicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 10,
  },
  heroTitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  heroTitle: {
    fontWeight: '900',
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  heroSubtitle: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  panel: {
    flexGrow: 1,
    flexBasis: 180,
    minWidth: 150,
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  panelFull: {
    flexBasis: '100%',
    minWidth: '100%',
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 18,
    fontWeight: '800',
  },
  shapeHeaderIcon: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  panelTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  optionsList: {
    gap: 8,
  },
  radioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    gap: 10,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  radioText: {
    fontSize: 14,
    fontWeight: '600',
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 92,
    alignSelf: 'center',
    paddingVertical: 8,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
