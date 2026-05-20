/** Deep link / universal link configuration (must match app.json). */
export const LINKING = {
  scheme: 'fitech',
  /** Host for Universal Links (iOS) and App Links (Android). */
  host: 'appfitech.com',
  paths: {
    verifyEmail: '/verify-email',
    resetPassword: '/reset-password',
  },
} as const;

/** HTTPS link — opens the app on Android only when App Links are verified (see docs/ANDROID_APP_LINKS.md). */
export function buildVerifyEmailUrl(token: string): string {
  const params = new URLSearchParams({ token });
  return `https://${LINKING.host}${LINKING.paths.verifyEmail}?${params.toString()}`;
}

/** Custom-scheme link — opens the app without Digital Asset Links (use as fallback in emails). */
export function buildVerifyEmailAppUrl(token: string): string {
  const params = new URLSearchParams({ token });
  return `${LINKING.scheme}://verify-email?${params.toString()}`;
}

export function buildResetPasswordUrl(token: string): string {
  const params = new URLSearchParams({ token });
  return `https://${LINKING.host}${LINKING.paths.resetPassword}?${params.toString()}`;
}

export function buildResetPasswordAppUrl(token: string): string {
  const params = new URLSearchParams({ token });
  return `${LINKING.scheme}://reset-password?${params.toString()}`;
}
