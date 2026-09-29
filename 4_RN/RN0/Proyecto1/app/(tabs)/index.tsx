import { StyleSheet, useWindowDimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

export default function TabOneScreen() {
  const { scheme } = useAppTheme();
  const theme = Colors[scheme];
  const { width } = useWindowDimensions();
  const compact = width < 420;
  const titleSize = compact ? 32 : width < 768 ? 40 : 48;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            padding: compact ? 24 : 40,
          },
        ]}
      >
        <Text style={[styles.label, { color: theme.textSecondary }]}>Tab 1 · Proyecto 1</Text>
        <Text style={[styles.title, { color: theme.text, fontSize: titleSize }]}>Hola Mundo 👋</Text>
        <View style={[styles.divider, { backgroundColor: theme.tint }]} />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  title: {
    fontWeight: '900',
    letterSpacing: -1,
    textAlign: 'center',
  },
  divider: {
    width: 40,
    height: 3,
    borderRadius: 2,
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
