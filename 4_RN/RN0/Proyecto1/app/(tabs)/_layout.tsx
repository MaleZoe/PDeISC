import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

import Colors from '@/constants/Colors';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAppTheme } from '@/context/ThemeContext';

function ThemeToggle() {
  const { scheme, toggle } = useAppTheme();
  return (
    <TouchableOpacity onPress={toggle} style={{ marginRight: 16, padding: 4 }}>
      <Text style={{ fontSize: 20 }}>{scheme === 'dark' ? '🌙' : '☀️'}</Text>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const { scheme } = useAppTheme();
  const theme = Colors[scheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerShadowVisible: false,
        headerShown: useClientOnlyValue(false, true),
        headerRight: () => <ThemeToggle />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hola Mundo',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'hand.wave', android: 'waving_hand', web: 'waving_hand' }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Estilos',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'paintbrush.fill', android: 'brush', web: 'brush' }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}
