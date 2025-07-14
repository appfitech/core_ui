import { FullTheme } from '@/types/theme';

const COLORS = {
  light: {
    isDark: false,

    // Core roles
    primary: '#5BC236',
    secondary: '#0B1927', // deep blue-black for contrast
    tertiary: '#A2E57E',

    // Green scale (light → dark)
    green100: '#E9FAD6',
    green200: '#D1F0AA',
    green300: '#B9E47D',
    green400: '#9FD752',
    green500: '#5BC236',
    green600: '#4AA22D',
    green700: '#3A8124',
    green800: '#2A611A',
    green900: '#1A4111',

    // Dark scale (gray-black progression)
    dark100: '#F0F2F5',
    dark200: '#D9DDE2',
    dark300: '#B0B6BE',
    dark400: '#88919C',
    dark500: '#606B77',
    dark600: '#3E4650',
    dark700: '#262C33',
    dark800: '#13161B',
    dark900: '#0B1927',

    // Status
    success: '#4CAF50',
    successBackground: '#E8F5E9',
    successBorder: '#C8E6C9',
    successText: '#2E7D32',

    warning: '#FFC107',
    warningBackground: '#FFF8DC',
    warningBorder: '#FFE082',
    warningText: '#7C5700',

    error: '#F44336',
    errorBackground: '#FFEBEE',
    errorBorder: '#FFCDD2',
    errorText: '#C62828',

    // Info (cool blue tones)
    info: '#2196F3',
    infoBackground: '#E3F2FD',
    infoBorder: '#BBDEFB',
    infoText: '#1565C0',

    // Orange (for neutral attention or callouts)
    orange: '#FB8C00',
    orangeBackground: '#FFF3E0',
    orangeBorder: '#FFB74D',
    orangeText: '#E65100',

    // UI
    background: '#FFFFFF',
    backgroundInverted: '#0B1927',
    backgroundInput: '#F0F2F5',
    backgroundDropdown: '#D9DDE2',
    backgroundHeader: '#D9DDE2',
    card: '#F5F5F5',
    textPrimary: '#0B1927',
    textSecondary: '#4F4F4F',
    border: '#E0E0E0',
    icon: '#5BC236',
    primaryText: '#3A8124',
    primaryBg: '#E9FAD6',
  },

  dark: {
    isDark: true,

    // Core roles
    primary: '#3A8F29',
    secondary: '#FFFFFF',
    tertiary: '#A2E57E',

    // Green scale (dark → light)
    green100: '#1A4111',
    green200: '#2A611A',
    green300: '#3A8124',
    green400: '#4AA22D',
    green500: '#5BC236',
    green600: '#7CD05F',
    green700: '#9DDD91',
    green800: '#BEEAC4',
    green900: '#DFF7F6',

    // ✅ Inverted dark scale (light → dark names, but actual light values)
    dark100: '#000000',
    dark200: '#0B1927',
    dark300: '#13161B',
    dark400: '#262C33',
    dark500: '#3E4650',
    dark600: '#606B77',
    dark700: '#88919C',
    dark800: '#B0B6BE',
    dark900: '#D9DDE2',

    // Status
    success: '#81C784',
    successBackground: '#1B5E20',
    successBorder: '#2E7D32',
    successText: '#A5D6A7',

    warning: '#FFD54F',
    warningBackground: '#FF6F00',
    warningBorder: '#FFA000',
    warningText: '#FFF59D',

    error: '#E57373',
    errorBackground: '#B71C1C',
    errorBorder: '#C62828',
    errorText: '#FFCDD2',

    // Info (bright-to-deep blue tones)
    info: '#64B5F6',
    infoBackground: '#0D47A1',
    infoBorder: '#1976D2',
    infoText: '#90CAF9',

    // Orange
    orange: '#FF9800',
    orangeBackground: '#EF6C00',
    orangeBorder: '#F57C00',
    orangeText: '#FFE0B2',

    // UI
    background: '#0B1927',
    backgroundInverted: '#FFFFFF',
    backgroundInput: '#262C33',
    backgroundDropdown: '#3E4650',
    backgroundHeader: '#000000',
    card: '#121212',
    textPrimary: '#FFFFFF',
    textSecondary: '#C4C4C4',
    border: '#333333',
    icon: '#A2E57E',
    primaryText: '#A2E57E',
    primaryBg: '#1A4111',
  },
};

export const LIGHT_THEME: FullTheme = {
  ...COLORS.light,
};

export const DARK_THEME: FullTheme = {
  ...COLORS.dark,
};
