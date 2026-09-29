import React from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CATALOG, LANDSCAPE, LIST_DATA, THUMBS, type ComponentId } from './catalog';
import { usePlayground } from './playground';
import type { Theme } from './theme';

function CheckBox({
  value,
  onValueChange,
  accent,
}: {
  value: boolean;
  onValueChange: (next: boolean) => void;
  accent: string;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      style={[
        styles.check,
        { borderColor: value ? accent : '#94A3B8', backgroundColor: value ? accent : 'transparent' },
      ]}
    >
      {value ? <Text style={styles.checkMark}>✓</Text> : null}
    </Pressable>
  );
}

export function ComponentDemo({
  id,
  theme,
  compact = false,
}: {
  id: ComponentId;
  theme: Theme;
  compact?: boolean;
}) {
  const { state, set } = usePlayground();

  switch (id) {
    case 'text':
      return (
        <View>
          <Text
            style={{
              color: theme.text,
              fontSize: compact ? 18 : state.textSize + 4,
              fontWeight: state.textWeight,
              marginBottom: 4,
            }}
          >
            Texto de ejemplo
          </Text>
          <Text style={{ color: theme.muted, fontSize: compact ? 13 : 14, marginBottom: 6 }}>
            Texto secundario
          </Text>
          <Text style={{ color: state.textColor, fontWeight: '600', fontSize: compact ? 13 : 14 }}>
            Texto en enlace
          </Text>
        </View>
      );
    case 'view':
      return (
        <View
          style={{
            backgroundColor: state.viewBg,
            borderRadius: state.viewRadius,
            paddingVertical: 18,
            paddingHorizontal: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#1E3A8A', fontWeight: '700' }}>Contenedor</Text>
          <Text style={{ color: '#1E3A8A' }}>con estilos</Text>
        </View>
      );
    case 'image':
      return (
        <Image
          source={{ uri: LANDSCAPE }}
          style={{
            width: '100%',
            height: compact ? 92 : 140,
            borderRadius: state.imageRadius,
          }}
        />
      );
    case 'button':
      return (
        <View style={{ alignItems: 'center', gap: 8 }}>
          <View
            style={{
              backgroundColor: theme.accent,
              borderRadius: 24,
              overflow: 'hidden',
              minWidth: 140,
            }}
          >
            <Button
              title={state.buttonTitle}
              color={Platform.OS === 'ios' ? '#FFFFFF' : theme.accent}
              onPress={() => set('buttonPresses', state.buttonPresses + 1)}
            />
          </View>
          {state.buttonPresses > 0 ? (
            <Text style={{ color: theme.muted, fontSize: 12 }}>
              Presionado {state.buttonPresses} {state.buttonPresses === 1 ? 'vez' : 'veces'}
            </Text>
          ) : null}
        </View>
      );
    case 'textinput':
      return (
        <TextInput
          value={state.inputValue}
          onChangeText={(v) => set('inputValue', v)}
          placeholder="Escribí algo..."
          placeholderTextColor={theme.muted}
          style={[
            styles.input,
            {
              color: theme.text,
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        />
      );
    case 'scrollview':
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {THUMBS.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.thumb} />
          ))}
        </ScrollView>
      );
    case 'flatlist':
      return (
        <FlatList
          data={LIST_DATA}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: compact ? 96 : 160 }}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => (
            <View style={[styles.listItem, { borderColor: theme.border }]}>
              <Text style={{ color: theme.text, fontWeight: '600' }}>{item.name}</Text>
            </View>
          )}
        />
      );
    case 'touchable':
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => set('touchCount', state.touchCount + 1)}
          style={[styles.touch, { backgroundColor: theme.accentSoft, borderColor: theme.accent }]}
        >
          <Text style={{ color: theme.accent, fontWeight: '700' }}>
            Toqué aquí {state.touchCount > 0 ? `(${state.touchCount})` : ''}
          </Text>
        </TouchableOpacity>
      );
    case 'switch':
      return (
        <View style={styles.rowCenter}>
          <Switch
            value={state.switchOn}
            onValueChange={(v) => set('switchOn', v)}
            trackColor={{ false: '#CBD5E1', true: theme.accent }}
            thumbColor="#FFFFFF"
          />
          <Text style={{ color: theme.text, fontWeight: '600' }}>
            {state.switchOn ? 'Activado' : 'Desactivado'}
          </Text>
        </View>
      );
    case 'checkbox':
      return (
        <Pressable style={styles.rowCenter} onPress={() => set('checked', !state.checked)}>
          <CheckBox value={state.checked} onValueChange={(v) => set('checked', v)} accent={theme.accent} />
          <Text style={{ color: theme.text }}>Aceptar términos</Text>
        </Pressable>
      );
    case 'activity':
      return (
        <View style={{ alignItems: 'center', paddingVertical: 8, gap: 8 }}>
          <ActivityIndicator size={state.spinnerSize} color={theme.accent} />
          <Text style={{ color: theme.muted, fontSize: 12 }}>Cargando…</Text>
        </View>
      );
    case 'modal':
      return (
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={[styles.touch, { backgroundColor: theme.accent }]}
            onPress={() => set('modalVisible', true)}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Abrir modal</Text>
          </TouchableOpacity>
          <Modal
            visible={state.modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => set('modalVisible', false)}
          >
            <View style={[styles.modalBackdrop, { backgroundColor: theme.overlay }]}>
              <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', marginBottom: 8 }}>
                  Contenido del modal
                </Text>
                <Text style={{ color: theme.muted, marginBottom: 16 }}>
                  Ventana emergente nativa. Cerrala para volver al catálogo.
                </Text>
                <TouchableOpacity
                  style={[styles.touch, { backgroundColor: theme.accent }]}
                  onPress={() => set('modalVisible', false)}
                >
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      );
    default:
      return null;
  }
}

export function liveCode(id: ComponentId, state: ReturnType<typeof usePlayground>['state']) {
  const item = CATALOG.find((c) => c.id === id);
  if (id === 'text') {
    return `<Text style={{
  color: '${state.textColor}',
  fontSize: ${state.textSize},
  fontWeight: '${state.textWeight}',
}}>
  Texto de ejemplo
</Text>`;
  }
  return item?.code ?? '';
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  thumb: {
    width: 88,
    height: 64,
    borderRadius: 10,
  },
  listItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  touch: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16,
  },
  modalBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
});
