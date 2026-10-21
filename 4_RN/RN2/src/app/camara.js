import { useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { GhostButton, Masthead, PrimaryButton, Screen } from '../components/Chrome';
import { colors, type } from '../theme';

export default function CamaraScreen() {
  const cameraRef = useRef(null);
  const focused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [torch, setTorch] = useState(false);
  const [photo, setPhoto] = useState(null);

  if (!permission) {
    return (
      <Screen>
        <Masthead back title="Obturador" />
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <Masthead back title="Obturador" />
        <Text style={styles.copy}>
          La cámara se usa para capturar una placa fotográfica del ejercicio. Sin el permiso no hay
          vista previa.
        </Text>
        <PrimaryButton label="Conceder cámara" onPress={requestPermission} />
      </Screen>
    );
  }

  const shoot = async () => {
    const shot = await cameraRef.current?.takePictureAsync({ quality: 0.7, skipProcessing: true });
    if (shot?.uri) setPhoto(shot.uri);
  };

  return (
    <Screen padded={false} dark>
      <View style={styles.top}>
        <Masthead back light title="Obturador" />
      </View>

      <View style={styles.stage}>
        {focused ? (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing={facing}
            enableTorch={torch && facing === 'back'}
            active={focused}
          />
        ) : null}
        <View style={styles.frame} pointerEvents="none" />
      </View>

      <View style={styles.bottom}>
        {photo ? (
          <View style={styles.plate}>
            <Image source={{ uri: photo }} style={styles.thumb} />
            <Text style={styles.meta}>Última placa</Text>
            <GhostButton inverted label="Descartar" onPress={() => setPhoto(null)} />
          </View>
        ) : null}
        <View style={styles.controls}>
          <GhostButton
            inverted
            flex
            label={facing === 'back' ? 'Frente' : 'Atrás'}
            onPress={() => {
              setTorch(false);
              setFacing((current) => (current === 'back' ? 'front' : 'back'));
            }}
          />
          <PrimaryButton flex label="Disparar" onPress={shoot} />
          <GhostButton
            inverted
            flex
            label={torch ? 'Flash off' : 'Flash'}
            onPress={() => setTorch((value) => !value)}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: 22 },
  copy: { color: colors.muted, fontSize: 16, lineHeight: 24, marginBottom: 24 },
  stage: {
    flex: 1,
    marginHorizontal: 22,
    marginVertical: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  frame: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(247,241,227,0.35)',
  },
  bottom: { paddingHorizontal: 22, paddingBottom: 16, gap: 12 },
  plate: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 56, height: 56, backgroundColor: colors.paperDeep },
  meta: { flex: 1, color: colors.cream, fontFamily: type.data, fontSize: 12 },
  controls: { flexDirection: 'row', gap: 8, alignItems: 'center' },
});
