import { FullTheme } from '@/app/types/theme';

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
    warning: '#FFC107',
    error: '#F44336',

    // UI
    background: '#FFFFFF',
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
    primary: '#5BC236',
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

    // Dark scale (light → dark)
    dark100: '#D3D9E1',
    dark200: '#A7B2C4',
    dark300: '#7B8BA7',
    dark400: '#4F648A',
    dark500: '#2F425E',
    dark600: '#1D2B3E',
    dark700: '#131D2B',
    dark800: '#0B1927',
    dark900: '#000000',

    // Status
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',

    // UI
    background: '#0B1927',
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
