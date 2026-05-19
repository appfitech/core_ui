import { Platform } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

/** Fixed header row height (back + title), excluding safe area. */
export const PAGE_FIXED_HEADER_HEIGHT = 60;

/** Extra breathing room below the status bar for fixed headers. */
export const PAGE_HEADER_TOP_EXTRA = 12;

/** Space between fixed header chrome and scroll content. */
export const CONTENT_GAP_BELOW_HEADER = 24;

const NAV_BAR_CONTENT_HEIGHT = 56;
/** Center FAB sits above the tab bar — reserve space so lists scroll clear of it. */
const FAB_CLEARANCE = 44;
const ANDROID_SCROLL_EXTRA = 28;

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
    Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 8) +
    platformExtra
  );
}

/** Bottom padding when a sticky footer sits above the system/nav area. */
export function getFooterScrollPaddingBottom(insets: EdgeInsets): number {
  const platformExtra = Platform.OS === 'android' ? 32 : 16;
  return Math.max(insets.bottom, 16) + 88 + platformExtra;
}
