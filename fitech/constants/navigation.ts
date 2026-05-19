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
