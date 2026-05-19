import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';

type TabBarInsetContextValue = {
  bottomInset: number;
  setBottomInset: (height: number) => void;
};

const FALLBACK_INSET = Platform.select({ ios: 100, android: 128, default: 100 });

const TabBarInsetContext = createContext<TabBarInsetContextValue>({
  bottomInset: FALLBACK_INSET,
  setBottomInset: () => {},
});

export function TabBarInsetProvider({ children }: { children: React.ReactNode }) {
  const [bottomInset, setBottomInsetState] = useState(FALLBACK_INSET);

  const setBottomInset = useCallback((height: number) => {
    setBottomInsetState(Math.max(0, Math.ceil(height)));
  }, []);

  const value = useMemo(
    () => ({ bottomInset, setBottomInset }),
    [bottomInset, setBottomInset],
  );

  return (
    <TabBarInsetContext.Provider value={value}>
      {children}
    </TabBarInsetContext.Provider>
  );
}

export function useTabBarInset() {
  return useContext(TabBarInsetContext).bottomInset;
}

export function useSetTabBarInset() {
  return useContext(TabBarInsetContext).setBottomInset;
}
