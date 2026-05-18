export const THEME_PREFERENCE_KEY = '@fitech/theme_preference';

/** Dark-only app; legacy values are migrated to `'dark'` on launch. */
export type ThemePreference = 'dark';

export const THEME_PREFERENCE_LABELS: Record<ThemePreference, string> = {
  dark: 'Kinetic Obsidian',
};
