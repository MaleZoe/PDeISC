import { useState } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useIsFocused } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { GhostButton, Masthead, PrimaryButton, Screen } from '../components/Chrome';
import { makeColors, type } from '../theme';

export default function LectorScreen() {
  const scheme = useColorScheme();
  const c = makeColors(scheme === 'dark');

  const focused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [lock, setLock] = useState(null);

  if (!permission) {
    return (
      <Screen>
        <Masthead back title="Lectura" />
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <Masthead back title="Lectura" />
        <Text style={[styles.copy, { color: c.muted }]}>
          El visor necesita cámara para decodificar QR y códigos de barras. El permiso es el mismo
          que usa el obturador.
        </Text>
        <PrimaryButton label="Conceder cámara" onPress={requestPermission} />
      </Screen>
    );
  }

  return (
    <Screen padded={false} dark>
      <View style={styles.top}>
        <Masthead back light title="Lectura" />
      </View>

      <View style={styles.stage}>
        {focused ? (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: [
                'qr',
                'ean13',
                'ean8',
                'code128',
                'code39',
                'upc_a',
                'upc_e',
                'pdf417',
                'aztec',
                'datamatrix',
              ],
            }}
            onBarcodeScanned={
              lock
                ? undefined
                : ({ type, data }) => {
                    setLock({ type, data });
                  }
            }
          />
        ) : null}
        <View style={styles.reticle} pointerEvents="none">
          <View style={styles.box} />
          <Text style={[styles.hint, { fontFamily: type.data }]}>Alinear el código al recuadro</Text>
        </View>
      </View>

      <View style={[styles.sheet, { backgroundColor: c.surface }]}>
        {lock ? (
          <>
            <Text style={[styles.kind, { color: c.accent, fontFamily: type.data }]}>{lock.type}</Text>
            <Text style={[styles.payload, { color: c.ink, fontFamily: type.data }]} selectable>
              {lock.data}
            </Text>
            <GhostButton label="Leer otro" onPress={() => setLock(null)} />
          </>
        ) : (
          <Text style={[styles.wait, { color: c.muted, fontFamily: type.data }]}>Esperando señal…</Text>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: '10%' },
  copy: { fontSize: 16, lineHeight: 24, marginBottom: 24 },
  stage: { flex: 1, marginHorizontal: '10%', overflow: 'hidden', backgroundColor: '#000' },
  reticle: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  box: {
    width: 228,
    height: 228,
    borderWidth: 1.5,
    borderColor: 'rgba(247,241,227,0.85)',
  },
  hint: {
    marginTop: 14,
    color: 'rgba(247,241,227,0.75)',
    fontSize: 12,
    letterSpacing: 0.4,
  },
  sheet: {
    paddingHorizontal: '10%',
    paddingVertical: 18,
    gap: 10,
    minHeight: 140,
    justifyContent: 'center',
  },
  kind: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  payload: { fontSize: 15, lineHeight: 22 },
  wait: { fontSize: 13 },
});
