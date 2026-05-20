import { normalizeDeepLinkPath } from '@/utils/deep-link';

type NativeIntentOptions = {
  path: string;
  initial: boolean;
};

/**
 * Rewrites system deep links before Expo Router resolves the route.
 * Handles custom scheme hosts (`fitech://reset-password`) and alternate BE paths.
 */
export function redirectSystemPath({ path }: NativeIntentOptions): string {
  try {
    return normalizeDeepLinkPath(path);
  } catch {
    return path;
  }
}
