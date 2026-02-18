import { FullTheme } from '@/types/theme';

/**
 * Main brand color from icon_2.png (F logo green).
 * Palette is tuned for light mode first; green scale and dark scale
 * are chosen so UI and text keep clear contrast and don’t get lost.
 */
const BRAND_PRIMARY = '#39CC39';

const COLORS = {
  light: {
    isDark: false,

    // Core roles — primary from icon_2.png
    primary: BRAND_PRIMARY,
    secondary: '#0D1F2D',
    tertiary: '#6EE76E',

    // Green scale derived from brand (#39CC39): light → dark for backgrounds, borders, text
    green100: '#E6FCE6',
    green200: '#B8F5B8',
    green300: '#8AEE8A',
    green400: '#5CE65C',
    green500: BRAND_PRIMARY,
    green600: '#2EB82E',
    green700: '#249F24',
    green800: '#1A751A',
    green900: '#0F4D0F',

    // Dark scale — clear steps so text/surfaces don’t get lost on light bg
    dark100: '#F5F6F8',
    dark200: '#E4E6EA',
    dark300: '#C2C6CE',
    dark400: '#9CA3AF',
    dark500: '#6B7280',
    dark600: '#4B5563',
    dark700: '#374151',
    dark800: '#1F2937',
    dark900: '#0D1F2D',

    // Status — stronger contrast for badges and text
    success: '#22C55E',
    successBackground: '#DCFCE7',
    successBorder: '#86EFAC',
    successText: '#166534',

    warning: '#EAB308',
    warningBackground: '#FEF9C3',
    warningBorder: '#FDE047',
    warningText: '#854D0E',

    error: '#DC2626',
    errorBackground: '#FEE2E2',
    errorBorder: '#FCA5A5',
    errorText: '#B91C1C',

    info: '#2563EB',
    infoBackground: '#DBEAFE',
    infoBorder: '#93C5FD',
    infoText: '#1D4ED8',

    orange: '#EA580C',
    orangeBackground: '#FFEDD5',
    orangeBorder: '#FDBA74',
    orangeText: '#C2410C',

    // UI — high contrast so nothing gets lost
    background: '#FFFFFF',
    backgroundInverted: '#0D1F2D',
    backgroundInput: '#F5F6F8',
    backgroundDropdown: '#E4E6EA',
    backgroundHeader: '#0D1F2D',
    card: '#F9FAFB',
    textPrimary: '#0D1F2D',
    textSecondary: '#4B5563',
    border: '#E5E7EB',
    icon: BRAND_PRIMARY,
    primaryText: '#166534',
    primaryBg: '#E6FCE6',
  },

  dark: {
    isDark: true,

    primary: '#4ADE4A',
    secondary: '#F5F6F8',
    tertiary: '#6EE76E',

    green100: '#0F4D0F',
    green200: '#1A751A',
    green300: '#249F24',
    green400: '#2EB82E',
    green500: '#4ADE4A',
    green600: '#6EE76E',
    green700: '#8AEE8A',
    green800: '#B8F5B8',
    green900: '#E6FCE6',

    dark100: '#0D1F2D',
    dark200: '#1F2937',
    dark300: '#374151',
    dark400: '#4B5563',
    dark500: '#6B7280',
    dark600: '#9CA3AF',
    dark700: '#C2C6CE',
    dark800: '#E4E6EA',
    dark900: '#F5F6F8',

    success: '#4ADE80',
    successBackground: '#14532D',
    successBorder: '#166534',
    successText: '#BBF7D0',

    warning: '#FACC15',
    warningBackground: '#854D0E',
    warningBorder: '#A16207',
    warningText: '#FEF08A',

    error: '#F87171',
    errorBackground: '#7F1D1D',
    errorBorder: '#B91C1C',
    errorText: '#FECACA',

    info: '#60A5FA',
    infoBackground: '#1E3A8A',
    infoBorder: '#2563EB',
    infoText: '#BFDBFE',

    orange: '#FB923C',
    orangeBackground: '#7C2D12',
    orangeBorder: '#C2410C',
    orangeText: '#FFEDD5',

    background: '#0D1F2D',
    backgroundInverted: '#FFFFFF',
    backgroundInput: '#1F2937',
    backgroundDropdown: '#374151',
    backgroundHeader: '#0D1F2D',
    card: '#1F2937',
    textPrimary: '#F5F6F8',
    textSecondary: '#9CA3AF',
    border: '#374151',
    icon: '#4ADE4A',
    primaryText: '#86EFAC',
    primaryBg: '#14532D',
  },
};

export const LIGHT_THEME: FullTheme = {
  ...COLORS.light,
};

export const DARK_THEME: FullTheme = {
  ...COLORS.dark,
};
