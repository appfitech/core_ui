/**
 * FITECH color tokens — source of truth for the dark UI palette.
 * Exposed app-wide via `useTheme()` / `THEME` (`constants/theme.ts`).
 */
export const colors = {
  brand: {
    primary: '#39CC39',
    primaryDark: '#2BAA2B',
    primaryLight: '#6BE66B',
    primarySoft: 'rgba(57, 204, 57, 0.14)',
    primaryMuted: 'rgba(57, 204, 57, 0.08)',
  },

  background: {
    app: '#050607',
    screen: '#080A0B',
    elevated: '#0D0F10',
    card: '#111315',
    cardHover: '#15181A',
    input: '#151719',
    modal: '#101214',
    overlay: 'rgba(0, 0, 0, 0.72)',
  },

  text: {
    primary: '#F5F7F5',
    secondary: '#B8BFB8',
    tertiary: '#7E877E',
    disabled: '#555C55',
    inverse: '#031003',
  },

  border: {
    subtle: '#1D2124',
    default: '#282D31',
    strong: '#383F45',
    focus: '#39CC39',
  },

  icon: {
    primary: '#F5F7F5',
    secondary: '#9AA39A',
    muted: '#646D64',
    active: '#39CC39',
  },

  status: {
    success: {
      bg: 'rgba(57, 204, 57, 0.12)',
      bgStrong: '#102A12',
      border: 'rgba(57, 204, 57, 0.42)',
      text: '#8AF28A',
      icon: '#39CC39',
    },
    warning: {
      bg: 'rgba(245, 184, 75, 0.12)',
      bgStrong: '#2A1D08',
      border: 'rgba(245, 184, 75, 0.4)',
      text: '#FFD98A',
      icon: '#F5B84B',
    },
    error: {
      bg: 'rgba(255, 90, 95, 0.12)',
      bgStrong: '#2A0D10',
      border: 'rgba(255, 90, 95, 0.42)',
      text: '#FFB4B8',
      icon: '#FF5A5F',
    },
    info: {
      bg: 'rgba(77, 163, 255, 0.12)',
      bgStrong: '#0B1C2E',
      border: 'rgba(77, 163, 255, 0.38)',
      text: '#B8DAFF',
      icon: '#4DA3FF',
    },
  },

  button: {
    primaryBg: '#39CC39',
    primaryText: '#031003',

    secondaryBg: '#15181A',
    secondaryText: '#F5F7F5',
    secondaryBorder: '#282D31',

    ghostBg: 'transparent',
    ghostText: '#F5F7F5',

    dangerBg: '#FF5A5F',
    dangerText: '#120406',
  },
} as const;

export type AppColors = typeof colors;
