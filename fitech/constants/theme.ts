import { colors } from '@/constants/colors';
import type { AppTheme } from '@/types/theme';

/** Active app theme — same structure as `colors` plus `isDark` and header layout tokens. */
export function buildTheme(): AppTheme {
  return {
    ...colors,
    isDark: true,
    header: {
      backButtonBg: 'rgba(255, 255, 255, 0.05)',
      backButtonBorderWidth: 1,
    },
  };
}

export const THEME = buildTheme();

/** @deprecated Use `THEME`. */
export const DARK_THEME: AppTheme = THEME;

/** @deprecated Use `THEME`. */
export const LIGHT_THEME: AppTheme = THEME;
