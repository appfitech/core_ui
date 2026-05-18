import { FullTheme } from '@/types/theme';

/**
 * Kinetic Obsidian — dark-only design system.
 * @see DESIGN.md (Primary #39CC39, Secondary #1A1C23, Tertiary #4A5568, Neutral #050608)
 */
const BRAND_PRIMARY = '#39CC39';
const OBSIDIAN = '#050608';
const SURFACE_CARD = '#1A1C23';
const TERTIARY = '#4A5568';
const ON_SURFACE = '#E3E2E5';

/** Single app theme (dark). Scales: 100 = darkest, 900 = lightest. */
export const THEME: FullTheme = {
  isDark: true,

  primary: BRAND_PRIMARY,
  secondary: SURFACE_CARD,
  tertiary: TERTIARY,

  green100: '#002201',
  green200: '#005007',
  green300: '#006E0D',
  green400: '#249F24',
  green500: BRAND_PRIMARY,
  green600: '#52E24D',
  green700: '#5AE953',
  green800: '#75FF69',
  green900: '#B8F5B8',

  dark100: OBSIDIAN,
  dark200: SURFACE_CARD,
  dark300: '#1E2022',
  dark400: TERTIARY,
  dark500: '#879580',
  dark600: '#BCCBB4',
  dark700: '#879580',
  dark800: '#C5C6CF',
  dark900: ON_SURFACE,

  success: '#52E24D',
  successBackground: '#0F2910',
  successBorder: '#39CC39',
  successText: '#75FF69',

  warning: '#FACC15',
  warningBackground: '#3D3208',
  warningBorder: '#A16207',
  warningText: '#FEF08A',

  error: '#FFB4AB',
  errorBackground: '#93000A',
  errorBorder: '#FFB4AB',
  errorText: '#FFDAD6',

  info: '#A7B2C8',
  infoBackground: '#263142',
  infoBorder: '#3A4557',
  infoText: '#D8E3FA',

  orange: '#FB923C',
  orangeBackground: '#3D220F',
  orangeBorder: '#C2410C',
  orangeText: '#FFEDD5',

  background: OBSIDIAN,
  backgroundInverted: ON_SURFACE,
  backgroundInput: '#121316',
  backgroundDropdown: '#292A2D',
  backgroundHeader: SURFACE_CARD,
  card: SURFACE_CARD,
  textPrimary: ON_SURFACE,
  textSecondary: TERTIARY,
  border: '#3D4A39',
  icon: BRAND_PRIMARY,
  primaryText: BRAND_PRIMARY,
  primaryBg: '#1A3D1A',

  fixedHeaderTitleColor: ON_SURFACE,
  fixedHeaderSubheaderColor: 'rgba(227, 226, 229, 0.75)',
  headerBackButtonBg: 'rgba(74, 85, 104, 0.35)',
  headerBackButtonBorder: 'rgba(74, 85, 104, 0.5)',
  headerBackButtonBorderWidth: 1,
};

/** @deprecated Use `THEME`. Light mode is no longer supported. */
export const DARK_THEME: FullTheme = THEME;

/** @deprecated Use `THEME`. Alias kept for imports that referenced light theme. */
export const LIGHT_THEME: FullTheme = THEME;
