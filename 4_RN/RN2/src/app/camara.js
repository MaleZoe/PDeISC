import { useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { GhostButton, Masthead, PrimaryButton, Screen } from '../components/Chrome';
import { useTheme } from '../context/ThemeContext';
import { makeColors, type } from '../theme';

export default function CamaraScreen() {
  const { dark } = useTheme();
  const c = makeColors(dark);

  const cameraRef = useRef(null);
  const focused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [torch, setTorch] = useState(false);
  const [photo, setPhoto] = useState(null);

  if (!permission) {
    return <Screen><Masthead back title="Obturador" /></Screen>;
  }

  if (!permission.granted) {
    return (
      <Screen>
        <Masthead back title="Obturador" />
        <Text style={{ color: c.muted, fontSize: 15, lineHeight: 22, marginBottom: 24 }}>
          La cámara se usa para capturar una placa fotográfica. Sin el permiso no hay vista previa.
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
      <View style={{ paddingHorizontal: 24 }}>
        <Masthead back light title="Obturador" />
      </View>
      <View style={{
        flex: 1, marginHorizontal: 24, marginVertical: 12,
        borderRadius: 8, overflow: 'hidden', backgroundColor: '#000',
      }}>
        {focused ? (
          <CameraView
            ref={cameraRef} style={StyleSheet.absoluteFill}
            facing={facing} enableTorch={torch && facing === 'back'} active={focused}
          />
        ) : null}
        <View style={{
          ...StyleSheet.absoluteFillObject,
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 8,
        }} pointerEvents="none" />
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 16, gap: 12 }}>
        {photo ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image source={{ uri: photo }} style={{ width: 52, height: 52, borderRadius: 6, backgroundColor: '#333' }} />
            <Text style={{ flex: 1, color: '#F0F6FC', fontFamily: type.data, fontSize: 12 }}>Última placa</Text>
            <GhostButton inverted label="Descartar" onPress={() => setPhoto(null)} />
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <GhostButton inverted flex label={facing === 'back' ? 'Frente' : 'Atrás'}
            onPress={() => { setTorch(false); setFacing(f => f === 'back' ? 'front' : 'back'); }} />
          <PrimaryButton flex label="Disparar" onPress={shoot} />
          <GhostButton inverted flex label={torch ? 'Flash off' : 'Flash'}
            onPress={() => setTorch(v => !v)} />
        </View>
      </View>
    </Screen>
  );
}
