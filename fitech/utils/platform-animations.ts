import { Platform } from 'react-native';
import {
  FadeIn,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutLeft,
} from 'react-native-reanimated';

const isAndroid = Platform.OS === 'android';

/** Delay before revealing login form (iOS keeps the staged reveal). */
export const AUTH_UI_REVEAL_DELAY_MS = isAndroid ? 80 : 600;

/** Fade-in-up on iOS; simple fade on Android (no vertical slide). */
export function authFadeInUp(duration = 600, delay = 0) {
  if (isAndroid) {
    return FadeIn.duration(Math.min(duration, 220)).delay(Math.min(delay, 60));
  }

  return FadeInUp.duration(duration).delay(delay);
}

/** Register step enter transition. */
export function authStepEnter() {
  if (isAndroid) {
    return FadeIn.duration(180);
  }

  return FadeInRight.duration(280);
}

/** Register step exit transition. */
export function authStepExit() {
  if (isAndroid) {
    return FadeOut.duration(120);
  }

  return FadeOutLeft.duration(200);
}

/** Card / panel entrance on auth screens. */
export function authCardEnter() {
  if (isAndroid) {
    return FadeIn.duration(200);
  }

  return FadeInUp.duration(250);
}

/** Button ZoomIn is costly on Android — skip on auth CTAs. */
export function shouldAnimateAuthButtons() {
  return !isAndroid;
}
