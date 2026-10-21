import { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

const Ctx = createContext({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }) {
  const system = useColorScheme();
  const [manual, setManual] = useState(null);
  const dark = manual !== null ? manual === 'dark' : system === 'dark';
  const value = useMemo(
    () => ({ dark, toggle: () => setManual(dark ? 'light' : 'dark') }),
    [dark]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
