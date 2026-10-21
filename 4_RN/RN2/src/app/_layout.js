import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { makeColors } from '../theme';

function Inner() {
  const { dark } = useTheme();
  const c = makeColors(dark);
  return (
    <>
      <StatusBar style={dark ? 'light' : 'dark'} backgroundColor={c.bg} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: c.bg },
          animation: 'fade',
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Inner />
    </ThemeProvider>
  );
}
