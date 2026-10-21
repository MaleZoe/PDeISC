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
        <Text style={{ color: c.muted, fontSize: 16, lineHeight: 24, marginBottom: 24 }}>
          El visor necesita cámara para decodificar QR y códigos de barras. El permiso es el mismo
          que usa el obturador.
        </Text>
        <PrimaryButton label="Conceder cámara" onPress={requestPermission} />
      </Screen>
    );
  }

  return (
    <Screen padded={false} dark>
      <View style={{ paddingHorizontal: 24 }}>
        <Masthead back light title="Lectura" />
      </View>

      <View style={{
        flex: 1,
        marginHorizontal: 24,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000',
      }}>
        {focused ? (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: [
                'qr', 'ean13', 'ean8', 'code128', 'code39',
                'upc_a', 'upc_e', 'pdf417', 'aztec', 'datamatrix',
              ],
            }}
            onBarcodeScanned={
              lock
                ? undefined
                : ({ type, data }) => setLock({ type, data })
            }
          />
        ) : null}
        <View style={{
          ...StyleSheet.absoluteFillObject,
          alignItems: 'center',
          justifyContent: 'center',
        }} pointerEvents="none">
          <View style={{
            width: 220,
            height: 220,
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.7)',
            borderRadius: 16,
          }} />
          <Text style={{
            marginTop: 14,
            color: 'rgba(255,255,255,0.7)',
            fontFamily: type.data,
            fontSize: 12,
          }}>
            Alinear el código al recuadro
          </Text>
        </View>
      </View>

      <View style={{
        paddingHorizontal: 24,
        paddingVertical: 18,
        gap: 10,
        minHeight: 130,
        justifyContent: 'center',
      }}>
        {lock ? (
          <>
            <Text style={{
              color: c.accent,
              fontFamily: type.data,
              fontSize: 12,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
            }}>
              {lock.type}
            </Text>
            <Text style={{
              color: '#F0F6FC',
              fontFamily: type.data,
              fontSize: 15,
              lineHeight: 22,
            }} selectable>
              {lock.data}
            </Text>
            <GhostButton inverted label="Leer otro" onPress={() => setLock(null)} />
          </>
        ) : (
          <Text style={{
            color: 'rgba(255,255,255,0.45)',
            fontFamily: type.data,
            fontSize: 13,
          }}>
            Esperando señal…
          </Text>
        )}
      </View>
    </Screen>
  );
}
