import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

/**
 * Shared stack transitions for expo-router `<Stack />`.
 *
 * Android's default push animation can look like a zoom/expand; `ios_from_right`
 * uses a horizontal slide similar to iOS (no-op on iOS — keeps platform default).
 */
export const STACK_SCREEN_OPTIONS: NativeStackNavigationOptions = {
  headerShown: false,
  contentStyle: { flex: 1 },
  gestureEnabled: true,
  animation: Platform.OS === 'android' ? 'ios_from_right' : 'default',
  animationTypeForReplace: 'push',
};

/**
 * Top-level tab destinations — tab bar + premium FAB stay visible here only.
 * Nested routes (detail screens, lists opened from a tab, profile sub-pages, etc.) hide the bar.
 */
export const NAV_BAR_ROOT_ROUTES = [
  'home',
  'workouts',
  'trainers',
  'trainer-clients',
  'profile',
  'premium-features',
] as const;

export function shouldShowNavBar(segments: readonly string[]): boolean {
  const path = segments.filter(Boolean);
  const root = path[0];
  if (!root || path.length > 1) return false;
  return (NAV_BAR_ROOT_ROUTES as readonly string[]).includes(root);
}
