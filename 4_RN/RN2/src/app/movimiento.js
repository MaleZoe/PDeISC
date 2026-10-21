import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { DataRow, GhostButton, Masthead, Panel, PrimaryButton, Screen } from '../components/Chrome';
import { colors, type } from '../theme';

const ZERO = { x: 0, y: 0, z: 0 };
const fmt = (n) => (Number.isFinite(n) ? n.toFixed(3) : '—');

export default function MovimientoScreen() {
  const [accel, setAccel] = useState(ZERO);
  const [gyro, setGyro] = useState(ZERO);
  const [live, setLive] = useState(false);
  const [available, setAvailable] = useState({ accel: true, gyro: true });
  const [rate, setRate] = useState(80);

  useEffect(() => {
    (async () => {
      const [a, g] = await Promise.all([
        Accelerometer.isAvailableAsync(),
        Gyroscope.isAvailableAsync(),
      ]);
      setAvailable({ accel: a, gyro: g });
    })();
  }, []);

  useEffect(() => {
    if (!live) return undefined;
    Accelerometer.setUpdateInterval(rate);
    Gyroscope.setUpdateInterval(rate);
    const a = Accelerometer.addListener(setAccel);
    const g = Gyroscope.addListener(setGyro);
    return () => {
      a.remove();
      g.remove();
    };
  }, [live, rate]);

  const mag = Math.sqrt(accel.x ** 2 + accel.y ** 2 + accel.z ** 2);

  return (
    <Screen>
      <Masthead back title="Inercia" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        <Text style={styles.copy}>
          Aceleración en g y rotación en rad/s. El disco sigue el vector del acelerómetro para leer
          la inclinación de un vistazo.
        </Text>

        <View style={styles.horizon}>
          <View style={styles.crossH} />
          <View style={styles.crossV} />
          <View
            style={[
              styles.bead,
              {
                transform: [
                  { translateX: Math.max(-54, Math.min(54, accel.x * 48)) },
                  { translateY: Math.max(-54, Math.min(54, -accel.y * 48)) },
                ],
              },
            ]}
          />
          <Text style={styles.mag}>{fmt(mag)} g</Text>
        </View>

        <Panel>
          <Text style={styles.section}>Acelerómetro</Text>
          <DataRow label="X" value={available.accel ? fmt(accel.x) : 'no disponible'} />
          <DataRow label="Y" value={available.accel ? fmt(accel.y) : 'no disponible'} />
          <DataRow label="Z" value={available.accel ? fmt(accel.z) : 'no disponible'} />
        </Panel>

        <Panel>
          <Text style={styles.section}>Giroscopio</Text>
          <DataRow label="ω X" value={available.gyro ? fmt(gyro.x) : 'no disponible'} />
          <DataRow label="ω Y" value={available.gyro ? fmt(gyro.y) : 'no disponible'} />
          <DataRow label="ω Z" value={available.gyro ? fmt(gyro.z) : 'no disponible'} />
        </Panel>

        <PrimaryButton
          label={live ? 'Pausar muestreo' : 'Iniciar muestreo'}
          onPress={async () => {
            if (!live) {
              await Accelerometer.requestPermissionsAsync();
              await Gyroscope.requestPermissionsAsync();
            }
            setLive((value) => !value);
          }}
        />
        <View style={styles.rates}>
          <GhostButton flex label="16 ms" onPress={() => setRate(16)} />
          <GhostButton flex label="80 ms" onPress={() => setRate(80)} />
          <GhostButton flex label="200 ms" onPress={() => setRate(200)} />
        </View>
        <Text style={styles.meta}>Intervalo actual: {rate} ms</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 32, gap: 12 },
  copy: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  horizon: {
    height: 180,
    borderWidth: 1,
    borderColor: colors.ink,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  crossH: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.line,
  },
  crossV: {
    position: 'absolute',
    top: 16,
    bottom: 16,
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.line,
  },
  bead: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.oxide,
  },
  mag: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    fontFamily: type.data,
    fontSize: 12,
    color: colors.muted,
  },
  section: {
    fontFamily: type.display,
    fontSize: 18,
    color: colors.ink,
    marginBottom: 6,
  },
  rates: { flexDirection: 'row', gap: 8 },
  meta: { color: colors.muted, fontFamily: type.data, fontSize: 12 },
});
