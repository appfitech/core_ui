import { FullTheme } from '@/types/theme';

/**
 * Obsidian — dark, minimal chrome. Primary (#39CC39) reserved for actions and accents.
 */
const BRAND_PRIMARY = '#39CC39';

const OBSIDIAN = '#07090D';
const SURFACE_CARD = '#121820';
const SURFACE_RAISED = '#161D26';
const SURFACE_INPUT = '#0D1016';
const ON_SURFACE = '#E8EAED';
const ON_SURFACE_MUTED = '#9AA3B2';
const ON_SURFACE_SUBTLE = '#6B7585';
const BORDER_DEFAULT = 'rgba(255, 255, 255, 0.09)';
const BORDER_HEADER = 'rgba(255, 255, 255, 0.07)';
/** Barely lifted from page bg — no blue cast */
const GREEN_GLOW = '#4CD94A';

/** Single app theme (dark). Scales: 100 = darkest, 900 = lightest. */
export const THEME: FullTheme = {
  isDark: true,

  primary: BRAND_PRIMARY,
  secondary: SURFACE_CARD,
  tertiary: ON_SURFACE_SUBTLE,

  green100: '#041806',
  green200: '#0A3D12',
  green300: '#0F5C1A',
  green400: '#1F8A2A',
  green500: BRAND_PRIMARY,
  green600: GREEN_GLOW,
  green700: '#6BEF66',
  green800: '#8FF589',
  green900: '#C2FFC0',

  dark100: OBSIDIAN,
  dark200: SURFACE_CARD,
  dark300: SURFACE_RAISED,
  dark400: ON_SURFACE_SUBTLE,
  dark500: '#7D8A9C',
  dark600: ON_SURFACE_MUTED,
  dark700: '#7A8799',
  dark800: '#B8C0CC',
  dark900: ON_SURFACE,

  success: GREEN_GLOW,
  successBackground: '#0F2E14',
  successBorder: '#2FA838',
  successText: '#A8F5A4',

  warning: '#FFD54F',
  warningBackground: '#3D3208',
  warningBorder: '#E6B800',
  warningText: '#FFF4C2',

  error: '#FF8A80',
  errorBackground: '#4A0A0E',
  errorBorder: '#E85A52',
  errorText: '#FFDAD6',

  info: '#8EB4FF',
  infoBackground: '#152238',
  infoBorder: '#3D6BB3',
  infoText: '#D4E4FF',

  orange: '#FFAB5C',
  orangeBackground: '#3D220F',
  orangeBorder: '#E07A2E',
  orangeText: '#FFE2C4',

  background: OBSIDIAN,
  backgroundInverted: ON_SURFACE,
  backgroundInput: SURFACE_INPUT,
  backgroundDropdown: SURFACE_RAISED,
  card: SURFACE_CARD,
  textPrimary: ON_SURFACE,
  textSecondary: ON_SURFACE_MUTED,
  border: BORDER_DEFAULT,
  icon: GREEN_GLOW,
  primaryText: GREEN_GLOW,
  primaryBg: '#143D18',

  fixedHeaderTitleColor: ON_SURFACE,
  fixedHeaderSubheaderColor: 'rgba(232, 234, 237, 0.72)',
  fixedHeaderBorder: BORDER_HEADER,
  headerBackButtonBg: 'rgba(255, 255, 255, 0.06)',
  headerBackButtonBorder: 'rgba(255, 255, 255, 0.1)',
  headerBackButtonBorderWidth: 1,
};

/** @deprecated Use `THEME`. */
export const DARK_THEME: FullTheme = THEME;

/** @deprecated Use `THEME`. */
export const LIGHT_THEME: FullTheme = THEME;
