import { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import * as Location from 'expo-location';
import { DataRow, Masthead, Panel, PrimaryButton, Screen } from '../components/Chrome';
import { useTheme } from '../context/ThemeContext';
import { makeColors } from '../theme';

const fmt = (value, digits = 6, suffix = '') =>
  value == null || Number.isNaN(value) ? '—' : `${value.toFixed(digits)}${suffix}`;

export default function UbicacionScreen() {
  const { dark } = useTheme();
  const c = makeColors(dark);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [fix, setFix] = useState(null);
  const [place, setPlace] = useState(null);
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    if (!watching) return undefined;
    let sub;
    (async () => {
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 2 },
        (update) => setFix(update.coords)
      );
    })();
    return () => sub?.remove();
  }, [watching]);

  const pinpoint = async () => {
    setBusy(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permiso de ubicación denegado.');
        return;
      }
      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setFix(current.coords);
      const geo = await Location.reverseGeocodeAsync({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
      setPlace(geo[0] ?? null);
    } catch {
      setError('No se pudo fijar el punto. Probá al aire libre o con GPS activo.');
    } finally {
      setBusy(false);
    }
  };

  const address = place
    ? [place.street, place.streetNumber, place.city || place.subregion, place.region, place.country]
        .filter(Boolean)
        .join(', ')
    : '—';

  return (
    <Screen>
      <Masthead back title="Fijación" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32, gap: 12 }}>
        <Text style={{ color: c.muted, fontSize: 15, lineHeight: 22, marginBottom: 4 }}>
          Un disparo de alta precisión y, si hace falta, seguimiento continuo. La dirección sale de
          geocodificación inversa.
        </Text>

        <PrimaryButton
          label={busy ? 'Fijando…' : 'Fijar coordenadas'}
          onPress={pinpoint}
          disabled={busy}
        />
        <PrimaryButton
          tone="forest"
          label={watching ? 'Detener seguimiento' : 'Seguimiento en vivo'}
          onPress={async () => {
            if (watching) { setWatching(false); return; }
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') { setError('Permiso de ubicación denegado.'); return; }
            setWatching(true);
          }}
        />

        {error ? <Text style={{ color: c.accent, fontSize: 14, lineHeight: 20 }}>{error}</Text> : null}

        <Panel>
          <DataRow label="Latitud" value={fmt(fix?.latitude)} accent />
          <DataRow label="Longitud" value={fmt(fix?.longitude)} accent />
          <DataRow label="Precisión" value={fmt(fix?.accuracy, 1, ' m')} />
          <DataRow label="Altitud" value={fmt(fix?.altitude, 1, ' m')} />
          <DataRow label="Rumbo" value={fmt(fix?.heading, 1, '°')} />
          <DataRow label="Velocidad" value={fmt(fix?.speed, 2, ' m/s')} />
          <DataRow label="Dirección" value={address} />
        </Panel>
      </ScrollView>
    </Screen>
  );
}
