import { StyleSheet, Text } from 'react-native';
import { Masthead, PrimaryButton, Screen } from '../components/Chrome';
import { colors } from '../theme';
import { router } from 'expo-router';

export default function NotFound() {
  return (
    <Screen>
      <Masthead back title="Fuera de carta" />
      <Text style={styles.copy}>Esa ruta no está en el banco de pruebas.</Text>
      <PrimaryButton label="Volver al índice" onPress={() => router.replace('/')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: { color: colors.muted, fontSize: 16, marginBottom: 20 },
});
