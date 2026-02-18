export const THEME_PREFERENCE_KEY = '@fitech/theme_preference';

export type ThemePreference = 'light' | 'dark' | 'system';

export const THEME_PREFERENCE_LABELS: Record<ThemePreference, string> = {
  light: 'Claro',
  dark: 'Oscuro',
  system: 'Sistema (usar tema del dispositivo)',
};
