import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import { THEME } from '@/constants/theme';
import { THEME_PREFERENCE_KEY } from '@/constants/theme-storage';
import { FullTheme } from '@/types/theme';

type ThemeContextType = {
  theme: FullTheme;
  /** Always `'dark'` — light/system themes are no longer supported. */
  themePreference: 'dark';
  setThemePreference: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: THEME,
  themePreference: 'dark',
  setThemePreference: async () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    void AsyncStorage.setItem(THEME_PREFERENCE_KEY, 'dark');
  }, []);

  const setThemePreference = useCallback(async () => {
    await AsyncStorage.setItem(THEME_PREFERENCE_KEY, 'dark');
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme: THEME, themePreference: 'dark', setThemePreference }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
