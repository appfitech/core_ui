import { FullTheme } from '@/types/theme';

/**
 * Kinetic Obsidian — dark-only. Primary stays #39CC39; surfaces and text tuned
 * for clearer hierarchy and stronger contrast on obsidian backgrounds.
 */
const BRAND_PRIMARY = '#39CC39';

const OBSIDIAN = '#050608';
const SURFACE_CARD = '#121820';
const SURFACE_RAISED = '#1A2230';
const SURFACE_INPUT = '#0C0F14';
const ON_SURFACE = '#ECEEF2';
const ON_SURFACE_MUTED = '#9DA8B9';
const ON_SURFACE_SUBTLE = '#6F7D92';
const BORDER_DEFAULT = '#2E3D34';
const BORDER_HEADER = 'rgba(82, 226, 77, 0.28)';
/** Elevated chrome — must read clearly above OBSIDIAN page background */
const SURFACE_HEADER = '#1A2230';
const GREEN_GLOW = '#52E24D';

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
  backgroundHeader: SURFACE_HEADER,
  card: SURFACE_CARD,
  textPrimary: ON_SURFACE,
  textSecondary: ON_SURFACE_MUTED,
  border: BORDER_DEFAULT,
  icon: GREEN_GLOW,
  primaryText: GREEN_GLOW,
  primaryBg: '#143D18',

  fixedHeaderTitleColor: ON_SURFACE,
  fixedHeaderSubheaderColor: 'rgba(236, 238, 242, 0.85)',
  fixedHeaderBorder: BORDER_HEADER,
  headerBackButtonBg: 'rgba(57, 204, 57, 0.22)',
  headerBackButtonBorder: 'rgba(82, 226, 77, 0.5)',
  headerBackButtonBorderWidth: 1,
};

/** @deprecated Use `THEME`. */
export const DARK_THEME: FullTheme = THEME;

/** @deprecated Use `THEME`. */
export const LIGHT_THEME: FullTheme = THEME;
