import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

import { DARK_THEME, LIGHT_THEME } from '@/constants/theme';
import {
  THEME_PREFERENCE_KEY,
  ThemePreference,
} from '@/constants/theme-storage';
import { FullTheme } from '@/types/theme';

type ThemeContextType = {
  theme: FullTheme;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: LIGHT_THEME,
  themePreference: 'system',
  setThemePreference: async () => {},
});

function resolveTheme(preference: ThemePreference): FullTheme {
  if (preference === 'light') return LIGHT_THEME;
  if (preference === 'dark') return DARK_THEME;
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>('system');
  const [theme, setTheme] = useState<FullTheme>(() =>
    resolveTheme('system'),
  );
  const [hydrated, setHydrated] = useState(false);

  const applyPreference = useCallback((preference: ThemePreference) => {
    setThemePreferenceState(preference);
    setTheme(resolveTheme(preference));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (
          stored === 'light' ||
          stored === 'dark' ||
          stored === 'system'
        ) {
          applyPreference(stored);
        }
      } finally {
        setHydrated(true);
      }
    })();
  }, [applyPreference]);

  useEffect(() => {
    if (!hydrated || themePreference !== 'system') return;
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME);
    });
    return () => listener.remove();
  }, [hydrated, themePreference]);

  const setThemePreference = useCallback(
    async (preference: ThemePreference) => {
      setThemePreferenceState(preference);
      setTheme(resolveTheme(preference));
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, preference);
    },
    [],
  );

  return (
    <ThemeContext.Provider
      value={{ theme, themePreference, setThemePreference }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
