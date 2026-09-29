import React, { createContext, useContext, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type Scheme = 'light' | 'dark';

interface ThemeContextType {
  scheme: Scheme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  scheme: 'light',
  toggle: () => {},
});

function toScheme(value: string | null | undefined): Scheme {
  return value === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useSystemColorScheme();
  const [scheme, setScheme] = useState<Scheme>(() => toScheme(system));

  const toggle = () => setScheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ scheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
