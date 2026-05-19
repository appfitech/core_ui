import { colors } from '@/constants/colors';
import { FullTheme } from '@/types/theme';

/** Maps design tokens → legacy `FullTheme` shape used across the app. */
export function buildTheme(): FullTheme {
  const { brand, background, text, border, icon, status } = colors;

  return {
    isDark: true,

    primary: brand.primary,
    secondary: background.card,
    tertiary: text.tertiary,

    green100: status.success.bgStrong,
    green200: '#0A2E0E',
    green300: brand.primaryDark,
    green400: '#248F24',
    green500: brand.primary,
    green600: brand.primaryLight,
    green700: '#7DDA7D',
    green800: '#9AE89A',
    green900: '#B8F5B8',

    dark100: background.app,
    dark200: background.card,
    dark300: background.elevated,
    dark400: text.tertiary,
    dark500: text.disabled,
    dark600: text.secondary,
    dark700: icon.muted,
    dark800: icon.secondary,
    dark900: text.primary,

    success: status.success.icon,
    successBackground: status.success.bg,
    successBorder: status.success.border,
    successText: status.success.text,

    warning: status.warning.icon,
    warningBackground: status.warning.bg,
    warningBorder: status.warning.border,
    warningText: status.warning.text,

    error: status.error.icon,
    errorBackground: status.error.bg,
    errorBorder: status.error.border,
    errorText: status.error.text,

    info: status.info.icon,
    infoBackground: status.info.bg,
    infoBorder: status.info.border,
    infoText: status.info.text,

    orange: status.warning.icon,
    orangeBackground: status.warning.bgStrong,
    orangeBorder: status.warning.border,
    orangeText: status.warning.text,

    background: background.app,
    backgroundInverted: text.primary,
    backgroundInput: background.input,
    backgroundDropdown: background.cardHover,
    backgroundHeader: background.elevated,
    card: background.card,
    textPrimary: text.primary,
    textSecondary: text.secondary,
    border: border.default,
    icon: icon.secondary,
    primaryText: brand.primaryLight,
    primaryBg: brand.primarySoft,

    fixedHeaderTitleColor: text.primary,
    fixedHeaderSubheaderColor: text.secondary,
    fixedHeaderBorder: border.subtle,
    headerBackButtonBg: 'rgba(255, 255, 255, 0.05)',
    headerBackButtonBorder: border.default,
    headerBackButtonBorderWidth: 1,
  };
}

/** Active app theme — built from `colors`. */
export const THEME = buildTheme();

/** @deprecated Use `THEME`. */
export const DARK_THEME: FullTheme = THEME;

/** @deprecated Use `THEME`. */
export const LIGHT_THEME: FullTheme = THEME;
