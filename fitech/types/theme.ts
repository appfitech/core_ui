import type { AppColors } from '@/constants/colors';

/** App theme: design tokens from `colors` plus layout-only values. */
export type AppTheme = AppColors & {
  isDark: boolean;
  header: {
    backButtonBg: string;
    backButtonBorderWidth: number;
  };
};
