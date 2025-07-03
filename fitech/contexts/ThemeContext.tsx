import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

import { DARK_THEME, LIGHT_THEME } from '@/constants/theme';
import { FullTheme } from '@/types/theme';

type ThemeContextType = {
  theme: FullTheme;
  setTheme: (theme: FullTheme) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: LIGHT_THEME,
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<FullTheme>(
    colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME,
  );

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME);
    });
    return () => listener.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
