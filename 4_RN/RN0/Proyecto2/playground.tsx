import React, { createContext, useContext, useMemo, useState } from 'react';

export type PlaygroundState = {
  textColor: string;
  textSize: number;
  textWeight: '400' | '600' | '700' | '800';
  viewBg: string;
  viewRadius: number;
  imageRadius: number;
  buttonTitle: string;
  buttonPresses: number;
  inputValue: string;
  switchOn: boolean;
  checked: boolean;
  spinnerSize: 'small' | 'large';
  modalVisible: boolean;
  touchCount: number;
};

const DEFAULT_STATE: PlaygroundState = {
  textColor: '#3B82F6',
  textSize: 16,
  textWeight: '700',
  viewBg: '#DBEAFE',
  viewRadius: 12,
  imageRadius: 12,
  buttonTitle: 'Presionar',
  buttonPresses: 0,
  inputValue: '',
  switchOn: true,
  checked: true,
  spinnerSize: 'large',
  modalVisible: false,
  touchCount: 0,
};

type Ctx = {
  state: PlaygroundState;
  set: <K extends keyof PlaygroundState>(key: K, value: PlaygroundState[K]) => void;
  patch: (partial: Partial<PlaygroundState>) => void;
};

const PlaygroundContext = createContext<Ctx | null>(null);

export function PlaygroundProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlaygroundState>(DEFAULT_STATE);

  const value = useMemo<Ctx>(
    () => ({
      state,
      set: (key, value) => setState((prev) => ({ ...prev, [key]: value })),
      patch: (partial) => setState((prev) => ({ ...prev, ...partial })),
    }),
    [state],
  );

  return <PlaygroundContext.Provider value={value}>{children}</PlaygroundContext.Provider>;
}

export function usePlayground() {
  const ctx = useContext(PlaygroundContext);
  if (!ctx) throw new Error('usePlayground must be used inside PlaygroundProvider');
  return ctx;
}
