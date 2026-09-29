import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { CatalogItem } from './catalog';
import type { Theme } from './theme';

export function ComponentCard({
  item,
  theme,
  onTry,
}: {
  item: CatalogItem;
  theme: Theme;
  onTry: () => void;
}) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={[styles.icon, { backgroundColor: item.iconBg }]}>
          <Text style={[styles.iconText, { color: item.iconColor }]}>{item.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.desc, { color: theme.muted }]}>{item.description}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={onTry} style={styles.tryBtn}>
        <Text style={{ color: theme.accent, fontWeight: '700' }}>▶  Probar componente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 14,
    width: '100%',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
    fontWeight: '800',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    lineHeight: 18,
  },
  tryBtn: {
    alignSelf: 'flex-start',
  },
});
