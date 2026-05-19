import { Platform } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

/** Fixed header row height (back + title), excluding safe area. */
export const PAGE_FIXED_HEADER_HEIGHT = 44;

/** Title + subheader block inside the fixed header (excluding safe area). */
export const PAGE_FIXED_HEADER_WITH_SUBHEADER_HEIGHT = 52;

/** Extra breathing room below the status bar for fixed headers. */
export const PAGE_HEADER_TOP_EXTRA = 12;

/** Padding under the fixed header chrome (inside the bar). */
export const PAGE_FIXED_HEADER_BOTTOM_PADDING = 10;

/** Space between fixed header chrome and scroll content. */
export const CONTENT_GAP_BELOW_HEADER = 16;

const NAV_BAR_CONTENT_HEIGHT = Platform.select({
  ios: 64,
  android: 80,
  default: 64,
});
/** Center FAB sits above the tab bar — reserve space so lists scroll clear of it. */
const FAB_CLEARANCE = Platform.select({ ios: 32, android: 48, default: 32 });
/** Extra scroll room on Android (3-button nav often reports insets.bottom = 0). */
const ANDROID_SCROLL_EXTRA = 32;

type ScrollPaddingOptions = {
  /** @default true — tab screens with center FAB */
  includeFab?: boolean;
};

/** Bottom padding so scroll content clears the tab bar (+ FAB when shown). */
export function getScrollPaddingBottom(
  insets: EdgeInsets,
  options: ScrollPaddingOptions = {},
): number {
  const { includeFab = true } = options;
  const fab = includeFab ? FAB_CLEARANCE : 0;
  const platformExtra = Platform.OS === 'android' ? ANDROID_SCROLL_EXTRA : 0;

  return (
    NAV_BAR_CONTENT_HEIGHT +
    fab +
    Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 8) +
    platformExtra
  );
}

/** Screens without the bottom tab bar (support, auth, etc.). */
export function getScreenScrollPaddingBottom(insets: EdgeInsets): number {
  return Math.max(insets.bottom, 12) + 20;
}

/** Bottom padding when a sticky footer sits above the system/nav area. */
export function getFooterScrollPaddingBottom(insets: EdgeInsets): number {
  const platformExtra = Platform.OS === 'android' ? 24 : 12;
  return Math.max(insets.bottom, 12) + 72 + platformExtra;
}

type FixedHeaderOffsetOptions = {
  hasSubheader?: boolean;
  titleOnlyNoBack?: boolean;
};

/** Scroll `paddingTop` to clear the absolute fixed header. */
export function getFixedHeaderScrollOffset(
  insets: EdgeInsets,
  options: FixedHeaderOffsetOptions = {},
): number {
  const { hasSubheader = false, titleOnlyNoBack = false } = options;

  let bodyHeight = PAGE_FIXED_HEADER_HEIGHT;
  if (hasSubheader) {
    bodyHeight = PAGE_FIXED_HEADER_WITH_SUBHEADER_HEIGHT;
  } else if (titleOnlyNoBack) {
    bodyHeight = 40;
  }

  return (
    insets.top +
    PAGE_HEADER_TOP_EXTRA +
    bodyHeight +
    PAGE_FIXED_HEADER_BOTTOM_PADDING +
    CONTENT_GAP_BELOW_HEADER
  );
}
