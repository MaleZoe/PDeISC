import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { DataRow, Masthead, Panel, PrimaryButton, Screen } from '../components/Chrome';
import { colors } from '../theme';

const TYPE_LABEL = {
  [LocalAuthentication.AuthenticationType.FINGERPRINT]: 'Huella dactilar',
  [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION]: 'Face ID / Reconocimiento Facial',
  [LocalAuthentication.AuthenticationType.IRIS]: 'Iris',
};

const LEVEL_LABEL = {
  [LocalAuthentication.SecurityLevel.NONE]: 'Ninguno',
  [LocalAuthentication.SecurityLevel.SECRET]: 'PIN / patrón / contraseña',
  [LocalAuthentication.SecurityLevel.BIOMETRIC_WEAK]: 'Biometría (estándar)',
  [LocalAuthentication.SecurityLevel.BIOMETRIC_STRONG]: 'Biometría segura (fuerte)',
};

export default function BiometriaScreen() {
  const [hardware, setHardware] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [types, setTypes] = useState([]);
  const [level, setLevel] = useState(LocalAuthentication.SecurityLevel.NONE);
  const [result, setResult] = useState('Sin ensayo');

  const inspect = useCallback(async () => {
    const [has, isEnrolled, supported, enrolledLevel] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
      LocalAuthentication.supportedAuthenticationTypesAsync(),
      LocalAuthentication.getEnrolledLevelAsync(),
    ]);
    setHardware(has);
    setEnrolled(isEnrolled);
    setTypes(supported);
    setLevel(enrolledLevel);
  }, []);

  useEffect(() => {
    inspect();
  }, [inspect]);

  const authenticate = async () => {
    const attempt = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autenticación Biométrica',
      promptSubtitle: 'Verifica tu identidad con huella, Face ID o PIN',
      cancelLabel: 'Cancelar',
      fallbackLabel: 'Usar código',
    });
    setResult(attempt.success ? 'Identidad confirmada' : attempt.error || 'Cancelado');
    inspect();
  };

  return (
    <Screen>
      <Masthead back title="Biometría" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        <Text style={styles.copy}>
          Detección del hardware biométrico del dispositivo y prueba en vivo del prompt nativo (Huella dactilar, Face ID / Reconocimiento facial o clave de seguridad).
        </Text>

        <Panel>
          <DataRow label="Sensor biométrico" value={hardware ? 'Disponible' : 'No disponible'} accent={hardware} />
          <DataRow label="Datos registrados" value={enrolled ? 'Sí (configurado)' : 'No registrado'} />
          <DataRow
            label="Métodos compatibles"
            value={types.length ? types.map((t) => TYPE_LABEL[t] || t).join(' · ') : 'Solo PIN / Patrón'}
          />
          <DataRow label="Nivel de seguridad" value={LEVEL_LABEL[level] ?? String(level)} />
          <DataRow label="Último ensayo" value={result} accent={result === 'Identidad confirmada'} />
        </Panel>

        <PrimaryButton label="Probar autenticación biométrica" onPress={authenticate} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 32, gap: 16 },
  copy: { color: colors.muted, fontSize: 16, lineHeight: 24 },
});
