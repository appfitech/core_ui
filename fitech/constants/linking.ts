/** Deep link / universal link configuration (must match app.json). */
export const LINKING = {
  scheme: 'fitech',
  /** Host for Universal Links (iOS) and App Links (Android). */
  host: 'appfitech.com',
  paths: {
    verifyEmail: '/verify-email',
  },
} as const;

/** Example email link: https://appfitech.com/verify-email?token=... */
export function buildVerifyEmailUrl(token: string): string {
  const params = new URLSearchParams({ token });
  return `https://${LINKING.host}${LINKING.paths.verifyEmail}?${params.toString()}`;
}
